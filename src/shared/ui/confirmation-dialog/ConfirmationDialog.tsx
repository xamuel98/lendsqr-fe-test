import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent } from "react";

import { Button } from "@shared/ui/button";
import { DialogPortal } from "@shared/ui/dialog-portal";

import styles from "./ConfirmationDialog.module.scss";
import type { ConfirmationDialogProps } from "./ConfirmationDialog.types";

function getFocusableElements(dialog: HTMLElement | null) {
  return Array.from(
    dialog?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    ) ?? []
  );
}

export function ConfirmationDialog({
  confirmLabel,
  description,
  isConfirming = false,
  isOpen,
  onClose,
  onConfirm,
  title,
  tone = "primary"
}: ConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && !isConfirming) {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(dialogRef.current);
    const firstElement = focusableElements.at(0);
    const lastElement = focusableElements.at(-1);

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

  return (
    <DialogPortal>
      <div className={styles.root}>
        <button
          aria-hidden="true"
          className={styles.overlay}
          disabled={isConfirming}
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
          role="dialog"
          onKeyDown={handleKeyDown}
        >
          <header className={styles.header}>
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
            <button
              aria-label="Close confirmation"
              className={styles.closeButton}
              disabled={isConfirming}
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </header>

          <div className={styles.content}>
            <p className={styles.description} id={descriptionId}>
              {description}
            </p>
          </div>

          <footer className={styles.actions}>
            <Button
              className={styles.confirmButton}
              color={tone}
              fullWidth
              isLoading={isConfirming}
              loadingLabel="Confirming"
              size="login"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </footer>
        </section>
      </div>
    </DialogPortal>
  );
}
