import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { DropdownMenu, DropdownMenuItem } from "./DropdownMenu";

function MenuHarness({ onSelect = vi.fn() }: { onSelect?: () => void }) {
  return (
    <DropdownMenu
      ariaLabel="Record actions"
      trigger={
        <button aria-label="Open record actions" type="button">
          Actions
        </button>
      }
    >
      <DropdownMenuItem onClick={onSelect}>View details</DropdownMenuItem>
      <DropdownMenuItem tone="danger">Delete record</DropdownMenuItem>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("opens from its supplied trigger and connects the menu semantics", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    await user.click(screen.getByRole("button", { name: "Open record actions" }));

    expect(screen.getByRole("menu", { name: "Record actions" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "View details" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open record actions" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("button", { name: "Open record actions" })).toHaveAttribute(
      "data-state",
      "open"
    );
  });

  it("supports keyboard navigation and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);
    const trigger = screen.getByRole("button", { name: "Open record actions" });

    trigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("menu", { name: "Record actions" })).toHaveAttribute(
      "data-motion",
      "instant"
    );
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "View details" })).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("menuitem", { name: "Delete record" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("runs an item action and closes the menu", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MenuHarness onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Open record actions" }));
    await user.click(screen.getByRole("menuitem", { name: "View details" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu", { hidden: true })).toHaveAttribute(
      "data-state",
      "closing"
    );

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
