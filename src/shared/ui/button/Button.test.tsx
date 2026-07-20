import { render, screen } from "@testing-library/react";

import { Button } from "./Button";

describe("Button", () => {
  it("supports solid and outline variants with color variants", () => {
    render(
      <>
        <Button color="primary" variant="solid">
          Save
        </Button>
        <Button color="danger" variant="outline">
          Delete
        </Button>
      </>
    );

    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "data-variant",
      "solid"
    );
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute(
      "data-variant",
      "outline"
    );
  });

  it("hides its visible label while preserving accessible loading text", () => {
    render(
      <Button isLoading loadingLabel="Saving changes">
        Save
      </Button>
    );

    expect(screen.getByRole("button", { name: "Saving changes" })).toBeDisabled();
    expect(screen.getByText("Save")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Saving changes");
  });
});
