import { useCallback, useEffect, useState } from "react";

const sidebarDrawerMediaQuery = "(max-width: 74.99rem)";

function getSidebarDrawerViewportMatch() {
  return (
    typeof window === "undefined" ||
    !window.matchMedia ||
    window.matchMedia(sidebarDrawerMediaQuery).matches
  );
}

function useSidebarDrawerViewport() {
  const [matches, setMatches] = useState(getSidebarDrawerViewportMatch);

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(sidebarDrawerMediaQuery);
    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return matches;
}

export function useSidebarDrawer() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isSidebarDrawerViewport = useSidebarDrawerViewport();
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((currentValue) => !currentValue);
  }, []);
  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!isMobileSidebarOpen || !isSidebarDrawerViewport) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isMobileSidebarOpen, isSidebarDrawerViewport]);

  return {
    closeMobileSidebar,
    isMobileSidebarOpen,
    toggleMobileSidebar
  };
}
