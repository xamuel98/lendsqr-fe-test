import type { Control, FieldValues } from "react-hook-form";

import { FormField } from "@shared/ui/form-field";
import type { FormFieldSchema } from "@shared/ui/form-field";

type RenderFieldOptions<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  field: FormFieldSchema<TFieldValues>;
  formDisabled?: boolean;
};

export function renderField<TFieldValues extends FieldValues>({
  control,
  field,
  formDisabled = false
}: RenderFieldOptions<TFieldValues>) {
  return (
    <FormField
      control={control}
      field={field}
      formDisabled={formDisabled}
      key={field.name}
    />
  );
}
