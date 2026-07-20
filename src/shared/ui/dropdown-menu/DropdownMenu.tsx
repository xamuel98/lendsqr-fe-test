import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent as ReactPointerEvent
} from "react";

import { joinClassNames } from "@shared/lib/joinClassNames";
import { DialogPortal } from "@shared/ui/dialog-portal";

import styles from "./DropdownMenu.module.scss";
import type {
  DropdownMenuItemProps,
  DropdownMenuProps,
  DropdownMenuTriggerProps
} from "./DropdownMenu.types";

type DropdownMenuContextValue = {
  closeMenu: () => void;
};

type MenuPosition = {
  left: number;
  side: "bottom" | "top";
  top: number;
  transformOrigin: string;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);
const viewportPadding = 16;
const menuOffset = 8;
const exitAnimationFallbackDurationMs = 220;

function getMenuItems(menu: HTMLDivElement | null) {
  return Array.from(
    menu?.querySelectorAll<HTMLButtonElement>("[role='menuitem']:not(:disabled)") ?? []
  );
}

function getMenuPosition(
  anchorElement: HTMLElement,
  menuElement: HTMLDivElement,
  align: NonNullable<DropdownMenuProps["align"]>
): MenuPosition {
  const anchorRect = anchorElement.getBoundingClientRect();
  const menuRect = menuElement.getBoundingClientRect();
  const menuWidth = menuRect.width;
  const menuHeight = menuRect.height;
  const preferredLeft = align === "end" ? anchorRect.right - menuWidth : anchorRect.left;
  const canOpenAbove = anchorRect.top - menuOffset - menuHeight >= viewportPadding;
  const opensAbove =
    anchorRect.bottom + menuOffset + menuHeight > window.innerHeight - viewportPadding &&
    canOpenAbove;
  const preferredTop = opensAbove
    ? anchorRect.top - menuOffset - menuHeight
    : anchorRect.bottom + menuOffset;
  const left = Math.min(
    Math.max(viewportPadding, preferredLeft),
    window.innerWidth - menuWidth - viewportPadding
  );
  const originX = Math.min(
    Math.max(0, anchorRect.left + anchorRect.width / 2 - left),
    menuWidth
  );

  return {
    left,
    side: opensAbove ? "top" : "bottom",
    top: Math.min(
      Math.max(viewportPadding, preferredTop),
      window.innerHeight - menuHeight - viewportPadding
    ),
    transformOrigin: `${originX}px ${opensAbove ? menuHeight + menuOffset : -menuOffset}px`
  };
}

