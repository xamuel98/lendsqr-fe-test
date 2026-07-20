import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormEventHandler } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormField } from "./FormField";
import type { FormFieldSchema } from "./FormField.types";

type HarnessValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(1, "Email is required."),
  password: z.string().min(1, "Password is required.")
});

type HarnessProps = {
  field: FormFieldSchema<HarnessValues>;
};

function FieldHarness({ field }: HarnessProps) {
  const form = useForm<HarnessValues>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(schema)
  });
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    void form.handleSubmit(() => undefined)(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField control={form.control} field={field} />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("FormField", () => {
  it("renders a connected label", () => {
    render(
      <FieldHarness
        field={{
          fieldType: "input",
          inputType: "email",
          label: "Email",
          name: "email"
        }}
      />
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("supports the medium label weight variant", () => {
    render(
      <FieldHarness
        field={{
          fieldType: "input",
          inputType: "email",
          label: "Email",
          labelWeight: "medium",
          name: "email"
        }}
      />
    );

    expect(screen.getByText("Email").closest("label")).toHaveAttribute(
      "data-weight",
      "medium"
    );
  });

  it("renders an accessible hidden label when requested", () => {
    render(
      <FieldHarness
        field={{
          fieldType: "input",
          inputType: "email",
          label: "Email",
          hideLabel: true,
          name: "email"
        }}
      />
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
  });

  it("displays validation errors", async () => {
    const user = userEvent.setup();

    render(
      <FieldHarness
        field={{
          fieldType: "input",
          inputType: "email",
          label: "Email",
          name: "email"
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email is required.");
  });

  it("applies the login size variant", () => {
    render(
      <FieldHarness
        field={{
          fieldType: "input",
          inputType: "email",
          label: "Email",
          name: "email",
          size: "login"
        }}
      />
    );

    expect(screen.getByRole("textbox", { name: "Email" }).parentElement).toHaveAttribute(
      "data-size",
      "login"
    );
  });

  it("supports prepend and append content", () => {
    render(
      <FieldHarness
        field={{
          append: <span aria-hidden="true">USD</span>,
          fieldType: "input",
          inputType: "text",
          label: "Amount",
          name: "email",
          prepend: <span aria-hidden="true">$</span>
        }}
      />
    );

    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("starts masked, toggles visibility, and preserves the password value", async () => {
    const user = userEvent.setup();

    render(
      <FieldHarness
        field={{
          fieldType: "input",
          inputType: "password",
          label: "Password",
          name: "password",
          showPasswordToggle: true
        }}
      />
    );

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.type(passwordInput, "password123");
    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(passwordInput).toHaveValue("password123");

    await user.click(screen.getByRole("button", { name: "Hide password" }));

    await waitFor(() => {
      expect(passwordInput).toHaveAttribute("type", "password");
    });
    expect(passwordInput).toHaveValue("password123");
  });
});
