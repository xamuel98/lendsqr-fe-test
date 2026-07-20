import type { DefaultValues, FieldValues, SubmitHandler } from "react-hook-form";
import type { z } from "zod";

import type { ButtonColor, ButtonSize, ButtonVariant } from "@shared/ui/button";
import type { FormFieldSchema } from "@shared/ui/form-field";

export interface SubmitButtonConfig {
  label: string;
  loadingLabel?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
}

export interface DynamicFormProps<TFieldValues extends FieldValues> {
  fields: FormFieldSchema<TFieldValues>[];
  validationSchema: z.ZodType<TFieldValues>;
  defaultValues: DefaultValues<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  submitButton: SubmitButtonConfig;
  ariaLabel?: string | undefined;
  beforeSubmit?: React.ReactNode | undefined;
  beforeSubmitClassName?: string | undefined;
  afterSubmit?: React.ReactNode | undefined;
  afterSubmitClassName?: string | undefined;
  formError?: string | null | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  fieldsClassName?: string | undefined;
  submitBlockClassName?: string | undefined;
}
