import { useLocation } from "react-router-dom";

import {
  dashboardNavigationItem,
  navigationSections,
  organizationSwitcherItem
} from "@widgets/authenticated-layout/model/navigationItems";

import styles from "./AppPlaceholderPage.module.scss";

function toTitleCase(value: string) {
  return value
    .split(/[-/]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getPageTitle(pathname: string) {
  const items = [
    organizationSwitcherItem,
    dashboardNavigationItem,
    ...navigationSections.flatMap((section) => section.items)
  ];
  const matchedItem = items.find((item) => item.href === pathname);

  if (matchedItem) {
    return matchedItem.label;
  }

  const fallbackSegment = pathname.split("/").filter(Boolean).at(-1);

  return fallbackSegment ? toTitleCase(fallbackSegment) : "Overview";
}

export function AppPlaceholderPage() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <section aria-labelledby="app-placeholder-title" className={styles.page}>
      <h1 className={styles.title} id="app-placeholder-title">
        {title}
      </h1>
      <p>{title} page placeholder.</p>
    </section>
  );
}
