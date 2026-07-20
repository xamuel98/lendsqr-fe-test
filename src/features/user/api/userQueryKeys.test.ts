import { describe, expect, it } from "vitest";

import { normaliseUserFilters } from "@entities/user";

import { userQueryKeys } from "./userQueryKeys";

describe("userQueryKeys", () => {
  it("keeps empty and whitespace filters equivalent", () => {
    expect(
      userQueryKeys.list({
        filters: normaliseUserFilters({ username: " " }),
        organizationId: "lendsqr",
        page: 1,
        pageSize: 25
      })
    ).toEqual(
      userQueryKeys.list({
        filters: normaliseUserFilters({}),
        organizationId: "lendsqr",
        page: 1,
        pageSize: 25
      })
    );
  });

  it("changes with pagination and active filter values", () => {
    const firstPage = userQueryKeys.list({
      filters: {},
      organizationId: "lendsqr",
      page: 1,
      pageSize: 25
    });
    const secondPage = userQueryKeys.list({
      filters: {},
      organizationId: "lendsqr",
      page: 2,
      pageSize: 25
    });
    const differentPageSize = userQueryKeys.list({
      filters: {},
      organizationId: "lendsqr",
      page: 1,
      pageSize: 50
    });
    const filtered = userQueryKeys.list({
      filters: { status: "active" },
      organizationId: "lendsqr",
      page: 1,
      pageSize: 25
    });

    expect(secondPage).not.toEqual(firstPage);
    expect(differentPageSize).not.toEqual(firstPage);
    expect(filtered).not.toEqual(firstPage);
  });

  it("keeps each user detail record in its own cache entry", () => {
    expect(userQueryKeys.detail("user-0003", "lendsqr")).not.toEqual(
      userQueryKeys.detail("user-0004", "lendsqr")
    );
  });

  it("keeps organization data in separate cache entries", () => {
    expect(userQueryKeys.stats("lendsqr")).not.toEqual(
      userQueryKeys.stats("irorun")
    );
  });
});