export function DropdownMenu({
  align = "end",
  ariaLabel,
  children,
  className,
  trigger
}: DropdownMenuProps) {
  const generatedId = useId();
  const menuId = `dropdown-menu-${generatedId}`;
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [presenceState, setPresenceState] = useState<"open" | "closing">("open");
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [position, setPosition] = useState<MenuPosition>({
    left: 0,
    side: "bottom",
    top: 0,
    transformOrigin: "center top"
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const focusOnOpenRef = useRef<"first" | "last">("first");
  const lastInteractionWasKeyboardRef = useRef(false);
  const shouldRestoreFocusRef = useRef(false);

  function closeMenu() {
    shouldRestoreFocusRef.current = true;
    setIsOpen(false);
  }

  function openMenu(
    nextAnchorElement: HTMLElement,
    focusTarget: "first" | "last" = "first",
    nextShouldAnimate = true
  ) {
    triggerRef.current = nextAnchorElement;
    focusOnOpenRef.current = focusTarget;
    setShouldAnimate(nextShouldAnimate);
    setAnchorElement(nextAnchorElement);
    setIsOpen(true);
  }

  function toggleMenu(nextAnchorElement: HTMLElement, nextShouldAnimate: boolean) {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    openMenu(nextAnchorElement, "first", nextShouldAnimate);
  }

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setPresenceState("open");
      return undefined;
    }

    if (!isRendered) {
      return undefined;
    }

    if (!shouldAnimate) {
      setIsRendered(false);
      return undefined;
    }

    setPresenceState("closing");

    const timeoutId = window.setTimeout(() => {
      setIsRendered(false);
    }, exitAnimationFallbackDurationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, isRendered, shouldAnimate]);

  useLayoutEffect(() => {
    if (!isOpen || !isRendered || !anchorElement || !menuRef.current) {
      return;
    }

    const updatePosition = () => {
      if (menuRef.current) {
        setPosition(getMenuPosition(anchorElement, menuRef.current, align));
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, anchorElement, isOpen, isRendered]);

  useLayoutEffect(() => {
    if (isOpen && isRendered) {
      const items = getMenuItems(menuRef.current);
      const targetItem =
        focusOnOpenRef.current === "last" ? items.at(-1) : items.at(0);

      targetItem?.focus();
      return;
    }

    if (shouldRestoreFocusRef.current) {
      triggerRef.current?.focus();
      shouldRestoreFocusRef.current = false;
    }
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isOpen]);

  function handleTriggerClick(event: MouseEvent<HTMLElement>) {
    trigger.props.onClick?.(event);

    if (!event.defaultPrevented) {
      toggleMenu(event.currentTarget, !lastInteractionWasKeyboardRef.current);
    }
  }

  function handleTriggerPointerDown(event: ReactPointerEvent<HTMLElement>) {
    trigger.props.onPointerDown?.(event);

    if (!event.defaultPrevented) {
      lastInteractionWasKeyboardRef.current = false;
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLElement>) {
    trigger.props.onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    lastInteractionWasKeyboardRef.current = true;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(
        event.currentTarget,
        event.key === "ArrowUp" ? "last" : "first",
        false
      );
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = getMenuItems(menuRef.current);
    const currentIndex = items.findIndex((item) => item === document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
      return;
    }

    if (items.length === 0) {
      return;
    }

    let nextIndex: number | undefined;

    if (event.key === "ArrowDown") {
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else if (event.key === "ArrowUp") {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      items[nextIndex]?.focus();
    }
  }

  const triggerElement = cloneElement(trigger, {
    ...(isOpen ? { "aria-controls": menuId } : {}),
    "aria-expanded": isOpen,
    "aria-haspopup": "menu",
    "data-state": isOpen ? "open" : "closed",
    onClick: handleTriggerClick,
    onKeyDown: handleTriggerKeyDown,
    onPointerDown: handleTriggerPointerDown
  });
  const menuStyle = {
    "--dropdown-menu-left": `${position.left}px`,
    "--dropdown-menu-origin": position.transformOrigin,
    "--dropdown-menu-top": `${position.top}px`
  } as CSSProperties;

  return (
    <DropdownMenuContext.Provider value={{ closeMenu }}>
      {triggerElement}

      {isRendered && anchorElement ? (
        <DialogPortal>
          <div
            aria-label={ariaLabel}
            aria-hidden={presenceState === "closing" ? "true" : undefined}
            className={joinClassNames(styles.menu, className)}
            data-motion={shouldAnimate ? "enter" : "instant"}
            data-state={presenceState}
            data-side={position.side}
            id={menuId}
            ref={menuRef}
            role="menu"
            style={menuStyle}
            onKeyDown={handleMenuKeyDown}
          >
            {children}
          </div>
        </DialogPortal>
      ) : null}
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuItem({
  children,
  className,
  icon,
  onClick,
  tone = "default",
  ...props
}: DropdownMenuItemProps) {
  const context = useContext(DropdownMenuContext);

  if (!context) {
    throw new Error("DropdownMenuItem must be used inside DropdownMenu.");
  }

  return (
    <button
      {...props}
      className={joinClassNames(styles.item, className)}
      data-tone={tone}
      role="menuitem"
      type="button"
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          context.closeMenu();
        }
      }}
    >
      {icon ? (
        <span aria-hidden="true" className={styles.icon}>
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div aria-hidden="true" className={styles.separator} />;
}

export function DropdownMenuTrigger({
  children,
  className,
  type = "button",
  ...props
}: DropdownMenuTriggerProps) {
  return (
    <button
      {...props}
      className={joinClassNames(styles.trigger, className)}
      type={type}
    >
      {children}
    </button>
  );
}
