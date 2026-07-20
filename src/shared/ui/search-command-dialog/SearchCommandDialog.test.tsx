import { act } from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { SearchCommandDialog } from "./SearchCommandDialog";
import type { SearchCommandSection } from "./search-command.types";

const sections: SearchCommandSection[] = [
  {
    id: "pages",
    items: [
      {
        description: "Open the dashboard.",
        href: "/dashboard",
        id: "dashboard",
        keywords: ["home"],
        title: "Dashboard"
      }
    ],
    title: "Pages",
    type: "actions"
  }
];

function renderDialog({
  isOpen,
  motionMode = "default"
}: {
  isOpen: boolean;
  motionMode?: "default" | "instant";
}) {
  return render(
    <SearchCommandDialog
      isOpen={isOpen}
      motionMode={motionMode}
      query=""
      sections={sections}
      setQuery={vi.fn()}
      onClose={vi.fn()}
      onSearchQuery={vi.fn()}
      onSelectAction={vi.fn()}
    />
  );
}

describe("SearchCommandDialog", () => {
  it("keeps a pointer-triggered dialog mounted until its exit motion completes", () => {
    vi.useFakeTimers();
    const view = renderDialog({ isOpen: true });

    view.rerender(
      <SearchCommandDialog
        isOpen={false}
        query=""
        sections={sections}
        setQuery={vi.fn()}
        onClose={vi.fn()}
        onSearchQuery={vi.fn()}
        onSelectAction={vi.fn()}
      />
    );

    expect(screen.getByRole("dialog").parentElement).toHaveAttribute(
      "data-state",
      "closing"
    );

    act(() => {
      vi.advanceTimersByTime(219);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("closes instantly when motion is explicitly disabled", () => {
    const view = renderDialog({ isOpen: true, motionMode: "instant" });

    view.rerender(
      <SearchCommandDialog
        isOpen={false}
        motionMode="instant"
        query=""
        sections={sections}
        setQuery={vi.fn()}
        onClose={vi.fn()}
        onSearchQuery={vi.fn()}
        onSelectAction={vi.fn()}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
