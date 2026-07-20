import { Outlet } from "react-router-dom";

import { useUserOrganization } from "@entities/user";
import { EmptyState } from "@shared/ui/empty-state";
import { useSidebarDrawer } from "@widgets/authenticated-layout/model/useSidebarDrawer";

import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";

import styles from "./AuthenticatedLayout.module.scss";

export function AuthenticatedLayout() {
  const {
    closeMobileSidebar,
    isMobileSidebarOpen,
    toggleMobileSidebar
  } = useSidebarDrawer();
  const organizationContext = useUserOrganization();
  const organizations = organizationContext?.organizations ?? [];
  const hasOrganizationError = organizationContext?.isOrganizationError ?? false;
  const isLoadingOrganizations =
    organizationContext?.isLoadingOrganizations ?? false;
  const isRefetchingOrganizations =
    organizationContext?.isRefetchingOrganizations ?? false;
  const retryOrganizations = organizationContext?.retryOrganizations ?? (() => {});

  return (
    <div
        className={styles.layout}
        data-mobile-sidebar-open={isMobileSidebarOpen}
      >
        <TopNavigation
          isMenuOpen={isMobileSidebarOpen}
          onMenuOpen={toggleMobileSidebar}
          user={{
            avatarUrl:
              "https://res.cloudinary.com/dapdzcfse/image/upload/v1784354798/avatar_epqzjk.png",
            name: "Adedeji"
          }}
        />

        <div className={styles.shell}>
          <Sidebar
            hasOrganizationError={hasOrganizationError}
            isLoadingOrganizations={isLoadingOrganizations}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={closeMobileSidebar}
            onRetryOrganizations={retryOrganizations}
            organizations={organizations}
          />

          <main className={styles.main} id="main-content" tabIndex={-1}>
            {isLoadingOrganizations ? (
              <div
                aria-live="polite"
                className={styles.organizationLoading}
                role="status"
              >
                <span
                  aria-hidden="true"
                  className={styles.organizationSpinner}
                  data-organization-spinner="true"
                />
                <span>Loading organizations...</span>
              </div>
            ) : null}
            {hasOrganizationError ? (
              <EmptyState
                className={styles.organizationError}
                isRetrying={isRefetchingOrganizations}
                message={
                  organizationContext?.organizationErrorMessage
                    ? "Unable to load organizations. Check your connection and try again."
                    : "Unable to load organizations."
                }
                variant="error"
                onRetry={retryOrganizations}
              />
            ) : null}
            {!isLoadingOrganizations && !hasOrganizationError ? <Outlet /> : null}
          </main>
        </div>
      </div>
  );
}
