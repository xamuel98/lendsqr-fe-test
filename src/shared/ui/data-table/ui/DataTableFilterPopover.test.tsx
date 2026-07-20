import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataTableFilterPopover } from "./DataTableFilterPopover";

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
});
