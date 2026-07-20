import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ToastProvider } from "@shared/ui/toast";

import { TopNavigation } from "./TopNavigation";

function renderTopNavigation(onMenuOpen = () => undefined) {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            element={
              <TopNavigation
                onMenuOpen={onMenuOpen}
                user={{ name: "Adedeji" }}
              />
            }
            path="/dashboard"
          />
          <Route element={<h1>Users page</h1>} path="/users" />
          <Route element={<h1>User details page</h1>} path="/users/7947" />
          <Route element={<h1>Login page</h1>} path="/login" />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
}

describe("TopNavigation", () => {
  it("renders the core header controls", () => {
    renderTopNavigation();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("search", { name: "Global search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open navigation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View notifications" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open profile menu for Adedeji" })
    ).toBeInTheDocument();
  });

  it("calls the mobile menu callback", async () => {
    const user = userEvent.setup();
    const onMenuOpen = vi.fn();

    renderTopNavigation(onMenuOpen);

    await user.click(screen.getByRole("button", { name: "Open navigation" }));

    expect(onMenuOpen).toHaveBeenCalledTimes(1);
  });

  it("opens an empty notifications dropdown from the bell action", async () => {
    const user = userEvent.setup();

    renderTopNavigation();

    await user.click(screen.getByRole("button", { name: "View notifications" }));

    const menu = screen.getByRole("menu", { name: "Notifications" });

    expect(menu).toHaveTextContent("No notifications yet");
    expect(menu).toHaveTextContent("Updates about your account will appear here.");
    expect(screen.getByRole("button", { name: "View notifications" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("opens a profile menu and clears storage when logging out", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("lendsqr.demo-auth-session", "{}");
    window.localStorage.setItem("lendsqr.user-status-overrides", "{}");

    renderTopNavigation();

    await user.click(
      screen.getByRole("button", { name: "Open profile menu for Adedeji" })
    );

    const menu = screen.getByRole("menu", { name: "Profile menu" });

    expect(menu).toHaveTextContent("demo@lendsqr.com");
    expect(within(menu).getByRole("menuitem", { name: "Preferences" })).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: "Fees and Pricing" })
    ).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Audit Logs" })).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: "System Messages" })
    ).toBeInTheDocument();

    await user.click(within(menu).getByRole("menuitem", { name: "Log out" }));

    expect(window.localStorage.length).toBe(0);
    expect(await screen.findByRole("heading", { name: "Login page" })).toBeInTheDocument();
  });

  it("falls back to user initials when the avatar image fails to load", async () => {
    const { container } = render(
      <ToastProvider>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route
              element={
                <TopNavigation
                  user={{
                    avatarUrl: "https://example.com/broken-avatar.png",
                    name: "Adedeji"
                  }}
                />
              }
              path="/dashboard"
            />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    );

    const avatarImage = container.querySelector('[class*="avatarImage"]');

    expect(avatarImage).not.toBeNull();

    fireEvent.error(avatarImage as HTMLImageElement);

    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  it("opens the command palette when the desktop search trigger receives focus", async () => {
    const user = userEvent.setup();

    renderTopNavigation();

    await user.tab();
    await user.tab();
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    });

    expect(screen.getByRole("searchbox", { name: "Search the dashboard" })).toHaveFocus();
  });

  it("opens the search dialog and navigates through a command result", async () => {
    const user = userEvent.setup();

    renderTopNavigation();

    await user.click(screen.getByRole("button", { name: "Open search" }));

    expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pages" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Help" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "News" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read update" })
    ).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox", { name: "Search the dashboard" }), "users");
    await user.click(screen.getByRole("option", { name: /^Users Link$/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Users page" })).toBeInTheDocument();
    });
  });

  it("keeps the news section visible when the query matches its metadata", async () => {
    const user = userEvent.setup();

    renderTopNavigation();

    await user.click(screen.getByRole("button", { name: "Open search" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Search the dashboard" }),
      "reporting"
    );

    expect(screen.getByRole("heading", { name: "News" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read update" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Pages" })
    ).not.toBeInTheDocument();
  });
});
