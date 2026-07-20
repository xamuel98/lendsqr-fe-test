import { getUserStatIcon } from "@pages/users/lib/userStatIcons";
import { getUserStatCardMetadata } from "@pages/users/model";
import { useFetchUserStats } from "@features/user";
import { formatNumber } from "@shared/lib/formatters";
import { EmptyState } from "@shared/ui/empty-state";
import { StatCard, StatCardSkeleton } from "@shared/ui/stat-card";
import { UsersTable } from "@widgets/users-table";

import styles from "./ListUserTable.module.scss";

const statSkeletonIds = [
  "users-stat-skeleton",
  "active-users-stat-skeleton",
  "users-with-loans-stat-skeleton",
  "users-with-savings-stat-skeleton"
] as const;

export function ListUserTable() {
  const {
    data: userStats,
    error,
    isError,
    isLoading,
    isRefetching,
    refetch
  } = useFetchUserStats();

  return (
    <section aria-labelledby="users-title" className={styles.page}>
      <h1 className={styles.title} id="users-title">
        Users
      </h1>

      {isLoading ? (
        <p aria-live="polite" className="visually-hidden" role="status">
          Loading user statistics...
        </p>
      ) : null}

      {isLoading ? (
        <div
          aria-busy="true"
          aria-label="Loading user statistics"
          className={styles.statsGrid}
        >
          {statSkeletonIds.map((id) => (
            <StatCardSkeleton key={id} />
          ))}
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          className={styles.statsState}
          isRetrying={isRefetching}
          message={error.message}
          variant="error"
          onRetry={() => {
            void refetch();
          }}
        />
      ) : null}

      {userStats && userStats.length > 0 ? (
        <div aria-label="User statistics" className={styles.statsGrid}>
          {userStats.map((stat) => {
            const metadata = getUserStatCardMetadata(stat.id);

            return (
              <StatCard
                key={stat.id}
                icon={getUserStatIcon(metadata.icon)}
                title={stat.title}
                tone={metadata.tone}
                value={formatNumber(stat.value)}
              />
            );
          })}
        </div>
      ) : null}

      {userStats && userStats.length === 0 ? (
        <EmptyState
          className={styles.statsState}
          message="No user statistics are available."
        />
      ) : null}

      <UsersTable />
    </section>
  );
}
