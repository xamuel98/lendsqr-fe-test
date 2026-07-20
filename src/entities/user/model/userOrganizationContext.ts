import { createContext } from "react";

import type { UserOrganization } from "./userOrganization.types";

export type UserOrganizationContextValue = {
  activeOrganization: UserOrganization | null;
  isLoadingOrganizations?: boolean | undefined;
  isOrganizationError?: boolean | undefined;
  isRefetchingOrganizations?: boolean | undefined;
  organizationErrorMessage?: string | undefined;
  organizations?: UserOrganization[] | undefined;
  retryOrganizations?: (() => void) | undefined;
  selectOrganization: (organization: UserOrganization) => void;
};

export const UserOrganizationContext =
  createContext<UserOrganizationContextValue | null>(null);
