import { ApiError, apiClient } from "@shared/api";
import { environment, getMockarooApiKey } from "@shared/config";

import type { UserOrganization } from "../model";
import { userOrganizationsSchema } from "./schemas/user.schemas";

export async function getUserOrganizations(
  signal?: AbortSignal
): Promise<UserOrganization[]> {
  const url = new URL("/user/organizations.json", environment.mockarooBaseUrl);
  const response = await apiClient.get<unknown>(url, {
    headers: {
      "X-API-Key": getMockarooApiKey()
    },
    ...(signal ? { signal } : {})
  });
  const result = userOrganizationsSchema.safeParse(response);

  if (!result.success) {
    throw new ApiError({
      kind: "response",
      message: "Unable to load organizations right now."
    });
  }

  return result.data;
}
