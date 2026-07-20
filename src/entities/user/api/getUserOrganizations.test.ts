import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getUserOrganizations } from "./getUserOrganizations";

const organizationsResponse = [
  { id: "lendsqr", name: "Lendsqr" },
  { id: "irorun", name: "Irorun" }
];

describe("getUserOrganizations", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("fetches and validates the organizations response", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(organizationsResponse), { status: 200 })
    );
    const controller = new AbortController();

    await expect(getUserOrganizations(controller.signal)).resolves.toEqual(
      organizationsResponse
    );

    const requestUrl = fetchMock.mock.calls[0]?.[0] as URL | undefined;
    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = new Headers(requestOptions?.headers);

    expect(requestUrl?.pathname).toBe("/user/organizations.json");
    expect(headers.get("X-API-Key")).toBeTruthy();
    expect(headers.get("Accept")).toBe("application/json");
    expect(requestOptions?.signal).toBe(controller.signal);
  });

  it("rejects malformed organization data", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([{ id: "lendsqr" }]), { status: 200 })
    );

    await expect(getUserOrganizations()).rejects.toThrow(
      "Unable to load organizations right now."
    );
  });
});
