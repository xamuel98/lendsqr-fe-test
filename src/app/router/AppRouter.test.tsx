import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { AppRouter } from "@app/router";
import { QueryProvider } from "@app/providers";
import { clearDemoAuthSession, createDemoAuthSession } from "@shared/storage";
import { ToastProvider } from "@shared/ui/toast";

function renderRouter(initialEntry: string) {
  return render(
    <QueryProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <AppRouter />
        </MemoryRouter>
      </ToastProvider>
    </QueryProvider>
  );
}

describe("AppRouter", () => {
  beforeEach(() => {
    clearDemoAuthSession();
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : input.url;
        const body = url.includes("/stats.json")
          ? []
          : url.includes("/user/organizations.json")
            ? [
                { id: "lendsqr", name: "Lendsqr" },
                { id: "irorun", name: "Irorun" }
              ]
            : { data: [], limit: 10, page: 1, total: 0 };

        return Promise.resolve(
          new Response(JSON.stringify(body), {
            headers: { "Content-Type": "application/json" },
            status: 200
          })
        );
      })
    );
  });

  afterEach(() => {
    clearDemoAuthSession();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders login outside the authenticated layout", async () => {
    renderRouter("/login");

    expect(
      await screen.findByRole("heading", {
        name: "Welcome!"
      })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Primary")).not.toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  });

  it("renders protected placeholders inside the authenticated layout", async () => {
    createDemoAuthSession();
    renderRouter("/dashboard");

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard"
      })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("navigation", { name: "Primary" })
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a 404 page for an unknown authenticated route", async () => {
    createDemoAuthSession();
    renderRouter("/not-a-dashboard-route");

    expect(
      await screen.findByRole("heading", { name: "Page Not Found" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("navigation", { name: "Primary" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.queryByRole("link", { name: "Return to login" })).not.toBeInTheDocument();
  });

  it("scrolls to the top after protected route changes", async () => {
    const user = userEvent.setup();
    const scrollToSpy = vi.mocked(window.scrollTo);

    createDemoAuthSession();
    renderRouter("/dashboard");

    await screen.findByRole("heading", {
      name: "Dashboard"
    });

    scrollToSpy.mockClear();

    await user.click(await screen.findByRole("link", { name: "Users" }));

    expect(await screen.findByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(scrollToSpy).toHaveBeenCalledWith({
      behavior: "auto",
      left: 0,
      top: 0
    });
  });
});
