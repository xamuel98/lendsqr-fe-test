import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToast } from "@shared/ui/toast";

import { resolveSearchAction } from "./searchCommandSections";

type SearchDialogMotionMode = "default" | "instant";
type SearchTriggerSource =
  | "desktop-field"
  | "desktop-button"
  | "mobile-button";

export function useTopNavigationSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchDialogMotionMode, setSearchDialogMotionMode] =
    useState<SearchDialogMotionMode>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggerSource, setSearchTriggerSource] =
    useState<SearchTriggerSource | null>(null);
  const desktopFieldPointerOpenRef = useRef(false);
  const ignoreNextDesktopFieldFocusRef = useRef(false);

  function openSearchDialog(
    source: SearchTriggerSource,
    motionMode: SearchDialogMotionMode = "default"
  ) {
    if (isSearchDialogOpen) {
      return;
    }

    setSearchTriggerSource(source);
    setSearchDialogMotionMode(motionMode);
    setIsSearchDialogOpen(true);
  }

  function closeSearchDialog() {
    if (searchTriggerSource === "desktop-field") {
      ignoreNextDesktopFieldFocusRef.current = true;
    }

    setIsSearchDialogOpen(false);
  }

  function handleActionSelection(href: string) {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");

      return;
    }

    void navigate({
      pathname: href,
      search: location.search
    });
  }

  function handleSearchQuery(query: string) {
    const matchedAction = resolveSearchAction(query);

    if (!matchedAction) {
      showToast({
        message: `No results found for "${query.trim()}".`,
        tone: "info"
      });

      return;
    }

    handleActionSelection(matchedAction.href);
  }

  return {
    closeSearchDialog,
    desktopFieldPointerOpenRef,
    handleActionSelection,
    handleSearchQuery,
    ignoreNextDesktopFieldFocusRef,
    isSearchDialogOpen,
    openSearchDialog,
    searchDialogMotionMode,
    searchQuery,
    setSearchQuery
  };
}
