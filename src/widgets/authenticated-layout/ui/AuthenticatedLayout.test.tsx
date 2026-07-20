import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, vi } from "vitest";

import { OrganizationProvider } from "@app/providers";
import {
  clearDemoAuthSession,
  createDemoAuthSession,
  getDemoAuthSession
} from "@shared/storage";
import { ToastProvider } from "@shared/ui/toast";

import { AuthenticatedLayout } from "./AuthenticatedLayout";

function renderAuthenticatedLayout() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <OrganizationProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={["/dashboard"]}>
            <Routes>
              <Route element={<AuthenticatedLayout />}>
                <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                <Route path="/users" element={<h1>Users</h1>} />
                <Route path="/guarantors" element={<h1>Guarantors</h1>} />
                <Route path="/organization" element={<h1>Organization</h1>} />
                <Route path="/login" element={<h1>Login</h1>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </OrganizationProvider>
    </QueryClientProvider>
  );
}

describe("AuthenticatedLayout", () => {
  const organizationsResponse = [
    { id: "lendsqr", name: "Lendsqr" },
    { id: "irorun", name: "Irorun" }
  ];
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(organizationsResponse), { status: 200 })
      )
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    clearDemoAuthSession();
  });

  it("toggles the sidebar from the hamburger button", async () => {
    const user = userEvent.setup();

    renderAuthenticatedLayout();

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);

    expect(menuButton).toHaveAccessibleName("Close navigation");
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await user.click(menuButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Open navigation" })
      ).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("closes the mobile sidebar after route changes", async () => {
    const user = userEvent.setup();

    renderAuthenticatedLayout();

    await screen.findByRole("navigation", { name: "Primary" });
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    await user.click(await screen.findByRole("link", { name: "Users" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Open navigation" })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile sidebar from the overlay", async () => {
    const user = userEvent.setup();

    const { container } = renderAuthenticatedLayout();

    await user.click(screen.getByRole("button", { name: "Open navigation" }));

    const overlayButton = container.querySelector<HTMLButtonElement>(
      'button[aria-hidden="false"][data-open="true"]'
    );

    expect(overlayButton).toBeDefined();
    expect(overlayButton).toHaveAttribute("aria-hidden", "false");

    await user.click(overlayButton!);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Open navigation" })
      ).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("locks background scrolling while the mobile sidebar is open", async () => {
    const user = userEvent.setup();
    const previousBodyOverflow = document.body.style.overflow;

    renderAuthenticatedLayout();

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    await user.click(menuButton);

    expect(document.body.style.overflow).toBe("hidden");

    await user.click(menuButton);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe(previousBodyOverflow);
    });
  });

  it("switches organization and provides an add organization action", async () => {
    const user = userEvent.setup();

    createDemoAuthSession();
    renderAuthenticatedLayout();

    await screen.findByRole("navigation", { name: "Primary" });
    await user.click(
      screen.getByRole("button", {
        name: "Switch organization. Current organization: Lendsqr"
      })
    );

    expect(
      screen.getByRole("menu", { name: "Switch organization" })
    ).toBeInTheDocument();
    expect(await screen.findByRole("menuitem", { name: "Lendsqr" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    expect(screen.getByRole("menuitem", { name: "Irorun" })).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Irorun" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Switched to Irorun."
    );
    expect(getDemoAuthSession()?.organization).toEqual({
      id: "irorun",
      name: "Irorun"
    });
    expect(
      screen.getByRole("button", {
        name: "Switch organization. Current organization: Irorun"
      })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", {
        name: "Switch organization. Current organization: Irorun"
      })
    );
    await user.click(screen.getByRole("menuitem", { name: "Add organization" }));

    expect(await screen.findByRole("heading", { name: "Organization" })).toBeInTheDocument();
  });

  it("renders a sidebar skeleton while organizations are loading", async () => {
    fetchMock.mockImplementation(() => new Promise<Response>(() => {}));

    const { container } = renderAuthenticatedLayout();

    await waitFor(() => {
      expect(
        container.querySelector("[data-sidebar-loading='true']")
      ).toBeInTheDocument();
    });
    expect(screen.queryByRole("navigation", { name: "Primary" })).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-organization-spinner='true']")
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading organizations..."
    );
  });

  it("shows a clear retry button when organizations fail to load", async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() => Promise.reject(new Error("Network failure")));

    renderAuthenticatedLayout();

    await screen.findByRole("navigation", { name: "Primary" });
    await user.click(
      screen.getByRole("button", {
        name: "Switch organization. Current organization: Switch Organization"
      })
    );

    expect(
      document.body.querySelector("[data-organization-error-icon='true']")
    ).toBeInTheDocument();
    expect(screen.getByText("Unable to load organizations.")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Retry loading organizations" })
    ).toBeInstanceOf(HTMLButtonElement);
    expect(screen.queryByRole("heading", { name: "Dashboard" })).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load organizations."
    );
  });

  it("clears all persisted storage on logout", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("lendsqr.demo-auth-session", "{}");
    window.localStorage.setItem("lendsqr.user-status-overrides", "{}");

    renderAuthenticatedLayout();

    await screen.findByRole("navigation", { name: "Primary" });
    await user.click(await screen.findByRole("link", { name: "Logout" }));

    expect(window.localStorage.length).toBe(0);
  });
});
