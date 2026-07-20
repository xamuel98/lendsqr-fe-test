import styles from "./FormField.module.scss";

type FieldLabelProps = {
  hidden?: boolean | undefined;
  htmlFor: string;
  label: string;
  weight?: "regular" | "medium" | undefined;
  required?: boolean | undefined;
};

export function FieldLabel({
  hidden = false,
  htmlFor,
  label,
  weight = "regular",
  required = false
}: FieldLabelProps) {
  return (
    <label
      className={hidden ? `${styles.label} ${styles.labelHidden}` : styles.label}
      data-weight={weight}
      htmlFor={htmlFor}
    >
      <span>{label}</span>
      {required ? (
        <span aria-hidden="true" className={styles.requiredMark}>
          *
        </span>
      ) : null}
    </label>
  );
}
