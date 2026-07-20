import type { HTMLAttributes, ReactNode } from "react";

export type StatCardTone = "magenta" | "purple" | "orange" | "pink";

export interface StatCardProps extends HTMLAttributes<HTMLElement> {
  icon: ReactNode;
  meta?: ReactNode;
  title: string;
  tone?: StatCardTone;
  value: ReactNode;
}

export type StatCardSkeletonProps = HTMLAttributes<HTMLElement>;
