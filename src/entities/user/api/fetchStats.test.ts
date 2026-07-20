import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getUserStats as fetchStats } from "./getUserStats";

const statsResponse = [
  { id: "users", title: "Users", value: 2453 },
  { id: "active-users", title: "Active Users", value: 2453 },
  { id: "users-with-loans", title: "Users With Loans", value: 12453 },
  { id: "users-with-savings", title: "Users With Savings", value: 102453 }
];

describe("fetchStats", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("fetches and validates the user statistics response", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(statsResponse), { status: 200 })
    );

    await expect(fetchStats()).resolves.toEqual(statsResponse);
    const requestUrl = fetchMock.mock.calls[0]?.[0] as URL | undefined;
    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = new Headers(requestOptions?.headers);

    expect(requestUrl?.pathname).toBe("/stats.json");
    expect(requestUrl?.search).toBe("");
    expect(headers.get("X-API-Key")).toBeTruthy();
    expect(headers.get("Accept")).toBe("application/json");
  });

  it("surfaces the server error message when the request fails", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: "Stats are unavailable." }), {
        status: 500
      })
    );

    await expect(fetchStats()).rejects.toThrow("Unable to load data right now.");
  });
});
