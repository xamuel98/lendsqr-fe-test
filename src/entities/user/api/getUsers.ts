import { ApiError, apiClient } from "@shared/api";
import { environment, getMockarooApiKey } from "@shared/config";

import { paginatedUsersSchema } from "./schemas/user.schemas";
import type { GetUsersParams, PaginatedUsersResponse, UserFilters } from "./userApi.types";
import { normaliseUserFilters, normaliseUserPageSize } from "./userApi.types";

export function appendUserFilters(
  searchParams: URLSearchParams,
  filters: UserFilters
) {
  const normalisedFilters = normaliseUserFilters(filters);
  const filterEntries: Array<[string, string | undefined]> = [
    ["username", normalisedFilters.username],
    ["organization", normalisedFilters.organization],
    ["email", normalisedFilters.email],
    ["phoneNumber", normalisedFilters.phoneNumber],
    ["status", normalisedFilters.status],
    ["dateJoined", normalisedFilters.dateJoined]
  ];

  filterEntries.forEach(([name, value]) => {
    if (value) {
      searchParams.set(name, value);
    }
  });
}

export async function getUsers({
  filters = {},
  page,
  pageSize,
  signal
}: GetUsersParams): Promise<PaginatedUsersResponse> {
  const url = new URL("/users.json", environment.mockarooBaseUrl);
  const normalisedPage = Math.max(1, Math.trunc(page));
  const normalisedPageSize = normaliseUserPageSize(Math.trunc(pageSize));

  url.searchParams.set("page", String(normalisedPage));
  url.searchParams.set("limit", String(normalisedPageSize));
  appendUserFilters(url.searchParams, filters);

  const response = await apiClient.get<unknown>(url, {
    headers: {
      "X-API-Key": getMockarooApiKey()
    },
    ...(signal ? { signal } : {})
  });
  const result = paginatedUsersSchema.safeParse(response);

  if (!result.success) {
    throw new ApiError({
      kind: "response",
      message: "Unable to load users right now."
    });
  }

  return {
    ...result.data,
    limit: normaliseUserPageSize(result.data.limit)
  };
}
