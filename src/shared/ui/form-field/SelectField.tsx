import type { FieldValues } from "react-hook-form";

import { IChevronDown } from "@shared/assets/icons";

import styles from "./FormField.module.scss";
import type { SelectControlProps } from "./FormField.types";

export function SelectField<TFieldValues extends FieldValues>({
  describedBy,
  field,
  id,
  invalid,
  isDisabled,
  schema
}: SelectControlProps<TFieldValues>) {
  const value = typeof field.value === "string" ? field.value : "";

  return (
    <>
      {schema.prepend ? (
        <span className={styles.affix} data-position="start">
          {schema.prepend}
        </span>
      ) : null}

      <select
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-label={!schema.label ? schema.ariaLabel : undefined}
        className={`${styles.controlElement} ${styles.selectElement}`}
        disabled={isDisabled}
        id={id}
        ref={field.ref}
        required={schema.required}
        value={value}
        onBlur={field.onBlur}
        onChange={field.onChange}
      >
        <option value="">
          {schema.placeholder ?? "Select"}
        </option>

        {schema.options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {schema.append ? (
        <span className={styles.affix} data-position="end">
          {schema.append}
        </span>
      ) : (
        <span aria-hidden="true" className={styles.affix} data-position="end">
          <IChevronDown />
        </span>
      )}
    </>
  );
}
