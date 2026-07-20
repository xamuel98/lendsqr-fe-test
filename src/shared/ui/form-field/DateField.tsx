import type { FieldValues } from "react-hook-form";

import { ICalendar } from "@shared/assets/icons";

import styles from "./FormField.module.scss";
import type { DateControlProps } from "./FormField.types";

export function DateField<TFieldValues extends FieldValues>({
  describedBy,
  field,
  id,
  invalid,
  isDisabled,
  schema
}: DateControlProps<TFieldValues>) {
  const value = typeof field.value === "string" ? field.value : "";

  return (
    <>
      {schema.prepend ? (
        <span className={styles.affix} data-position="start">
          {schema.prepend}
        </span>
      ) : null}

      <input
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-label={!schema.label ? schema.ariaLabel : undefined}
        className={`${styles.controlElement} ${styles.dateElement}`}
        disabled={isDisabled}
        id={id}
        max={schema.max}
        min={schema.min}
        placeholder={schema.placeholder}
        readOnly={schema.readOnly}
        ref={field.ref}
        required={schema.required}
        type="date"
        value={value}
        onBlur={field.onBlur}
        onChange={field.onChange}
      />

      {schema.append ? (
        <span className={styles.affix} data-position="end">
          {schema.append}
        </span>
      ) : (
        <span aria-hidden="true" className={styles.affix} data-position="end">
          <ICalendar />
        </span>
      )}
    </>
  );
}
