import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "@app/router";

export function AppRouterProvider() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
