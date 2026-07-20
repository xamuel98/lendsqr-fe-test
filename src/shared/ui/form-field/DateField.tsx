import type { FieldValues } from "react-hook-form";

import styles from "./FormField.module.scss";
import type { DateControlProps } from "./FormField.types";

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66665 1.66663V4.16663M13.3333 1.66663V4.16663M2.49998 7.49996H17.5M4.16665 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16665C3.24617 18.3333 2.49998 17.5871 2.49998 16.6666V4.99996C2.49998 4.07948 3.24617 3.33329 4.16665 3.33329Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

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
          <CalendarIcon />
        </span>
      )}
    </>
  );
}
