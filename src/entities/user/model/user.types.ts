export const userStatuses = [
  "active",
  "inactive",
  "pending",
  "blacklisted"
] as const;

export type UserStatus = (typeof userStatuses)[number];

export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
}
