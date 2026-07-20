import { joinClassNames } from "@shared/lib/joinClassNames";

import styles from "./StatCard.module.scss";
import type { StatCardProps } from "./StatCard.types";

export function StatCard({
  className,
  icon,
  meta,
  title,
  tone = "magenta",
  value,
  ...rest
}: StatCardProps) {
  return (
    <article
      {...rest}
      className={joinClassNames(styles.card, className)}
      data-tone={tone}
    >
      <span aria-hidden="true" className={styles.iconBadge}>
        <span className={styles.icon}>{icon}</span>
      </span>

      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.value}>{value}</p>
        {meta ? <div className={styles.meta}>{meta}</div> : null}
      </div>
    </article>
  );
}
