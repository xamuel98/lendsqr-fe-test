import type { FormFieldSchema } from "@shared/ui/form-field";

import type { LoginFormValues } from "./loginTypes";

export const loginDefaultValues: LoginFormValues = {
  email: "",
  password: ""
};

export const loginFields: FormFieldSchema<LoginFormValues>[] = [
  {
    fieldType: "input",
    inputType: "email",
    name: "email",
    label: "Email",
    hideLabel: true,
    placeholder: "Email",
    required: true,
    size: "login",
    autoComplete: "email"
  },
  {
    fieldType: "input",
    inputType: "password",
    name: "password",
    label: "Password",
    hideLabel: true,
    placeholder: "Password",
    required: true,
    size: "login",
    autoComplete: "current-password",
    showPasswordToggle: true
  }
];
