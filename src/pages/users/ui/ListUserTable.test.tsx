import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, vi } from "vitest";

import { UserOrganizationContext } from "@entities/user";
import { UserStatusActionProvider } from "@app/providers";
import { ToastProvider } from "@shared/ui/toast";

import { ListUserTable } from "./ListUserTable";

const statsResponse = [
  { id: "users", title: "Users", value: 2453 },
  { id: "active-users", title: "Active Users", value: 2453 },
  { id: "users-with-loans", title: "Users With Loans", value: 12453 },
  { id: "users-with-savings", title: "Users With Savings", value: 102453 }
];

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
  limit: 100,
  page: 1,
  total: 1
};

function renderPage() {
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
            <MemoryRouter>
              <ListUserTable />
            </MemoryRouter>
          </UserStatusActionProvider>
        </ToastProvider>
      </UserOrganizationContext.Provider>
    </QueryClientProvider>
  );
}

describe("ListUserTable", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockImplementation((input: URL | RequestInfo) => {
      const url =
        input instanceof URL
          ? input
          : typeof input === "string"
            ? new URL(input)
            : new URL(input.url);
      const response = url.pathname === "/stats.json" ? statsResponse : usersResponse;

      return Promise.resolve(
        new Response(JSON.stringify(response), { status: 200 })
      );
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("renders API statistics with their mapped icon tones", async () => {
    renderPage();

    expect(
      screen.getByRole("heading", {
        name: "Users"
      })
    ).toBeInTheDocument();

    expect(await screen.findByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("Users With Loans")).toBeInTheDocument();
    expect(screen.getByText("Users With Savings")).toBeInTheDocument();
    expect(screen.getAllByText(/2,453|12,453|102,453/)).toHaveLength(4);
    expect(screen.getByText("Users", { selector: "p" }).closest("article")).toHaveAttribute(
      "data-tone",
      "magenta"
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shows four stat card skeletons while statistics are loading", () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    const { container } = renderPage();

    expect(screen.getByRole("status")).toHaveTextContent("Loading user statistics...");
    expect(container.querySelectorAll("article[data-loading='true']")).toHaveLength(4);
  });

  it("uses the shared empty state when the statistics response is empty", async () => {
    fetchMock.mockImplementation((input: URL | RequestInfo) => {
      const url =
        input instanceof URL
          ? input
          : typeof input === "string"
            ? new URL(input)
            : new URL(input.url);
      const response = url.pathname === "/stats.json" ? [] : usersResponse;

      return Promise.resolve(new Response(JSON.stringify(response), { status: 200 }));
    });

    renderPage();

    expect(await screen.findByText("No user statistics are available.")).toBeInTheDocument();
  });
});
