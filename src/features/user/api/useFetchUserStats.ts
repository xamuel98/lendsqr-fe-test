import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import {
  getUserStats,
  type UserStats,
  useUserOrganization
} from "@entities/user";
import { ApiError } from "@shared/api";

import { userQueryKeys } from "./userQueryKeys";

export function useFetchUserStats(): UseQueryResult<UserStats, ApiError> {
  const organizationContext = useUserOrganization();
  const organizationId = organizationContext?.activeOrganization?.id ?? null;

  return useQuery({
    enabled: Boolean(organizationId),
    queryFn: ({ signal }) => getUserStats(signal),
    queryKey: userQueryKeys.stats(organizationId)
  });
}
