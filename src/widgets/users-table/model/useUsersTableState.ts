import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  normaliseUserFilters,
  normaliseUserPageSize,
  userPageSizes,
  userStatuses,
  type User,
  type UserPageSize,
  type UserStatus
} from "@entities/user";
import { useFetchUsers } from "@features/user";

import { emptyUserFilterValues, type UserFilterValues } from "./userFilterTypes";

const pageSizeOptions = [...userPageSizes];
const emptyRecords: User[] = [];

function getPositiveInteger(value: string | null, fallback: number) {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function normalisePageSize(value: string | null): UserPageSize {
  const pageSize = getPositiveInteger(value, 100);

  return normaliseUserPageSize(pageSize);
}

function isUserStatus(value: string | null): value is UserStatus {
  return value !== null && userStatuses.includes(value as UserStatus);
}

function getFilters(searchParams: URLSearchParams): UserFilterValues {
  const status = searchParams.get("status");

  return {
    organization: searchParams.get("organization") ?? "",
    username: searchParams.get("username") ?? "",
    email: searchParams.get("email") ?? "",
    dateJoined: searchParams.get("dateJoined") ?? "",
    phoneNumber: searchParams.get("phoneNumber") ?? "",
    status: isUserStatus(status) ? status : ""
  };
}

function setFilterParams(searchParams: URLSearchParams, filters: UserFilterValues) {
  const parameterNames: Record<keyof UserFilterValues, string> = {
    organization: "organization",
    username: "username",
    email: "email",
    dateJoined: "dateJoined",
    phoneNumber: "phoneNumber",
    status: "status"
  };

  const normalisedFilters = normaliseUserFilters(filters);

  Object.entries(parameterNames).forEach(([field, parameterName]) => {
    const value = normalisedFilters[field as keyof UserFilterValues];

    if (value) {
      searchParams.set(parameterName, value);
    } else {
      searchParams.delete(parameterName);
    }
  });
}

export function useUsersTableState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = getFilters(searchParams);
  const pageSize = normalisePageSize(searchParams.get("pageSize"));
  const page = getPositiveInteger(searchParams.get("page"), 1);
  const usersQuery = useFetchUsers({ filters, page, pageSize });
  const totalRecords = usersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const records = usersQuery.data?.data ?? emptyRecords;
  const organizations = useMemo(
    () => Array.from(new Set(records.map((user) => user.organization))).sort(),
    [records]
  );
  const hasActiveFilters = Object.values(filters).some(Boolean);

  function updateSearchParams(mutator: (nextParams: URLSearchParams) => void) {
    const nextParams = new URLSearchParams(searchParams);
    mutator(nextParams);
    setSearchParams(nextParams);
  }

  function setPage(nextPage: number) {
    updateSearchParams((nextParams) => {
      nextParams.set("page", String(Math.min(Math.max(nextPage, 1), totalPages)));
    });
  }

  function setPageSize(nextPageSize: number) {
    updateSearchParams((nextParams) => {
      nextParams.set("page", "1");
      nextParams.set("pageSize", String(normaliseUserPageSize(nextPageSize)));
    });
  }

  function applyFilters(nextFilters: UserFilterValues) {
    updateSearchParams((nextParams) => {
      nextParams.set("page", "1");
      setFilterParams(nextParams, nextFilters);
    });
  }

  function resetFilters() {
    applyFilters(emptyUserFilterValues);
  }

  function retryUsers() {
    void usersQuery.refetch();
  }

  return {
    filters,
    hasActiveFilters,
    isError: usersQuery.isError,
    isFetching: usersQuery.isFetching,
    isLoading: usersQuery.isLoading,
    isRetrying: usersQuery.isRefetching,
    organizations,
    page,
    pageSize,
    pageSizeOptions,
    records,
    resetFilters,
    retryUsers,
    setPage,
    setPageSize,
    totalRecords,
    applyFilters,
    error: usersQuery.error
  };
}
