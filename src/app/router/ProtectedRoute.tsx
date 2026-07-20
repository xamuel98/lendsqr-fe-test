import { Navigate, Outlet } from "react-router-dom";

import { hasDemoAuthSession } from "@shared/storage";

import { routePaths } from "./routePaths";

export function ProtectedRoute() {
  if (!hasDemoAuthSession()) {
    return <Navigate replace to={routePaths.login} />;
  }

  return <Outlet />;
}
