import { useController } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { DateField } from "./DateField";
import { FieldLabel } from "./FieldLabel";
import { FieldMessage } from "./FieldMessage";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";

import styles from "./FormField.module.scss";
import type { FormFieldProps } from "./FormField.types";

function toAccessibleName(value: string) {
  return value
    .replace(/[.\-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toFieldId(name: string) {
  return `field-${name.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  field,
  formDisabled = false
}: FormFieldProps<TFieldValues>) {
  const {
    field: controlledField,
    fieldState: { error }
  } = useController({
    control,
    name: field.name
  });

  const fieldId = toFieldId(field.name);
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;
  const errorMessage = error?.message;
  const describedBy = [
    field.helperText && !errorMessage ? helperId : null,
    errorMessage ? errorId : null
  ]
    .filter(Boolean)
    .join(" ");
  const isDisabled = formDisabled || field.disabled || false;
  const resolvedAccessibleName =
    field.ariaLabel ?? field.label ?? toAccessibleName(field.name);
  const schema = {
    ...field,
    ariaLabel: resolvedAccessibleName
  };

  return (
    <div className={styles.field}>
      {schema.label ? (
        <FieldLabel
          hidden={schema.hideLabel}
          htmlFor={fieldId}
          label={schema.label}
          weight={schema.labelWeight}
          required={schema.required}
        />
      ) : null}

      <div
        className={styles.control}
        data-disabled={isDisabled ? "true" : "false"}
        data-invalid={errorMessage ? "true" : "false"}
        data-size={schema.size ?? "default"}
      >
        {schema.fieldType === "input" ? (
          <InputField
            describedBy={describedBy || undefined}
            field={controlledField}
            id={fieldId}
            invalid={Boolean(errorMessage)}
            isDisabled={isDisabled}
            schema={schema}
          />
        ) : null}

        {schema.fieldType === "select" ? (
          <SelectField
            describedBy={describedBy || undefined}
            field={controlledField}
            id={fieldId}
            invalid={Boolean(errorMessage)}
            isDisabled={isDisabled}
            schema={schema}
          />
        ) : null}

        {schema.fieldType === "date" ? (
          <DateField
            describedBy={describedBy || undefined}
            field={controlledField}
            id={fieldId}
            invalid={Boolean(errorMessage)}
            isDisabled={isDisabled}
            schema={schema}
          />
        ) : null}
      </div>

      <FieldMessage
        errorId={errorId}
        errorMessage={errorMessage}
        helperId={helperId}
        helperText={schema.helperText}
      />
    </div>
  );
}
