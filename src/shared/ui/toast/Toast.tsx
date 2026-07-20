import { useEffect } from "react";

import styles from "./Toast.module.scss";
import type { ToastRecord } from "./Toast.types";

type ToastProps = ToastRecord & {
  onDismiss: (id: string) => void;
  onExitComplete: (id: string) => void;
};

const exitAnimationFallbackDurationMs = 220;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ToastIcon({ tone }: Pick<ToastRecord, "tone">) {
  switch (tone) {
    case "success":
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
            d="M16.25 5.625L7.5 14.375L3.75 10.625"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "warning":
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
            d="M10 6.25V10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M10 13.75H10.0083"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M8.55541 3.39131C9.19719 2.26877 10.8028 2.26877 11.4446 3.39131L17.3471 13.7207C17.9836 14.8345 17.179 16.25 15.9025 16.25H4.09747C2.82104 16.25 2.01635 14.8345 2.65291 13.7207L8.55541 3.39131Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "info":
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
            d="M10 13.75V9.58337"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M9.99542 6.25H10.0029"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M18.3334 10C18.3334 14.6024 14.6024 18.3334 10 18.3334C5.39765 18.3334 1.66669 14.6024 1.66669 10C1.66669 5.39765 5.39765 1.66669 10 1.66669C14.6024 1.66669 18.3334 5.39765 18.3334 10Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "error":
    default:
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
            d="M10 6.25V10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M9.99542 13.3333H10.0029"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M18.3334 10C18.3334 14.6024 14.6024 18.3334 10 18.3334C5.39765 18.3334 1.66669 14.6024 1.66669 10C1.66669 5.39765 5.39765 1.66669 10 1.66669C14.6024 1.66669 18.3334 5.39765 18.3334 10Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      );
  }
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L4 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M4 4L12 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Toast({
  duration,
  id,
  lifecycle,
  message,
  onDismiss,
  onExitComplete,
  title,
  tone
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0 || lifecycle === "closing") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration, id, lifecycle, onDismiss]);

  useEffect(() => {
    if (lifecycle !== "closing") {
      return undefined;
    }

    if (prefersReducedMotion()) {
      onExitComplete(id);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onExitComplete(id);
    }, exitAnimationFallbackDurationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [id, lifecycle, onExitComplete]);

  const isAssertive = tone === "error" || tone === "warning";

  return (
    <section
      aria-atomic="true"
      aria-live={isAssertive ? "assertive" : "polite"}
      className={styles.toast}
      data-has-title={title ? "true" : "false"}
      data-state={lifecycle}
      data-tone={tone}
      role={isAssertive ? "alert" : "status"}
    >
      <div aria-hidden="true" className={styles.iconWrap}>
        <ToastIcon tone={tone} />
      </div>

      <div className={styles.body}>
        {title ? <p className={styles.title}>{title}</p> : null}
        <p className={styles.message}>{message}</p>
      </div>

      <button
        aria-label="Dismiss notification"
        className={styles.dismissButton}
        type="button"
        onClick={() => {
          onDismiss(id);
        }}
      >
        <CloseIcon />
      </button>
    </section>
  );
}
