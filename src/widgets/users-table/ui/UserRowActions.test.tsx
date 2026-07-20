import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach } from "vitest";

import { mockUsers } from "@entities/user";
import { UserStatusActionProvider } from "@app/providers";
import { ToastProvider } from "@shared/ui/toast";

import { UserRowActions } from "./UserRowActions";

function CurrentLocation() {
  const location = useLocation();

  return <output>{`${location.pathname}${location.search}`}</output>;
}

describe("UserRowActions", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("opens user details without an authentication query parameter", async () => {
    const user = userEvent.setup();
    const userRecord = mockUsers[0];

    if (!userRecord) {
      throw new Error("Expected a mock user record");
    }

    render(
      <ToastProvider>
        <UserStatusActionProvider>
          <MemoryRouter initialEntries={["/users"]}>
            <UserRowActions user={userRecord} />
            <CurrentLocation />
          </MemoryRouter>
        </UserStatusActionProvider>
      </ToastProvider>
    );

    await user.click(
      screen.getByRole("button", {
        name: `Open actions for ${userRecord.username}`
      })
    );
    await user.click(screen.getByRole("menuitem", { name: "View details" }));

    expect(
      await screen.findByText(
        `/users/${userRecord.id}`
      )
    ).toBeInTheDocument();
  });

  it("uses the shared confirmation flow to blacklist an active user", async () => {
    const user = userEvent.setup();
    const userRecord = mockUsers.find(({ status }) => status === "active");

    if (!userRecord) {
      throw new Error("Expected an active mock user record");
    }

    render(
      <ToastProvider>
        <UserStatusActionProvider>
          <MemoryRouter initialEntries={["/users"]}>
            <UserRowActions user={userRecord} />
          </MemoryRouter>
        </UserStatusActionProvider>
      </ToastProvider>
    );

    await user.click(
      screen.getByRole("button", {
        name: `Open actions for ${userRecord.username}`
      })
    );
    await user.click(screen.getByRole("menuitem", { name: "Blacklist User" }));

    const dialog = screen.getByRole("dialog", {
      name: `Blacklist ${userRecord.username}?`
    });

    expect(dialog).toHaveTextContent(userRecord.username);
    await user.click(within(dialog).getByRole("button", { name: "Blacklist User" }));

    expect(
      within(dialog).getByRole("button", { name: "Confirming" })
    ).toBeDisabled();
    expect(
      await screen.findByText(`${userRecord.username} has been blacklisted.`)
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: `Open actions for ${userRecord.username}`
      })
    );
    expect(screen.getByRole("menuitem", { name: "Activate User" })).toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Blacklist User" })
    ).not.toBeInTheDocument();
  });
});
