import { render, screen } from "@testing-library/react";

import { StatCard } from "./StatCard";
import styles from "./StatCard.module.scss";
import { StatCardSkeleton } from "./StatCardSkeleton";

function TestIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

describe("StatCard", () => {
  it("renders the title, value, and decorative icon", () => {
    render(<StatCard icon={<TestIcon />} title="Users" value="2,453" />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("2,453")).toBeInTheDocument();
    expect(screen.getByText("Users").closest("article")).toHaveAttribute(
      "data-tone",
      "magenta"
    );
  });

  it("supports alternate tones and meta content", () => {
    render(
      <StatCard
        icon={<TestIcon />}
        meta="Updated 12 minutes ago"
        title="Active loans"
        tone="purple"
        value="18,340"
      />
    );

    expect(screen.getByText("Updated 12 minutes ago")).toBeInTheDocument();
    expect(screen.getByText("Active loans").closest("article")).toHaveAttribute(
      "data-tone",
      "purple"
    );
  });

  it("renders an inert loading placeholder with the same card surface", () => {
    const { container } = render(<StatCardSkeleton />);
    const skeleton = container.querySelector("article[data-loading='true']");

    if (!skeleton) {
      throw new Error("Expected the stat card skeleton to render.");
    }

    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass(styles.card!, styles.skeletonCard!);
  });
});
