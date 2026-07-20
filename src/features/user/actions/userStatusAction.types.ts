import type { UserStatus } from "@entities/user";

export type UserStatusAction = "activate" | "blacklist";

export type UserStatusActionSubject = {
  id: string;
  name: string;
  status: UserStatus;
};

export function getUserStatusAction(
  status: UserStatus
): UserStatusAction | null {
  if (status === "active") {
    return "blacklist";
  }

  return status === "blacklisted" ? "activate" : null;
}
