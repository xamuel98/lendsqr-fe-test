import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getUsers, appendUserFilters } from "./getUsers";

const usersResponse = {
  data: [
    {
      dateJoined: "2020-01-01",
      email: "adedeji001@lendsqr.com",
      id: "user-0001",
      organization: "Lendsqr",
      phoneNumber: "07000000000",
      status: "inactive",
      username: "adedeji001"
    }
  ],
  limit: 25,
  page: 2,
  total: 500
};

describe("getUsers", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("builds the paginated request with only normalized filters", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(usersResponse), { status: 200 })
    );
    const controller = new AbortController();

    await expect(
      getUsers({
        filters: {
          dateJoined: "2020-01-01",
          email: " adedeji+test@lendsqr.com ",
          organization: " Lendsqr ",
          phoneNumber: " 07000000000 ",
          status: "inactive",
          username: " adedeji001 "
        },
        page: 2,
        pageSize: 25,
        signal: controller.signal
      })
    ).resolves.toEqual(usersResponse);

    const requestUrl = fetchMock.mock.calls[0]?.[0] as URL | undefined;
    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = new Headers(requestOptions?.headers);

    expect(requestUrl?.pathname).toBe("/users.json");
    expect(requestUrl?.searchParams.get("page")).toBe("2");
    expect(requestUrl?.searchParams.get("limit")).toBe("25");
    expect(requestUrl?.searchParams.get("username")).toBe("adedeji001");
    expect(requestUrl?.searchParams.get("organization")).toBe("Lendsqr");
    expect(requestUrl?.searchParams.get("email")).toBe("adedeji+test@lendsqr.com");
    expect(requestUrl?.searchParams.get("phoneNumber")).toBe("07000000000");
    expect(requestUrl?.searchParams.get("status")).toBe("inactive");
    expect(requestUrl?.searchParams.get("dateJoined")).toBe("2020-01-01");
    expect(requestUrl?.toString()).not.toContain("key=");
    expect(headers.get("X-API-Key")).toBeTruthy();
    expect(headers.get("Accept")).toBe("application/json");
    expect(requestOptions?.signal).toBe(controller.signal);
  });

  it("omits blank filter values", () => {
    const searchParams = new URLSearchParams();

    appendUserFilters(searchParams, {
      email: " ",
      organization: "",
      phoneNumber: " ",
      status: "",
      username: " "
    });

    expect(searchParams.toString()).toBe("");
  });
});
