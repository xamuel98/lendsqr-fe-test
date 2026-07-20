import type { HTMLAttributes, ReactNode } from "react";

export type EmptyStateVariant = "default" | "error" | "search";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  action?: ReactNode;
  isRetrying?: boolean;
  message: ReactNode;
  onRetry?: () => void;
  variant?: EmptyStateVariant;
}
