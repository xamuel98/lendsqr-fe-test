import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import {
  getUsers,
  normaliseUserFilters,
  type PaginatedUsersResponse,
  type UserFilters,
  type UserPageSize,
  useUserOrganization
} from "@entities/user";
import { ApiError } from "@shared/api";

import { userQueryKeys } from "./userQueryKeys";

type FetchUsersParams = {
  filters?: UserFilters;
  page: number;
  pageSize: UserPageSize;
};

export function useFetchUsers({
  filters = {},
  page,
  pageSize
}: FetchUsersParams): UseQueryResult<PaginatedUsersResponse, ApiError> {
  const organizationContext = useUserOrganization();
  const organizationId = organizationContext?.activeOrganization?.id ?? null;
  const normalisedFilters = normaliseUserFilters(filters);
  const params = {
    filters: normalisedFilters,
    organizationId,
    page,
    pageSize
  };

  return useQuery({
    enabled: Boolean(organizationId),
    // placeholderData: keepPreviousData,
    queryFn: ({ signal }) => getUsers({ ...params, signal }),
    queryKey: userQueryKeys.list(params)
  });
}
