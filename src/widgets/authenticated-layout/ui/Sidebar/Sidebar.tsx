import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  dashboardNavigationItem,
  logoutNavigationItem,
  navigationSections
} from "@widgets/authenticated-layout/model/navigationItems";
import type { NavigationItem } from "@widgets/authenticated-layout/model/types";
import { SidebarIcon } from "@widgets/authenticated-layout/lib/sidebarIcons";
import { clearLocalStorage } from "@shared/storage";
import type { UserOrganization } from "@entities/user";

import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { SidebarSkeleton } from "./SidebarSkeleton";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  hasOrganizationError: boolean;
  isMobileOpen?: boolean | undefined;
  isLoadingOrganizations: boolean;
  onCloseMobile?: (() => void) | undefined;
  onRetryOrganizations: () => void;
  organizations: UserOrganization[];
}

function SidebarLink({
  isMobileOpen,
  item,
  search,
  onCloseMobile
}: {
  isMobileOpen: boolean;
  item: NavigationItem;
  search: string;
  onCloseMobile?: (() => void) | undefined;
}) {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive ? `${styles.link} ${styles.linkActive}` : styles.link
      }
      to={{ pathname: item.href, search }}
      {...(item.end ? { end: true } : {})}
      onClick={() => {
        if (isMobileOpen) {
          onCloseMobile?.();
        }
      }}
    >
      <span aria-hidden="true" className={styles.linkIcon}>
        <SidebarIcon icon={item.icon} />
      </span>
      <span className={styles.linkLabel}>{item.label}</span>
    </NavLink>
  );
}

export function Sidebar({
  hasOrganizationError,
  isLoadingOrganizations,
  isMobileOpen = false,
  onCloseMobile,
  onRetryOrganizations,
  organizations
}: SidebarProps) {
  const location = useLocation();

  useEffect(() => {
    onCloseMobile?.();
  }, [location.pathname, location.search, onCloseMobile]);

  return (
    <>
      <button
        aria-hidden={!isMobileOpen}
        aria-label="Close navigation"
        className={styles.overlay}
        data-open={isMobileOpen ? "true" : "false"}
        tabIndex={isMobileOpen ? 0 : -1}
        type="button"
        onClick={onCloseMobile}
      />

      <aside
        className={styles.sidebar}
        data-mobile-open={isMobileOpen ? "true" : "false"}
      >
        {isLoadingOrganizations ? (
          <SidebarSkeleton />
        ) : (
          <>
            <div className={styles.top}>
              <OrganizationSwitcher
                isError={hasOrganizationError}
                onCloseMobile={onCloseMobile}
                onRetry={onRetryOrganizations}
                organizations={organizations}
              />
            </div>

            <div className={styles.navigation}>
              <nav aria-label="Primary" className={styles.navigationScroll}>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.dashboardLink} ${styles.linkActive}`
                      : styles.dashboardLink
                  }
                  end
                  to={{
                    pathname: dashboardNavigationItem.href,
                    search: location.search
                  }}
                  onClick={() => {
                    if (isMobileOpen) {
                      onCloseMobile?.();
                    }
                  }}
                >
                  <span aria-hidden="true" className={styles.linkIcon}>
                    <SidebarIcon icon={dashboardNavigationItem.icon} />
                  </span>
                  <span className={styles.linkLabel}>
                    {dashboardNavigationItem.label}
                  </span>
                </NavLink>

                {navigationSections.map((section) => (
                  <section key={section.id} className={styles.group}>
                    <h2 className={styles.groupTitle}>{section.title}</h2>
                    <ul className={styles.list}>
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <SidebarLink
                            isMobileOpen={isMobileOpen}
                            item={item}
                            search={location.search}
                            onCloseMobile={onCloseMobile}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </nav>

              <div className={styles.footer}>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.logoutLink} ${styles.linkActive}`
                      : styles.logoutLink
                  }
                  to={logoutNavigationItem.href}
                  onClick={() => {
                    clearLocalStorage();

                    if (isMobileOpen) {
                      onCloseMobile?.();
                    }
                  }}
                >
                  <span aria-hidden="true" className={styles.linkIcon}>
                    <SidebarIcon icon={logoutNavigationItem.icon} />
                  </span>
                  <span className={styles.linkLabel}>
                    {logoutNavigationItem.label}
                  </span>
                </NavLink>
                <p className={styles.version}>v1.2.0</p>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
