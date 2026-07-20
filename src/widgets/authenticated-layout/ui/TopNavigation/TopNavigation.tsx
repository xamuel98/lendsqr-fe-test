import { useEffect, useId, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { routePaths } from "@app/router";
import logo from "@shared/assets/images/lendsqr-logo.svg";
import emptyNotification from "@shared/assets/images/empty-notification.svg";
import {
  IDropdown,
  IBadgePercent,
  IClipboardList,
  INotification,
  ISearch,
  ISignOut,
  ISlidersH,
  ITire
} from "@shared/assets/icons";
import { clearLocalStorage, demoAccountEmail } from "@shared/storage";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@shared/ui/dropdown-menu";
import {
  SearchCommandDialog,
  type SearchCommandSection
} from "@shared/ui/search-command-dialog";
import { authenticatedLayoutSearchActionSections } from "@widgets/authenticated-layout/model/searchCommandSections";
import { useTopNavigationSearch } from "@widgets/authenticated-layout/model/useTopNavigationSearch";
import { SearchCommandNewsCard } from "@widgets/authenticated-layout/ui/SearchCommandNewsCard";

import styles from "./TopNavigation.module.scss";

type TopNavigationUser = {
  avatarUrl?: string | undefined;
  email?: string | undefined;
  name: string;
};

export interface TopNavigationProps {
  isMenuOpen?: boolean | undefined;
  onMenuOpen?: (() => void) | undefined;
  user?: TopNavigationUser | undefined;
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.33334 5H16.6667"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M3.33334 10H16.6667"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M3.33334 15H16.6667"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const searchSections: SearchCommandSection[] = [
  ...authenticatedLayoutSearchActionSections,
  {
    content: <SearchCommandNewsCard />,
    description:
      "Latest product update about new reporting shortcuts and dashboard improvements.",
    id: "news",
    keywords: ["news", "update", "reporting", "shortcuts", "dashboard"],
    title: "News",
    type: "content"
  }
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  return parts
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase() ?? "")
    .join("");
}

