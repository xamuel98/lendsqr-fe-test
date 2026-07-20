import type { UserStatus } from "../model/user.types";
import type { User, UserDetails, UserStat } from "../model";

export const userPageSizes = [10, 25, 50, 100] as const;
export const defaultUserPageSize = 10 satisfies UserPageSize;

export type UserPageSize = (typeof userPageSizes)[number];

export interface UserFilters {
  dateJoined?: string;
  email?: string;
  organization?: string;
  phoneNumber?: string;
  status?: UserStatus | "";
  username?: string;
}

export interface GetUsersParams {
  filters?: UserFilters;
  page: number;
  pageSize: UserPageSize;
  signal?: AbortSignal;
}

export interface GetUserDetailsParams {
  signal?: AbortSignal;
  userId: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  limit: UserPageSize;
  page: number;
  total: number;
}

export type UserStats = UserStat[];
export type UserDetailsResponse = UserDetails;

export function normaliseUserFilters(filters: UserFilters = {}): UserFilters {
  const normalisedFilters: UserFilters = {};
  const username = filters.username?.trim();
  const organization = filters.organization?.trim();
  const email = filters.email?.trim();
  const phoneNumber = filters.phoneNumber?.trim();

  if (username) {
    normalisedFilters.username = username;
  }

  if (organization) {
    normalisedFilters.organization = organization;
  }

  if (email) {
    normalisedFilters.email = email;
  }

  if (phoneNumber) {
    normalisedFilters.phoneNumber = phoneNumber;
  }

  if (filters.status) {
    normalisedFilters.status = filters.status;
  }

  if (filters.dateJoined) {
    normalisedFilters.dateJoined = filters.dateJoined;
  }

  return normalisedFilters;
}

export function normaliseUserPageSize(value: number): UserPageSize {
  return userPageSizes.includes(value as UserPageSize)
    ? (value as UserPageSize)
    : defaultUserPageSize;
}
