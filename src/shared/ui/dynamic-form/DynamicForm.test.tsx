import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

import { DynamicForm } from "./DynamicForm";

type DemoValues = {
  email: string;
};

const demoSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address.")
});

describe("DynamicForm", () => {
  it("renders fields from schema and uses default values", () => {
    render(
      <DynamicForm<DemoValues>
        ariaLabel="Demo form"
        defaultValues={{ email: "hello@example.com" }}
        fields={[
          {
            fieldType: "input",
            inputType: "email",
            label: "Email",
            name: "email"
          }
        ]}
        onSubmit={() => undefined}
        submitButton={{ label: "Submit" }}
        validationSchema={demoSchema}
      />
    );

    expect(screen.getByRole("form", { name: "Demo form" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
      "hello@example.com"
    );
  });

  it("displays validation errors and submits valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => Promise.resolve());

    render(
      <DynamicForm<DemoValues>
        defaultValues={{ email: "" }}
        fields={[
          {
            fieldType: "input",
            inputType: "email",
            label: "Email",
            name: "email"
          }
        ]}
        onSubmit={onSubmit}
        submitButton={{ label: "Submit" }}
        validationSchema={demoSchema}
      />
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email is required.");

    await user.type(screen.getByRole("textbox", { name: "Email" }), "demo@example.com");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { email: "demo@example.com" },
        expect.anything()
      );
    });
  });

  it("renders beforeSubmit and afterSubmit content", () => {
    render(
      <DynamicForm<DemoValues>
        afterSubmit={<p>After</p>}
        beforeSubmit={<p>Before</p>}
        defaultValues={{ email: "" }}
        fields={[
          {
            fieldType: "input",
            inputType: "email",
            label: "Email",
            name: "email"
          }
        ]}
        onSubmit={() => undefined}
        submitButton={{ label: "Submit" }}
        validationSchema={demoSchema}
      />
    );

    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("prevents duplicate submission while loading", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async () =>
        await new Promise((resolve) => {
          window.setTimeout(resolve, 50);
        })
    );

    render(
      <DynamicForm<DemoValues>
        defaultValues={{ email: "demo@example.com" }}
        fields={[
          {
            fieldType: "input",
            inputType: "email",
            label: "Email",
            name: "email"
          }
        ]}
        onSubmit={onSubmit}
        submitButton={{ label: "Submit", loadingLabel: "Submitting" }}
        validationSchema={demoSchema}
      />
    );

    const button = screen.getByRole("button", { name: "Submit" });

    await user.click(button);
    await user.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
