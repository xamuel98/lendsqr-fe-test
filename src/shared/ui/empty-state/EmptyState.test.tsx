import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders a reusable retry action for error states", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <EmptyState
        message="Unable to load data."
        variant="error"
        onRetry={onRetry}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load data.");

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("uses the search illustration for filtered empty states", () => {
    const { container } = render(
      <EmptyState message="No matching records." variant="search" />
    );

    expect(container.querySelector('img[src*="empty-search"]')).toBeInTheDocument();
  });

  it("uses a dedicated danger icon for error states", () => {
    const { container } = render(
      <EmptyState message="Unable to load data." variant="error" />
    );

    expect(
      container.querySelector("[data-empty-state-error-icon='true']")
    ).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
