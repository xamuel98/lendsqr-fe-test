import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { PublicOnlyRoute } from "@app/router/PublicOnlyRoute";
import { ProtectedRoute } from "@app/router/ProtectedRoute";
import { OrganizationProvider } from "@app/providers/organization-provider";
import { UserStatusActionProvider } from "@app/providers/user-status-action-provider";
import {
  authenticatedPlaceholderPaths,
  routePaths
} from "@app/router/routePaths";
import { ScrollToTop } from "@app/router/ScrollToTop";
import { AuthenticatedLayout } from "@widgets/authenticated-layout";

const LoginPage = lazy(async () => {
  const module = await import("@pages/login");

  return { default: module.LoginPage };
});

const ListUserTable = lazy(async () => {
  const module = await import("@pages/users");

  return { default: module.ListUserTable };
});

const ViewUserPage = lazy(async () => {
  const module = await import("@pages/users");

  return { default: module.ViewUserPage };
});

const AppPlaceholderPage = lazy(async () => {
  const module = await import("@pages/app-placeholder");

  return { default: module.AppPlaceholderPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import("@pages/not-found");

  return { default: module.NotFoundPage };
});

const ProtectedNotFoundPage = lazy(async () => {
  const module = await import("@pages/not-found");

  return { default: module.ProtectedNotFoundPage };
});

function RouteFallback() {
  return (
    <div aria-live="polite" className="visually-hidden" role="status">
      Loading route content
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path={routePaths.login} element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<OrganizationProvider />}>
            <Route element={<UserStatusActionProvider />}>
              <Route element={<AuthenticatedLayout />}>
                <Route path={routePaths.users} element={<ListUserTable />} />
                <Route
                  path={routePaths.userDetails}
                  element={<ViewUserPage />}
                />
                {authenticatedPlaceholderPaths.map((path) => (
                  <Route
                    element={<AppPlaceholderPage />}
                    key={path}
                    path={path}
                  />
                ))}
                <Route path="*" element={<ProtectedNotFoundPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate replace to={routePaths.login} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
