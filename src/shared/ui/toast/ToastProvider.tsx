import { createPortal } from "react-dom";
import { useCallback, useMemo, useState } from "react";

import { Toast } from "./Toast";
import { ToastContext } from "./ToastContext";

import styles from "./Toast.module.scss";
import type {
  ToastContextValue,
  ToastOptions,
  ToastProviderProps,
  ToastRecord
} from "./Toast.types";

let nextToastId = 0;

function createToastId() {
  nextToastId += 1;

  return `toast-${nextToastId}`;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id ? { ...toast, lifecycle: "closing" } : toast
      )
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const clearToasts = useCallback(() => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) => ({ ...toast, lifecycle: "closing" }))
    );
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = createToastId();
    const nextToast: ToastRecord = {
      duration: options.duration ?? 5000,
      id,
      lifecycle: "open",
      message: options.message,
      tone: options.tone ?? "error",
      ...(options.title ? { title: options.title } : {})
    };

    setToasts((currentToasts) => [nextToast, ...currentToasts]);

    return id;
  }, []);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      clearToasts,
      dismissToast,
      showToast
    }),
    [clearToasts, dismissToast, showToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {createPortal(
        toasts.length > 0 ? (
          <div className={styles.viewport}>
            {toasts.map((toast) => (
              <Toast
                {...toast}
                key={toast.id}
                onDismiss={dismissToast}
                onExitComplete={removeToast}
              />
            ))}
          </div>
        ) : null,
        document.body
      )}
    </ToastContext.Provider>
  );
}
