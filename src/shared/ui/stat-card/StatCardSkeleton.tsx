import { joinClassNames } from "@shared/lib/joinClassNames";

import styles from "./StatCard.module.scss";
import type { StatCardSkeletonProps } from "./StatCard.types";

export function StatCardSkeleton({
  className,
  ...rest
}: StatCardSkeletonProps) {
  return (
    <article
      {...rest}
      aria-hidden="true"
      className={joinClassNames(styles.card, styles.skeletonCard, className)}
      data-loading="true"
    >
      <span className={styles.skeletonBadge} />

      <div className={joinClassNames(styles.content, styles.skeletonContent)}>
        <span className={joinClassNames(styles.skeleton, styles.skeletonTitle)} />
        <span className={joinClassNames(styles.skeleton, styles.skeletonValue)} />
      </div>
    </article>
  );
}
