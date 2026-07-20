import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ToastProvider } from "./ToastProvider";
import { useToast } from "./useToast";

function ToastHarness() {
  const { clearToasts, showToast } = useToast();

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          showToast({
            message: "Invalid email or password.",
            title: "Login failed",
            tone: "error"
          });
        }}
      >
        Show toast
      </button>
      <button type="button" onClick={clearToasts}>
        Clear toasts
      </button>
    </div>
  );
}

describe("ToastProvider", () => {
  it("renders an error toast from the hook", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show toast" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Login failed");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email or password.");
  });

  it("dismisses a toast from the close button", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await user.click(
      await screen.findByRole("button", { name: "Dismiss notification" })
    );

    expect(screen.getByRole("alert")).toHaveAttribute("data-state", "closing");

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("auto dismisses after the configured duration", () => {
    vi.useFakeTimers();

    function TimedToastHarness() {
      const { showToast } = useToast();

      return (
        <button
          type="button"
          onClick={() => {
            showToast({
              duration: 1000,
              message: "Request failed.",
              tone: "error"
            });
          }}
        >
          Show timed toast
        </button>
      );
    }

    render(
      <ToastProvider>
        <TimedToastHarness />
      </ToastProvider>
    );

    act(() => {
      screen.getByRole("button", { name: "Show timed toast" }).click();
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Request failed.");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole("alert")).toHaveAttribute("data-state", "closing");

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
