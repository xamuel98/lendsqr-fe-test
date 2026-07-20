import type { UserFilters, UserPageSize } from "@entities/user";

export type UsersListQueryParams = {
  filters: UserFilters;
  organizationId: string | null;
  page: number;
  pageSize: UserPageSize;
};

export const userQueryKeys = {
  all: ["users"] as const,
  detail: (userId: string, organizationId: string | null) =>
    [...userQueryKeys.all, "detail", organizationId, userId] as const,
  list: (params: UsersListQueryParams) =>
    [...userQueryKeys.all, "list", params] as const,
  organizations: () => [...userQueryKeys.all, "organizations"] as const,
  stats: (organizationId: string | null) =>
    [...userQueryKeys.all, "stats", organizationId] as const
};
