import type { HTMLAttributes, ReactNode } from "react";

export type StatusBadgeTone = "neutral" | "success" | "warning" | "danger";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: StatusBadgeTone;
}
