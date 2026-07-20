import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { DialogPortal } from "@shared/ui/dialog-portal";
import type { DataTablePopoverMotionMode } from "@shared/ui/data-table/model/dataTable.types";

import styles from "./DataTableFilterPopover.module.scss";

type PopoverPosition = {
  left: number;
  top: number;
  transformOrigin: string;
};

export interface DataTableFilterPopoverProps {
  id?: string;
  anchorElement: HTMLElement | null;
  isOpen: boolean;
  motionMode?: DataTablePopoverMotionMode;
  onClose: () => void;
  labelledBy?: string;
  children: ReactNode;
}

const viewportPadding = 16;
const popoverWidth = 270;
const exitAnimationFallbackDurationMs = 220;

function getTopNavigationBottom() {
  return document
    .querySelector<HTMLElement>("[data-top-navigation]")
    ?.getBoundingClientRect().bottom ?? 0;
}

function getPosition(
  anchorElement: HTMLElement,
  popoverElement: HTMLDivElement
): PopoverPosition {
  const rect = anchorElement.getBoundingClientRect();
  const width = Math.min(popoverWidth, window.innerWidth - viewportPadding * 2);
  const safeTop = Math.min(
    getTopNavigationBottom() + viewportPadding,
    window.innerHeight - viewportPadding
  );
  const anchoredTop = Math.max(safeTop, rect.bottom + 8);
  const availableHeightBelow = window.innerHeight - anchoredTop - viewportPadding;
  const shouldUseSafeTop = popoverElement.scrollHeight > availableHeightBelow;
  const left = Math.min(
    Math.max(viewportPadding, rect.left),
    window.innerWidth - width - viewportPadding
  );

  return {
    left,
    top: shouldUseSafeTop ? safeTop : anchoredTop,
    transformOrigin: shouldUseSafeTop
      ? "center top"
      : `${Math.min(
          Math.max(0, rect.left + rect.width / 2 - left),
          width
        )}px -0.5rem`
  };
}

export function DataTableFilterPopover({
  anchorElement,
  children,
  id,
  isOpen,
  labelledBy,
  motionMode = "default",
  onClose
}: DataTableFilterPopoverProps) {
  const generatedId = useId();
  const popoverId = id ?? generatedId;
  const popoverRef = useRef<HTMLDivElement>(null);
  const lastAnchorRef = useRef<HTMLElement | null>(null);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [presenceState, setPresenceState] = useState<"open" | "closing">("open");
  const [position, setPosition] = useState<PopoverPosition>({
    left: 0,
    top: 0,
    transformOrigin: "center top"
  });

  useEffect(() => {
    if (isOpen && anchorElement) {
      lastAnchorRef.current = anchorElement;
      setIsRendered(true);
      setPresenceState("open");
      return undefined;
    }

    if (!isRendered) {
      return undefined;
    }

    lastAnchorRef.current?.focus();
    lastAnchorRef.current = null;

    if (motionMode === "instant") {
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
  }, [anchorElement, isOpen, isRendered, motionMode]);

  useLayoutEffect(() => {
    if (!isOpen || !isRendered || !anchorElement) {
      return;
    }

    const updatePosition = () => {
      if (popoverRef.current) {
        setPosition(getPosition(anchorElement, popoverRef.current));
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorElement, isOpen, isRendered]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !popoverRef.current?.contains(target) &&
        !anchorElement?.contains(target)
      ) {
        onClose();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorElement, isOpen, onClose]);

  if (!isRendered) {
    return null;
  }

  const popoverStyle = {
    "--filter-popover-left": `${position.left}px`,
    "--filter-popover-origin": position.transformOrigin,
    "--filter-popover-top": `${position.top}px`
  } as CSSProperties;

  return (
    <DialogPortal>
      <div
        className={styles.root}
        data-motion={motionMode}
        data-state={presenceState}
      >
        <button
          aria-label="Close filters"
          className={styles.overlay}
          type="button"
          onClick={onClose}
        />
        <div
          aria-label={labelledBy ? undefined : "Filter records"}
          aria-labelledby={labelledBy}
          aria-hidden={presenceState === "closing" ? "true" : undefined}
          className={styles.popover}
          id={popoverId}
          ref={popoverRef}
          role="dialog"
          style={popoverStyle}
        >
          {children}
        </div>
      </div>
    </DialogPortal>
  );
}
