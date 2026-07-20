import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent
} from "react";

import { DialogPortal } from "@shared/ui/dialog-portal";

import styles from "./SearchCommandDialog.module.scss";
import {
  type SearchAction,
  type SearchActionSection,
  type SearchCommandMotionMode,
  type SearchCommandSection,
  type SearchContentSection
} from "./search-command.types";
import { isSearchActionSection } from "./search-command.utils";

type SearchCommandDialogProps = {
  dialogId?: string | undefined;
  isOpen: boolean;
  motionMode?: SearchCommandMotionMode;
  onClose: () => void;
  onSearchQuery: (query: string) => void;
  onSelectAction: (action: SearchAction) => void;
  query: string;
  sections: SearchCommandSection[];
  setQuery: (query: string) => void;
};

type IndexedSearchAction = {
  action: SearchAction;
  optionIndex: number;
};

type IndexedSearchActionSection = Omit<SearchActionSection, "items"> & {
  items: IndexedSearchAction[];
};

type RenderedSearchSection =
  | IndexedSearchActionSection
  | SearchContentSection;

// This matches the semantic --duration-menu token used by the dialog transition.
const exitAnimationFallbackDurationMs = 220;

function isRenderedActionSection(
  section: RenderedSearchSection
): section is IndexedSearchActionSection {
  return section.type === "actions";
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M17.5 17.5L13.875 13.875"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 4.5L4.5 13.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M4.5 4.5L13.5 13.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16667 4.16667H15.8333V15.8333H4.16667V4.16667Z"
        rx="2.16667"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7.08334 7.5H12.9167"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M7.08334 10H12.9167"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M7.08334 12.5H10.8333"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function matchesQuery(action: SearchAction, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [action.title, action.description, ...action.keywords].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  );
}

