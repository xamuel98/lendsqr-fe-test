import type { ReactNode } from "react";

export interface SearchAction {
  actionLabel?: string | undefined;
  description: string;
  href: string;
  id: string;
  keywords: string[];
  title: string;
}

export interface SearchActionSection {
  id: string;
  items: SearchAction[];
  title: string;
  type: "actions";
}

export interface SearchContentSection {
  content: ReactNode;
  description?: string | undefined;
  id: string;
  keywords?: string[] | undefined;
  showWhenQuery?: boolean | undefined;
  title?: string | undefined;
  type: "content";
}

export type SearchCommandSection =
  | SearchActionSection
  | SearchContentSection;

export type SearchCommandMotionMode = "default" | "instant";
