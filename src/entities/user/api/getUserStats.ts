import { ApiError, apiClient } from "@shared/api";
import { environment, getMockarooApiKey } from "@shared/config";

import { userStatsSchema } from "./schemas/user.schemas";
import type { UserStats } from "./userApi.types";

export async function getUserStats(signal?: AbortSignal): Promise<UserStats> {
  const url = new URL("/stats.json", environment.mockarooBaseUrl);
  const response = await apiClient.get<unknown>(url, {
    headers: {
      "X-API-Key": getMockarooApiKey()
    },
    ...(signal ? { signal } : {})
  });
  const result = userStatsSchema.safeParse(response);

  if (!result.success) {
    throw new ApiError({
      kind: "response",
      message: "Unable to load user statistics right now."
    });
  }

  return result.data;
}
