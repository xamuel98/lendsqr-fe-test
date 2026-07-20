export const userStatIds = [
  "users",
  "active-users",
  "users-with-loans",
  "users-with-savings"
] as const;

export type UserStatId = (typeof userStatIds)[number];

export interface UserStat {
  id: UserStatId;
  title: string;
  value: number;
}
