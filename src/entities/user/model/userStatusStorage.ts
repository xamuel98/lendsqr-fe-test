import { userStatuses, type UserStatus } from "./user.types";
import { readLocalStorage, writeLocalStorage } from "@shared/storage";

const userStatusesStorageKey = "lendsqr.user-statuses";

type UserStatusOverrides = Record<string, UserStatus>;

function isUserStatus(value: unknown): value is UserStatus {
  return typeof value === "string" && userStatuses.includes(value as UserStatus);
}

function getUserStatusOverrides(): UserStatusOverrides {
  const storedOverrides = readLocalStorage<unknown>(userStatusesStorageKey);

  if (!storedOverrides || typeof storedOverrides !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(storedOverrides).filter(([, status]) => isUserStatus(status))
  );
}

export function getStoredUserStatus(userId: string, fallbackStatus: UserStatus) {
  return getUserStatusOverrides()[userId] ?? fallbackStatus;
}

export function storeUserStatus(userId: string, status: UserStatus) {
  const statusOverrides = getUserStatusOverrides();
  statusOverrides[userId] = status;
  writeLocalStorage(userStatusesStorageKey, statusOverrides);
}
