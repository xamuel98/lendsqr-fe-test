import styles from "./FormField.module.scss";

type FieldMessageProps = {
  errorId: string;
  errorMessage?: string | undefined;
  helperId: string;
  helperText?: string | undefined;
};

export function FieldMessage({
  errorId,
  errorMessage,
  helperId,
  helperText
}: FieldMessageProps) {
  return (
    <div className={styles.messageStack}>
      {errorMessage ? (
        <p className={styles.errorMessage} id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}

      {helperText && !errorMessage ? (
        <p className={styles.helperText} id={helperId}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
