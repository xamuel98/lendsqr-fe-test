import styles from "./Sidebar.module.scss";

const skeletonLinkIds = [
  "dashboard",
  "customers",
  "users",
  "guarantors",
  "loans",
  "decision models",
  "savings",
  "loan requests",
  "whitelist",
  "karma",
  "businesses",
  "organizaiton"
];

export function SidebarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={styles.skeleton}
      data-sidebar-loading="true"
    >
      <div className={styles.skeletonTop}>
        <span className={`${styles.skeletonLine} ${styles.skeletonSwitcher}`} />
      </div>
      <div className={styles.skeletonNavigation}>
        {skeletonLinkIds.map((id, index) => (
          <span
            className={
              index === 1 || index === 10
                ? `${styles.skeletonLine} ${styles.skeletonGroupTitle}`
                : `${styles.skeletonLine} ${styles.skeletonLink}`
            }
            key={id}
          />
        ))}
      </div>
      <div className={styles.skeletonFooter}>
        <span className={`${styles.skeletonLine} ${styles.skeletonLink}`} />
        <span className={`${styles.skeletonLine} ${styles.skeletonVersion}`} />
      </div>
    </div>
  );
}
