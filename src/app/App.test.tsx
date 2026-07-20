import { render, screen } from "@testing-library/react";

import { App } from "@app/App";

describe("App", () => {
  it("renders the scaffolded application shell", async () => {
    window.history.pushState({}, "", "/login");

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Welcome!"
      })
    ).toBeInTheDocument();
  });
});
