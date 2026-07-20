import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmationDialog } from "./ConfirmationDialog";

describe("ConfirmationDialog", () => {
  it("offers confirm and close controls", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmationDialog
        confirmLabel="Blacklist User"
        description="This action prevents account access."
        isOpen
        title="Blacklist Grace Effiom?"
        tone="danger"
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Blacklist Grace Effiom?");

    await user.click(screen.getByRole("button", { name: "Blacklist User" }));
    await user.click(screen.getByRole("button", { name: "Close confirmation" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("prevents dismissal while confirmation is in progress", () => {
    render(
      <ConfirmationDialog
        confirmLabel="Blacklist User"
        description="This action prevents account access."
        isConfirming
        isOpen
        title="Blacklist Grace Effiom?"
        tone="danger"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Close confirmation" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Confirming" })).toBeDisabled();
  });
});
