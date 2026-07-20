import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    try {
      window.scrollTo({
        behavior: "auto",
        left: 0,
        top: 0
      });
    } catch {
      // jsdom does not implement scrollTo; the browser path still runs normally.
    }
  }, [location.pathname]);

  return null;
}
