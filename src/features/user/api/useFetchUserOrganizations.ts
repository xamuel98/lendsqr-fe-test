import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { getUserOrganizations, type UserOrganization } from "@entities/user";
import { ApiError } from "@shared/api";

import { userQueryKeys } from "./userQueryKeys";

export function useFetchUserOrganizations(): UseQueryResult<
  UserOrganization[],
  ApiError
> {
  return useQuery({
    queryFn: ({ signal }) => getUserOrganizations(signal),
    queryKey: userQueryKeys.organizations()
  });
}
