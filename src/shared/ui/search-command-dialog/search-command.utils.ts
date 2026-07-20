import type {
  SearchAction,
  SearchActionSection,
  SearchCommandSection
} from "./search-command.types";

export function isSearchActionSection(
  section: SearchCommandSection
): section is SearchActionSection {
  return section.type === "actions";
}

export function flattenSearchActions(
  sections: SearchCommandSection[]
): SearchAction[] {
  return sections.flatMap((section) =>
    isSearchActionSection(section) ? section.items : []
  );
}
