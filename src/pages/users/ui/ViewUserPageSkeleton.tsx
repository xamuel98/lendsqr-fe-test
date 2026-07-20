import { Link } from "react-router-dom";

import { IBack } from "@shared/assets/icons";

import styles from "./ViewUserPage.module.scss";

const summaryLineIds = ["summary-name", "summary-code", "summary-tier", "summary-bank"] as const;
const tabIds = ["general", "documents", "bank", "loans", "savings", "system"] as const;
const detailSectionFieldCounts = [8, 7, 4] as const;

function SkeletonLine({ className }: { className: string | undefined }) {
  return <span aria-hidden="true" className={`${styles.skeleton} ${className ?? ""}`} />;
}

export function ViewUserPageSkeleton({ usersListPath }: { usersListPath: string }) {
  return (
    <section aria-labelledby="user-details-title" className={styles.page}>
      <div className={styles.headingArea}>
        <div className={styles.headingCopy}>
          <Link className={styles.backLink} to={usersListPath}>
            <IBack />
            Back to Users
          </Link>
          <h1 className={styles.pageTitle} id="user-details-title">
            User Details
          </h1>
        </div>
        <SkeletonLine className={styles.skeletonAction} />
      </div>

      <p aria-live="polite" className="visually-hidden" role="status">
        Loading user details...
      </p>

      <div aria-hidden="true" data-view-user-skeleton="true">
        <section className={`${styles.summaryCard} ${styles.skeletonSummaryCard}`}>
          <div className={styles.summaryContent}>
            <div className={styles.identity}>
              <span className={styles.skeletonAvatar} />
              <div className={styles.skeletonIdentityCopy}>
                {summaryLineIds.slice(0, 2).map((id) => (
                  <SkeletonLine className={styles.skeletonLine} key={id} />
                ))}
              </div>
            </div>

            <div className={`${styles.summaryMetric} ${styles.skeletonMetric}`}>
              {summaryLineIds.slice(2, 3).map((id) => (
                <SkeletonLine className={styles.skeletonLine} key={id} />
              ))}
              <SkeletonLine className={styles.skeletonStars} />
            </div>

            <div className={`${styles.summaryMetric} ${styles.skeletonMetric}`}>
              {summaryLineIds.slice(3).map((id) => (
                <SkeletonLine className={styles.skeletonLine} key={id} />
              ))}
              <SkeletonLine className={styles.skeletonShortLine} />
            </div>
          </div>

          <div className={styles.tabScroller}>
            <div className={styles.tabs}>
              {tabIds.map((id) => (
                <SkeletonLine className={styles.skeletonTab} key={id} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.detailsCard}>
          {detailSectionFieldCounts.map((fieldCount, sectionIndex) => (
            <section className={styles.detailSection} key={fieldCount}>
              <SkeletonLine className={styles.skeletonSectionTitle} />
              <div className={styles.fieldGrid}>
                {Array.from({ length: fieldCount }, (_, fieldIndex) => (
                  <div className={styles.skeletonField} key={`field-${sectionIndex}-${fieldIndex}`}>
                    <SkeletonLine className={styles.skeletonLabel} />
                    <SkeletonLine className={styles.skeletonValue} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </section>
      </div>
    </section>
  );
}
