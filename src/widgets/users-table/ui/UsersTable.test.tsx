import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import { afterEach, beforeEach, vi } from "vitest";

import { UserOrganizationContext } from "@entities/user";
import { UserStatusActionProvider } from "@app/providers";
import { ToastProvider } from "@shared/ui/toast";

import { UsersTable } from "./UsersTable";

const usersResponse = {
  data: [
    {
      dateJoined: "2020-01-01",
      email: "adedeji001@lendsqr.com",
      id: "user-0001",
      organization: "Lendsqr",
      phoneNumber: "07000000000",
      status: "active",
      username: "adedeji001"
    }
  ],
  limit: 100,
  page: 1,
  total: 1
};

function LocationProbe() {
  const [searchParams] = useSearchParams();

  return <output>{searchParams.toString()}</output>;
}

function renderUsersTable(initialEntry = "/users") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <UserOrganizationContext.Provider
        value={{
          activeOrganization: { id: "lendsqr", name: "Lendsqr" },
          selectOrganization: () => {}
        }}
      >
        <ToastProvider>
          <UserStatusActionProvider>
            <MemoryRouter initialEntries={[initialEntry]}>
              <UsersTable />
              <LocationProbe />
            </MemoryRouter>
          </UserStatusActionProvider>
        </ToastProvider>
      </UserOrganizationContext.Provider>
    </QueryClientProvider>
  );
}

describe("UsersTable", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockImplementation((input: URL | RequestInfo) => {
      const url =
        input instanceof URL
          ? input
          : typeof input === "string"
            ? new URL(input)
            : new URL(input.url);
      const hasNoMatchFilter = url.searchParams.get("username") === "no-match";

      return Promise.resolve(
        new Response(
          JSON.stringify(
            hasNoMatchFilter
              ? { ...usersResponse, data: [], total: 0 }
              : usersResponse
          ),
          { status: 200 }
        )
      );
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("renders user columns and opens the shared filter form from a header", async () => {
    const user = userEvent.setup();
    renderUsersTable();

    expect(screen.getByText("Organization")).toBeInTheDocument();
    expect((await screen.findAllByText("Active")).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Filter by Email" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Organization")).toBeInTheDocument();
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText("Email"));
    });
  });

  it("applies draft filters only after Filter is selected", async () => {
    const user = userEvent.setup();
    renderUsersTable("/users?page=2&pageSize=25");

    await user.click(screen.getByRole("button", { name: "Filter by Username" }));
    await user.clear(screen.getByLabelText("Username"));
    await user.type(screen.getByLabelText("Username"), "no-match");

    expect(screen.getByText("adedeji001")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter" }));

    await waitFor(() => {
      expect(screen.getByText("No users match the applied filters.")).toBeInTheDocument();
    });

    expect(screen.getByText(/page=1/)).toBeInTheDocument();
    expect(screen.getByText(/pageSize=25/)).toBeInTheDocument();
    expect(screen.getByText(/username=no-match/)).toBeInTheDocument();
  });

  it("retries loading users after a request failure", async () => {
    const user = userEvent.setup();
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(usersResponse), { status: 200 }));

    renderUsersTable();

    expect(await screen.findByText("Unable to load data right now.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("adedeji001")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
