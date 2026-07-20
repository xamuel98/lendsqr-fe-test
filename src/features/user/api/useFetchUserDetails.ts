import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import {
  getUserDetails,
  type UserDetails,
  useUserOrganization
} from "@entities/user";
import { ApiError } from "@shared/api";

import { userQueryKeys } from "./userQueryKeys";

export function useFetchUserDetails(
  userId: string | undefined
): UseQueryResult<UserDetails, ApiError> {
  const normalizedUserId = userId?.trim() ?? "";
  const organizationContext = useUserOrganization();
  const organizationId = organizationContext?.activeOrganization?.id ?? null;

  return useQuery({
    enabled: Boolean(normalizedUserId && organizationId),
    queryFn: ({ signal }) => getUserDetails({ signal, userId: normalizedUserId }),
    queryKey: userQueryKeys.detail(normalizedUserId, organizationId)
  });
}
