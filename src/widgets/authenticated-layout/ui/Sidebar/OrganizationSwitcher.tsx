import { useNavigate } from "react-router-dom";

import { routePaths } from "@app/router/routePaths";
import type { UserOrganization } from "@entities/user";
import { IChevronDown, IErrorOctagon, IPlus } from "@shared/assets/icons";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@shared/ui/dropdown-menu";
import { SidebarIcon } from "@widgets/authenticated-layout/lib/sidebarIcons";
import { organizationSwitcherItem } from "@widgets/authenticated-layout/model/navigationItems";
import { useOrganizationSwitcher } from "@widgets/authenticated-layout/model/useOrganizationSwitcher";

import styles from "./Sidebar.module.scss";

type OrganizationSwitcherProps = {
  isError: boolean;
  onCloseMobile?: (() => void) | undefined;
  onRetry: () => void;
  organizations: UserOrganization[];
};

export function OrganizationSwitcher({
  isError,
  onCloseMobile,
  onRetry,
  organizations
}: OrganizationSwitcherProps) {
  const navigate = useNavigate();
  const { activeOrganization, switchOrganization } = useOrganizationSwitcher();

  function handleOrganizationSelection(organizationId: string) {
    const organization = organizations.find(({ id }) => id === organizationId);

    if (!organization) {
      return;
    }

    switchOrganization(organization);
    onCloseMobile?.();
  }

  function handleAddOrganization() {
    onCloseMobile?.();
    void navigate(routePaths.organization);
  }

  return (
    <DropdownMenu
      align="start"
      ariaLabel="Switch organization"
      className={styles.organizationMenu}
      trigger={
        <DropdownMenuTrigger
          aria-label={`Switch organization. Current organization: ${
            activeOrganization?.name ?? organizationSwitcherItem.label
          }`}
          className={styles.switcher}
        >
          <span aria-hidden="true" className={styles.switcherIcon}>
            <SidebarIcon icon={organizationSwitcherItem.icon} />
          </span>
          <span className={styles.switcherLabel}>
            {activeOrganization?.name ?? organizationSwitcherItem.label}
          </span>
          <span aria-hidden="true" className={styles.switcherChevron}>
            <IChevronDown />
          </span>
        </DropdownMenuTrigger>
      }
    >
      {isError ? (
        <div className={styles.organizationError} role="none">
          <span
            aria-hidden="true"
            className={styles.organizationErrorIcon}
            data-organization-error-icon="true"
          >
            <IErrorOctagon />
          </span>
          <p className={styles.organizationErrorMessage}>
            Unable to load organizations.
          </p>
          <Button
            aria-label="Retry loading organizations"
            className={styles.organizationRetryButton}
            fullWidth
            role="menuitem"
            onClick={onRetry}
          >
            Retry
          </Button>
        </div>
      ) : null}
      {!isError
        ? organizations.map((organization) => {
            const isCurrentOrganization =
              organization.id === activeOrganization?.id;

            return (
              <DropdownMenuItem
                aria-current={isCurrentOrganization ? "true" : undefined}
                data-current={isCurrentOrganization ? "true" : "false"}
                icon={<SidebarIcon icon={organizationSwitcherItem.icon} />}
                key={organization.id}
                onClick={() => {
                  handleOrganizationSelection(organization.id);
                }}
              >
                {organization.name}
              </DropdownMenuItem>
            );
          })
        : null}
      <DropdownMenuSeparator />
      <DropdownMenuItem icon={<IPlus />} onClick={handleAddOrganization}>
        Add organization
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
