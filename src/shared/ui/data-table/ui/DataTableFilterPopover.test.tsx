import { useState } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";

import { DataTableFilterPopover } from "./DataTableFilterPopover";

function createRect({
  bottom,
  height,
  left,
  right,
  top,
  width
}: {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}) {
  return {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({})
  } as DOMRect;
}

function PopoverHarness({ motionMode = "default" }: { motionMode?: "default" | "instant" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          setAnchorElement(event.currentTarget);
          setIsOpen(true);
        }}
      >
        Open filters
      </button>
      <DataTableFilterPopover
        anchorElement={anchorElement}
        isOpen={isOpen}
        motionMode={motionMode}
        onClose={() => {
          setAnchorElement(null);
          setIsOpen(false);
        }}
      >
        <button type="button" onClick={() => setIsOpen(false)}>
          Apply and close filters
        </button>
      </DataTableFilterPopover>
    </>
  );
}

describe("DataTableFilterPopover", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps a pointer-triggered popover mounted until exit motion completes", async () => {
    const user = userEvent.setup();
    render(<PopoverHarness />);

    await user.click(screen.getByRole("button", { name: "Open filters" }));
    await user.click(screen.getByRole("button", { name: "Apply and close filters" }));

    expect(screen.getByRole("dialog", { hidden: true }).parentElement).toHaveAttribute(
      "data-state",
      "closing"
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes immediately when motion is disabled", async () => {
    const user = userEvent.setup();
    render(<PopoverHarness motionMode="instant" />);

    await user.click(screen.getByRole("button", { name: "Open filters" }));
    await user.click(screen.getByRole("button", { name: "Apply and close filters" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the anchored popover when its trigger scrolls out of view", async () => {
    const user = userEvent.setup();
    render(<PopoverHarness />);

    const trigger = screen.getByRole("button", { name: "Open filters" });

    await user.click(trigger);

    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(
      createRect({
        bottom: -4,
        height: 40,
        left: 40,
        right: 140,
        top: -44,
        width: 100
      })
    );

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog", { hidden: true }).parentElement).toHaveAttribute(
        "data-state",
        "closing"
      );
    });
  });
});