function matchesContentSectionQuery(
  section: SearchContentSection,
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [section.title, section.description, ...(section.keywords ?? [])]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function SearchCommandDialog({
  dialogId,
  isOpen,
  motionMode = "default",
  onClose,
  onSearchQuery,
  onSelectAction,
  query,
  sections,
  setQuery
}: SearchCommandDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const listboxId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [presenceState, setPresenceState] = useState<
    "opening" | "open" | "closing"
  >(isOpen ? "open" : "closing");
  const [activeIndex, setActiveIndex] = useState(0);
  const trimmedQuery = query.trim();
  const { actionCount, renderedSections } = useMemo(() => {
    let nextOptionIndex = 0;
    const nextRenderedSections: RenderedSearchSection[] = [];

    sections.forEach((section) => {
      if (isSearchActionSection(section)) {
        const items = section.items
          .filter((action) => matchesQuery(action, query))
          .map((action) => ({
            action,
            optionIndex: nextOptionIndex++
          }));

        if (items.length > 0) {
          nextRenderedSections.push({
            ...section,
            items
          });
        }

        return;
      }

      if (
        !trimmedQuery ||
        section.showWhenQuery ||
        matchesContentSectionQuery(section, query)
      ) {
        nextRenderedSections.push(section);
      }
    });

    return {
      actionCount: nextOptionIndex,
      renderedSections: nextRenderedSections
    };
  }, [query, sections, trimmedQuery]);
  const filteredActions = useMemo(
    () =>
      renderedSections.flatMap((section) =>
        isRenderedActionSection(section)
          ? section.items.map((item) => item.action)
          : []
      ),
    [renderedSections]
  );
  const shouldShowSearchAction = trimmedQuery.length > 0;
  const commandCount = actionCount + (shouldShowSearchAction ? 1 : 0);
  const activeOptionId =
    commandCount > 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  function runCommand(index: number) {
    const action = filteredActions[index];

    if (action) {
      onSelectAction(action);
      return;
    }

    if (shouldShowSearchAction && index === actionCount) {
      onSearchQuery(trimmedQuery);
    }
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();

      if (query) {
        setQuery("");
        setActiveIndex(0);
        inputRef.current?.focus();
        return;
      }

      onClose();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (commandCount === 0) {
        return;
      }

      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (currentIndex) =>
          (currentIndex + direction + commandCount) % commandCount
      );
      inputRef.current?.focus();
      return;
    }

    if (event.key === "Enter" && document.activeElement === inputRef.current) {
      if (commandCount === 0) {
        return;
      }

      event.preventDefault();
      runCommand(activeIndex);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = motionMode !== "instant" && !prefersReducedMotion;

    if (isOpen) {
      setIsRendered(true);

      if (!shouldAnimate) {
        setPresenceState("open");
        return undefined;
      }

      setPresenceState("opening");

      const frameId = window.requestAnimationFrame(() => {
        setPresenceState("open");
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
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
  }, [isOpen, isRendered, motionMode]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previouslyFocusedElement =
      document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousBodyOverflow;

      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeIndex >= commandCount) {
      setActiveIndex(Math.max(commandCount - 1, 0));
    }
  }, [activeIndex, commandCount]);

  if (!isRendered) {
    return null;
  }

  return (
    <DialogPortal>
      <div
        className={styles.root}
        data-motion={motionMode}
        data-state={presenceState}
      >
        <button
          aria-hidden="true"
          className={styles.overlay}
          tabIndex={-1}
          type="button"
          onClick={onClose}
        />

        <section
          ref={dialogRef}
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          aria-modal="true"
          className={styles.dialog}
          id={dialogId}
          role="dialog"
          onKeyDown={handleDialogKeyDown}
        >
          <h2 className={styles.dialogTitle} id={titleId}>
            Search
          </h2>
          <p className={styles.dialogDescription} id={descriptionId}>
            Jump to a page from anywhere in the dashboard.
          </p>

          <div className={styles.searchRow}>
            <label className={styles.label} htmlFor="mobile-search-command">
              Search the dashboard
            </label>
            <div className={styles.searchField}>
              <span aria-hidden="true" className={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                aria-activedescendant={activeOptionId}
                aria-controls={listboxId}
                aria-expanded="true"
                autoComplete="off"
                className={styles.input}
                id="mobile-search-command"
                placeholder="Search"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </div>
            {query ? (
              <button
                aria-label="Clear search"
                className={styles.clearButton}
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveIndex(0);
                  inputRef.current?.focus();
                }}
              >
                <CloseIcon />
              </button>
            ) : null}
          </div>

          <div
            className={styles.sections}
            id={listboxId}
            role={commandCount > 0 ? "listbox" : undefined}
          >
            {renderedSections.map((section) =>
              isRenderedActionSection(section) ? (
                <section
                  key={section.id}
                  aria-label={section.title}
                  className={styles.section}
                  role="group"
                >
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  <div className={styles.results}>
                    {section.items.map(({ action, optionIndex }) => (
                      <button
                        aria-selected={activeIndex === optionIndex}
                        className={styles.resultButton}
                        data-active={activeIndex === optionIndex}
                        id={`${listboxId}-option-${optionIndex}`}
                        key={action.id}
                        role="option"
                        tabIndex={-1}
                        type="button"
                        onClick={() => {
                          onSelectAction(action);
                        }}
                        onPointerMove={() => {
                          setActiveIndex(optionIndex);
                        }}
                      >
                        <span className={styles.resultLeading}>
                          <span aria-hidden="true" className={styles.resultIcon}>
                            <PageIcon />
                          </span>
                          <span className={styles.resultTitle}>{action.title}</span>
                        </span>
                        <span className={styles.resultMeta}>
                          {action.actionLabel ?? "Link"}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <section
                  key={section.id}
                  aria-label={section.title}
                  className={styles.section}
                  role={commandCount > 0 ? "presentation" : undefined}
                >
                  {section.title ? (
                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                  ) : null}
                  <div className={styles.contentSection}>{section.content}</div>
                </section>
              )
            )}

            {shouldShowSearchAction ? (
              <section
                aria-label="Search"
                className={styles.section}
                role="group"
              >
                <h3 className={styles.sectionTitle}>Search</h3>
                <div className={styles.results}>
                  <button
                    aria-selected={activeIndex === actionCount}
                    className={styles.resultButton}
                    data-active={activeIndex === actionCount}
                    id={`${listboxId}-option-${actionCount}`}
                    role="option"
                    tabIndex={-1}
                    type="button"
                    onClick={() => {
                      onSearchQuery(trimmedQuery);
                    }}
                    onPointerMove={() => {
                      setActiveIndex(actionCount);
                    }}
                  >
                    <span className={styles.resultLeading}>
                      <span aria-hidden="true" className={styles.resultIcon}>
                        <SearchIcon />
                      </span>
                      <span className={styles.resultTitle}>
                        Search for <strong>&quot;{trimmedQuery}&quot;</strong>
                      </span>
                    </span>
                    <span className={styles.resultMeta}>Action</span>
                  </button>
                </div>
              </section>
            ) : null}

            {filteredActions.length === 0 &&
            !shouldShowSearchAction &&
            renderedSections.length === 0 ? (
              <p className={styles.emptyState}>
                Start typing to search the dashboard.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </DialogPortal>
  );
}
