import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "./apiClient";

describe("apiClient", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("adds an Accept header without adding Content-Type to GET requests", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ result: true }), { status: 200 })
    );

    await expect(
      apiClient.get(new URL("https://example.test/resource"))
    ).resolves.toEqual({ result: true });

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = new Headers(requestOptions?.headers);

    expect(headers.get("Accept")).toBe("application/json");
    expect(headers.get("Content-Type")).toBeNull();
  });

  it("maps unauthenticated responses to a safe typed error", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await expect(
      apiClient.get(new URL("https://example.test/resource"))
    ).rejects.toEqual(
      expect.objectContaining({
        kind: "authentication",
        message: "Unable to authenticate with the data service.",
        status: 401
      })
    );
  });
});
