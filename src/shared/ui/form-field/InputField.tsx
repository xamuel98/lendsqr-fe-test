import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import styles from "./FormField.module.scss";
import type { InputControlProps } from "./FormField.types";

export function InputField<TFieldValues extends FieldValues>({
  describedBy,
  field,
  id,
  invalid,
  isDisabled,
  schema
}: InputControlProps<TFieldValues>) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = schema.inputType === "password";
  const renderedType =
    isPasswordField && passwordVisible ? "text" : schema.inputType;
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
        autoComplete={schema.autoComplete}
        className={styles.controlElement}
        disabled={isDisabled}
        id={id}
        inputMode={schema.inputMode}
        placeholder={schema.placeholder}
        readOnly={schema.readOnly}
        ref={field.ref}
        required={schema.required}
        type={renderedType}
        value={value}
        onBlur={field.onBlur}
        onChange={field.onChange}
      />

      {schema.append ? (
        <span className={styles.affix} data-position="end">
          {schema.append}
        </span>
      ) : null}

      {schema.showPasswordToggle && isPasswordField ? (
        <button
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          aria-pressed={passwordVisible}
          className={styles.controlAction}
          type="button"
          onClick={() => {
            setPasswordVisible((previousValue) => !previousValue);
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          {passwordVisible ? "Hide" : "Show"}
        </button>
      ) : null}
    </>
  );
}
