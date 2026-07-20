import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ToastProvider } from "@shared/ui/toast";
import { clearDemoAuthSession, getDemoAuthSession } from "@shared/storage";

import { LoginPage } from "./LoginPage";

function renderLoginPage() {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<h1>Users</h1>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    clearDemoAuthSession();
  });

  it("renders the login fields and supports keyboard submission flow", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    expect(
      screen.getByRole("heading", {
        name: "Welcome!"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    await user.tab();
    await user.tab();

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus();
  });

  it("shows validation errors", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    await user.click(screen.getByRole("button", { name: "LOG IN" }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(await screen.findByText("Password is required.")).toBeInTheDocument();
  });

  it("submits valid credentials and navigates to users", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    await user.type(screen.getByRole("textbox", { name: "Email" }), "demo@lendsqr.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "LOG IN" }));

    expect(await screen.findByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(getDemoAuthSession()).toEqual({
      authenticated: true,
      email: "demo@lendsqr.com",
      organization: {
        id: "lendsqr",
        name: "Lendsqr"
      }
    });
  });

  it("normalizes email before validating and submitting", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    await user.type(screen.getByRole("textbox", { name: "Email" }), "  Demo@Lendsqr.COM  ");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "LOG IN" }));

    expect(await screen.findByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(getDemoAuthSession()?.email).toBe("demo@lendsqr.com");
  });

  it("displays invalid-credentials and generic request errors", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    await user.type(screen.getByRole("textbox", { name: "Email" }), "wrong@lendsqr.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "LOG IN" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");

    await user.clear(screen.getByRole("textbox", { name: "Email" }));
    await user.type(screen.getByRole("textbox", { name: "Email" }), "server@lendsqr.com");
    await user.click(screen.getByRole("button", { name: "LOG IN" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "We couldn't reach the server. Please try again."
      );
    });
  });
});
