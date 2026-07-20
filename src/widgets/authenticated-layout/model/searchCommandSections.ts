import { getUserDetailsPath, routePaths } from "@app/router/routePaths";
import {
  flattenSearchActions,
  type SearchAction,
  type SearchActionSection
} from "@shared/ui/search-command-dialog";

export const pageSearchSection: SearchActionSection = {
  id: "pages",
  items: [
    {
      description: "Go to the main dashboard overview.",
      href: routePaths.dashboard,
      id: "dashboard",
      keywords: ["overview", "home", "summary", "dashboard"],
      title: "Dashboard"
    },
    {
      description: "Browse the user management table.",
      href: routePaths.users,
      id: "users",
      keywords: ["customers", "members", "accounts", "users"],
      title: "Users"
    },
    {
      description: "Open a sample user details page.",
      href: getUserDetailsPath("7947"),
      id: "user-details",
      keywords: ["profile", "details", "single user", "account"],
      title: "User Details"
    }
  ],
  title: "Pages",
  type: "actions"
};

export const helpSearchSection: SearchActionSection = {
  id: "help",
  items: [
    {
      actionLabel: "External",
      description: "Open the Lendsqr documentation in a new tab.",
      href: "https://docs.lendsqr.com",
      id: "documentation",
      keywords: ["docs", "guide", "manual", "help"],
      title: "Documentation"
    },
    {
      actionLabel: "External",
      description: "Read support articles for onboarding and troubleshooting.",
      href: "https://docs.lendsqr.com/help",
      id: "help-centre",
      keywords: ["support", "faq", "articles", "help centre"],
      title: "Help Centre"
    }
  ],
  title: "Help",
  type: "actions"
};

export const authenticatedLayoutSearchActionSections: SearchActionSection[] = [
  pageSearchSection,
  helpSearchSection
];

export function resolveSearchAction(
  query: string,
  sections: SearchActionSection[] = authenticatedLayoutSearchActionSections
): SearchAction | null {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return null;
  }

  return (
    flattenSearchActions(sections).find((action) =>
      [action.title, action.description, ...action.keywords].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    ) ?? null
  );
}
