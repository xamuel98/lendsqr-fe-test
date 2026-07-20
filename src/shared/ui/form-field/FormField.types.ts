import type { ReactNode } from "react";

import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path
} from "react-hook-form";

export type FieldSize = "default" | "login";
export type FieldType = "input" | "select" | "date";
export type FieldLabelWeight = "regular" | "medium";
export type InputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "number"
  | "search";

export interface SelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
  disabled?: boolean;
}

export interface BaseFieldSchema<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  labelWeight?: FieldLabelWeight;
  hideLabel?: boolean;
  ariaLabel?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  size?: FieldSize;
  prepend?: ReactNode;
  append?: ReactNode;
}

export interface InputFieldSchema<TFieldValues extends FieldValues>
  extends BaseFieldSchema<TFieldValues> {
  fieldType: "input";
  inputType: InputType;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export interface SelectFieldSchema<TFieldValues extends FieldValues>
  extends BaseFieldSchema<TFieldValues> {
  fieldType: "select";
  options: SelectOption[];
}

export interface DateFieldSchema<TFieldValues extends FieldValues>
  extends BaseFieldSchema<TFieldValues> {
  fieldType: "date";
  min?: string;
  max?: string;
}

export type FormFieldSchema<TFieldValues extends FieldValues> =
  | InputFieldSchema<TFieldValues>
  | SelectFieldSchema<TFieldValues>
  | DateFieldSchema<TFieldValues>;

export interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  field: FormFieldSchema<TFieldValues>;
  formDisabled?: boolean;
}

interface ControlMeta {
  describedBy?: string | undefined;
  id: string;
  invalid: boolean;
  isDisabled: boolean;
}

interface BaseControlProps<
  TFieldValues extends FieldValues,
  TFieldSchema extends FormFieldSchema<TFieldValues>
> extends ControlMeta {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  schema: TFieldSchema;
}

export type InputControlProps<TFieldValues extends FieldValues> = BaseControlProps<
  TFieldValues,
  InputFieldSchema<TFieldValues>
>;

export type SelectControlProps<TFieldValues extends FieldValues> = BaseControlProps<
  TFieldValues,
  SelectFieldSchema<TFieldValues>
>;

export type DateControlProps<TFieldValues extends FieldValues> = BaseControlProps<
  TFieldValues,
  DateFieldSchema<TFieldValues>
>;
