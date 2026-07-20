import type { ReactNode } from "react";

export type ToastTone = "error" | "success" | "warning" | "info";

export interface ToastOptions {
  title?: string | undefined;
  message: string;
  tone?: ToastTone | undefined;
  duration?: number | undefined;
}

export interface ToastRecord extends ToastOptions {
  id: string;
  lifecycle: "open" | "closing";
  tone: ToastTone;
  duration: number;
}

export interface ToastContextValue {
  clearToasts: () => void;
  dismissToast: (id: string) => void;
  showToast: (options: ToastOptions) => string;
}

export interface ToastProviderProps {
  children: ReactNode;
}
