import styles from "./StatusBadge.module.scss";
import type { StatusBadgeProps } from "./StatusBadge.types";

export function StatusBadge({
  children,
  className,
  tone = "neutral",
  ...props
}: StatusBadgeProps) {
  const badgeClassName = className ? `${styles.badge} ${className}` : styles.badge;

  return (
    <span className={badgeClassName} data-tone={tone} {...props}>
      {children}
    </span>
  );
}
