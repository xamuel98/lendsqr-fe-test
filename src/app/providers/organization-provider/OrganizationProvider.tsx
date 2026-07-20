import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import {
  type UserOrganization,
  UserOrganizationContext
} from "@entities/user";
import { useFetchUserOrganizations } from "@features/user";
import {
  getDemoAuthSession,
  setDemoAuthSessionOrganization
} from "@shared/storage";

type OrganizationProviderProps = {
  children?: ReactNode | undefined;
};

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const {
    data: organizations = [],
    error,
    isError,
    isLoading,
    isRefetching,
    refetch
  } = useFetchUserOrganizations();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(() =>
    getDemoAuthSession()?.organization.id
  );
  const activeOrganization =
    organizations.find(({ id }) => id === selectedOrganizationId) ??
    organizations[0] ??
    null;

  useEffect(() => {
    if (
      activeOrganization &&
      activeOrganization.id !== selectedOrganizationId
    ) {
      setSelectedOrganizationId(activeOrganization.id);
      setDemoAuthSessionOrganization(activeOrganization);
    }
  }, [activeOrganization, selectedOrganizationId]);

  function selectOrganization(organization: UserOrganization) {
    setSelectedOrganizationId(organization.id);
    setDemoAuthSessionOrganization(organization);
  }

  function retryOrganizations() {
    void refetch();
  }

  return (
    <UserOrganizationContext.Provider
      value={{
        activeOrganization,
        isLoadingOrganizations: isLoading,
        isOrganizationError: isError,
        isRefetchingOrganizations: isRefetching,
        organizationErrorMessage: error?.message,
        organizations,
        retryOrganizations,
        selectOrganization
      }}
    >
      {children ?? <Outlet />}
    </UserOrganizationContext.Provider>
  );
}
