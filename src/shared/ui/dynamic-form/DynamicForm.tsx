import { useEffect, useRef } from "react";
import type { SubmitEventHandler } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues, Resolver, SubmitHandler } from "react-hook-form";

import { joinClassNames } from "@shared/lib/joinClassNames";
import { Button } from "@shared/ui/button";

import { renderField } from "./renderField";

import styles from "./DynamicForm.module.scss";
import type { DynamicFormProps } from "./DynamicForm.types";

export function DynamicForm<TFieldValues extends FieldValues>({
  beforeSubmit,
  beforeSubmitClassName,
  ariaLabel,
  className,
  defaultValues,
  disabled = false,
  fields,
  fieldsClassName,
  formError,
  onSubmit,
  submitButton,
  submitBlockClassName,
  validationSchema,
  afterSubmit,
  afterSubmitClassName
}: DynamicFormProps<TFieldValues>) {
  const errorRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);
  const resolver = zodResolver(
    validationSchema as Parameters<typeof zodResolver>[0]
  ) as Resolver<TFieldValues>;
  const methods = useForm<TFieldValues>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver,
    shouldFocusError: true
  });
  const isBusy = disabled || methods.formState.isSubmitting;
  const handleValidSubmit: SubmitHandler<TFieldValues> = async (values, event) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await onSubmit(values, event);
    } finally {
      isSubmittingRef.current = false;
    }
  };
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    void methods.handleSubmit(handleValidSubmit)(event);
  };

  useEffect(() => {
    if (formError) {
      errorRef.current?.focus();
    }
  }, [formError]);

  const submitButtonProps = {
    ...(submitButton.color ? { color: submitButton.color } : {}),
    ...(submitButton.fullWidth !== undefined
      ? { fullWidth: submitButton.fullWidth }
      : {}),
    ...(submitButton.loadingLabel
      ? { loadingLabel: submitButton.loadingLabel }
      : {}),
    ...(submitButton.size ? { size: submitButton.size } : {}),
    ...(submitButton.variant ? { variant: submitButton.variant } : {})
  };

  return (
    <form
      aria-label={ariaLabel}
      className={joinClassNames(styles.form, className)}
      noValidate
      onSubmit={handleSubmit}
    >
      {formError ? (
        <div
          aria-live="assertive"
          className={styles.formError}
          ref={errorRef}
          role="alert"
          tabIndex={-1}
        >
          {formError}
        </div>
      ) : null}

      <div className={joinClassNames(styles.fields, fieldsClassName)}>
        {fields.map((field) =>
          renderField({
            control: methods.control,
            field,
            formDisabled: isBusy
          })
        )}
      </div>

      <div className={joinClassNames(styles.submitBlock, submitBlockClassName)}>
        {beforeSubmit ? (
          <div
            className={joinClassNames(
              styles.beforeSubmit,
              beforeSubmitClassName
            )}
          >
            {beforeSubmit}
          </div>
        ) : null}

        <Button
          isLoading={methods.formState.isSubmitting}
          type="submit"
          {...submitButtonProps}
        >
          {submitButton.label}
        </Button>

        {afterSubmit ? (
          <div
            className={joinClassNames(styles.afterSubmit, afterSubmitClassName)}
          >
            {afterSubmit}
          </div>
        ) : null}
      </div>
    </form>
  );
}
