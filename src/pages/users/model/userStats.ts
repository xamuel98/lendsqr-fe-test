import type { UserStatId } from "@entities/user";
import type { StatCardTone } from "@shared/ui/stat-card";

export type UserStatIconKey = UserStatId;

type UserStatCardMetadata = {
  icon: UserStatIconKey;
  tone: StatCardTone;
};

const userStatCardMetadata: Record<UserStatId, UserStatCardMetadata> = {
  users: { icon: "users", tone: "magenta" },
  "active-users": { icon: "active-users", tone: "purple" },
  "users-with-loans": { icon: "users-with-loans", tone: "orange" },
  "users-with-savings": { icon: "users-with-savings", tone: "pink" }
};

export function getUserStatCardMetadata(id: UserStatId) {
  return userStatCardMetadata[id];
}