export function TopNavigation({
  isMenuOpen = false,
  onMenuOpen,
  user = {
    avatarUrl:
      "https://res.cloudinary.com/dapdzcfse/image/upload/v1784354798/avatar_epqzjk.png",
    email: demoAccountEmail,
    name: "Adedeji"
  }
}: TopNavigationProps) {
  const desktopSearchLabelId = useId();
  const desktopSearchDialogId = useId();
  const desktopSearchValueId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const {
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
  } = useTopNavigationSearch();
  const [hasAvatarLoadError, setHasAvatarLoadError] = useState(false);
  const avatarInitials = useMemo(() => getInitials(user.name), [user.name]);
  const hasAvatarImage = Boolean(user.avatarUrl) && !hasAvatarLoadError;

  useEffect(() => {
    setHasAvatarLoadError(false);
  }, [user.avatarUrl]);

  function navigateToSettings(path: string) {
    void navigate({ pathname: path, search: location.search });
  }

  return (
    <header className={styles.topNavigation} data-top-navigation role="banner">
      <div className={styles.leading}>
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          className={`${styles.iconButton} ${styles.menuButton}`}
          type="button"
          onClick={onMenuOpen}
        >
          <MenuIcon />
        </button>

        <Link
          aria-label="Lendsqr home"
          className={styles.brand}
          to={{ pathname: routePaths.dashboard, search: location.search }}
        >
          <img alt="Lendsqr" className={styles.logo} height="30" src={logo} />
        </Link>
      </div>

      <div
        aria-label="Global search"
        className={styles.searchForm}
        role="search"
      >
        <span className={styles.searchLabel} id={desktopSearchLabelId}>
          Search
        </span>
        <button
          aria-controls={isSearchDialogOpen ? desktopSearchDialogId : undefined}
          aria-expanded={isSearchDialogOpen}
          aria-haspopup="dialog"
          aria-labelledby={`${desktopSearchLabelId} ${desktopSearchValueId}`}
          className={styles.searchTrigger}
          data-has-value={searchQuery.trim() ? "true" : "false"}
          type="button"
          onFocus={() => {
            if (ignoreNextDesktopFieldFocusRef.current) {
              ignoreNextDesktopFieldFocusRef.current = false;
              return;
            }

            if (desktopFieldPointerOpenRef.current) {
              desktopFieldPointerOpenRef.current = false;
              return;
            }

            openSearchDialog("desktop-field", "instant");
          }}
          onPointerDown={() => {
            desktopFieldPointerOpenRef.current = true;
            openSearchDialog("desktop-field");
          }}
        >
          <span className={styles.searchTriggerText} id={desktopSearchValueId}>
            {searchQuery.trim() || "Search for anything"}
          </span>
        </button>
        <button
          aria-controls={isSearchDialogOpen ? desktopSearchDialogId : undefined}
          aria-expanded={isSearchDialogOpen}
          aria-haspopup="dialog"
          aria-label="Open search dialog"
          className={styles.searchSubmit}
          type="button"
          onClick={() => {
            openSearchDialog("desktop-button");
          }}
        >
          <ISearch />
        </button>
      </div>

      <div className={styles.trailing}>
        <button
          aria-label="Open search"
          className={`${styles.iconButton} ${styles.mobileSearchButton}`}
          type="button"
          onClick={() => {
            openSearchDialog("mobile-button");
          }}
        >
          <ISearch />
        </button>

        <a
          className={styles.docsLink}
          href="https://docs.lendsqr.com"
          rel="noreferrer"
          target="_blank"
        >
          Docs
        </a>

        <DropdownMenu
          align="end"
          ariaLabel="Notifications"
          className={styles.notificationMenu}
          trigger={
            <DropdownMenuTrigger
              aria-label="View notifications"
              className={`${styles.iconButton} ${styles.mobileNotificationButton}`}
            >
              <INotification />
            </DropdownMenuTrigger>
          }
        >
          <div className={styles.notificationEmpty} role="none">
            <img alt="" className={styles.notificationImage} src={emptyNotification} />
            <p className={styles.notificationTitle}>No notifications yet</p>
            <p className={styles.notificationDescription}>
              Updates about your account will appear here.
            </p>
          </div>
        </DropdownMenu>

        <DropdownMenu
          align="end"
          ariaLabel="Profile menu"
          className={styles.profileMenu ?? ""}
          trigger={
            <DropdownMenuTrigger
              aria-label={`Open profile menu for ${user.name}`}
              className={styles.profileButton}
            >
              <span
                aria-hidden="true"
                className={styles.avatar}
                data-has-image={hasAvatarImage ? "true" : "false"}
              >
                {hasAvatarImage ? (
                  <img
                    alt=""
                    className={styles.avatarImage}
                    src={user.avatarUrl}
                    onError={() => {
                      setHasAvatarLoadError(true);
                    }}
                  />
                ) : (
                  avatarInitials
                )}
              </span>
              <span className={styles.nameWrapper}>
                <span className={styles.userName}>{user.name}</span>
                <span aria-hidden="true" className={styles.profileChevron}>
                  <IDropdown />
                </span>
              </span>
            </DropdownMenuTrigger>
          }
        >
          <div aria-hidden="true" className={styles.profileMenuHeader}>
            <strong>{user.name}</strong>
            <span>{user.email ?? demoAccountEmail}</span>
          </div>
          <div className={styles.spacingTop}></div>
          <DropdownMenuItem
            icon={<ISlidersH />}
            onClick={() => {
              navigateToSettings(routePaths.preferences);
            }}
          >
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={<IBadgePercent />}
            onClick={() => {
              navigateToSettings(routePaths.feesPricing);
            }}
          >
            Fees and Pricing
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={<IClipboardList />}
            onClick={() => {
              navigateToSettings(routePaths.auditLogs);
            }}
          >
            Audit Logs
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={<ITire />}
            onClick={() => {
              navigateToSettings(routePaths.systemMessages);
            }}
          >
            System Messages
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={<ISignOut />}
            tone="danger"
            onClick={() => {
              clearLocalStorage();
              void navigate(routePaths.login);
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenu>
      </div>

      <SearchCommandDialog
        dialogId={desktopSearchDialogId}
        isOpen={isSearchDialogOpen}
        motionMode={searchDialogMotionMode}
        query={searchQuery}
        sections={searchSections}
        setQuery={setSearchQuery}
        onClose={() => {
          closeSearchDialog();
        }}
        onSearchQuery={(query) => {
          closeSearchDialog();
          handleSearchQuery(query);
        }}
        onSelectAction={(action) => {
          closeSearchDialog();
          handleActionSelection(action.href);
        }}
      />
    </header>
  );
}
