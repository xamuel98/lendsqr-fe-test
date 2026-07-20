import { useId } from "react";
import type { MouseEvent } from "react";

import { joinClassNames } from "@shared/lib/joinClassNames";

import styles from "./Button.module.scss";
import type { ButtonProps } from "./Button.types";

export function Button({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  children,
  className,
  color = "primary",
  disabled,
  endIcon,
  fullWidth = false,
  isLoading = false,
  loadingLabel,
  size = "default",
  startIcon,
  type = "button",
  variant = "solid",
  ...rest
}: ButtonProps) {
  const loadingMessageId = useId();
  const isDisabled = disabled || isLoading;
  const accessibleLoadingLabel = loadingLabel ?? "Loading";

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      event.preventDefault();
    }
  }

  return (
    <>
      <button
        {...rest}
        aria-busy={isLoading || undefined}
        aria-describedby={
          isLoading
            ? [ariaDescribedBy, loadingMessageId].filter(Boolean).join(" ")
            : ariaDescribedBy
        }
        aria-label={isLoading ? accessibleLoadingLabel : ariaLabel}
        className={joinClassNames(styles.button, className)}
        data-color={color}
        data-size={size}
        data-variant={variant}
        data-width={fullWidth ? "full" : "auto"}
        disabled={isDisabled}
        onMouseDown={handleMouseDown}
        type={type}
      >
        <span className={styles.content}>
          {startIcon ? (
            <span
              aria-hidden="true"
              className={joinClassNames(styles.icon, isLoading && styles.loadingContent)}
            >
              {startIcon}
            </span>
          ) : null}

          <span
            aria-hidden={isLoading || undefined}
            className={joinClassNames(styles.label, isLoading && styles.loadingContent)}
          >
            {children}
          </span>

          {isLoading ? (
            <>
              {endIcon ? (
                <span aria-hidden="true" className={joinClassNames(styles.icon, styles.loadingContent)}>
                  {endIcon}
                </span>
              ) : null}
              <span aria-hidden="true" className={styles.spinner} />
            </>
          ) : endIcon ? (
            <span aria-hidden="true" className={styles.icon}>
              {endIcon}
            </span>
          ) : null}
        </span>
      </button>

      {isLoading ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          className="visually-hidden"
          id={loadingMessageId}
          role="status"
        >
          {accessibleLoadingLabel}
        </span>
      ) : null}
    </>
  );
}
