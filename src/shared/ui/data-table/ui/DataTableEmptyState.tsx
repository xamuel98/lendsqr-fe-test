import type { CSSProperties, ReactNode } from "react";

import { EmptyState } from "@shared/ui/empty-state";

import styles from "./DataTable.module.scss";

const emptyStateRowIds = [
  "empty-state-row-1",
  "empty-state-row-2",
  "empty-state-row-3",
  "empty-state-row-4",
  "empty-state-row-5",
  "empty-state-row-6",
  "empty-state-row-7",
  "empty-state-row-8",
  "empty-state-row-9",
  "empty-state-row-10"
] as const;

interface DataTableEmptyStateProps {
  columnIds: readonly string[];
  columnCount: number;
  emptyState: ReactNode;
  errorState: ReactNode;
  hasActiveFilters: boolean;
  isError: boolean;
  isRetrying?: boolean;
  noResultsAction?: ReactNode;
  noResultsState: ReactNode;
  onRetry?: () => void;
}

function getEmptyStateContent({
  emptyState,
  errorState,
  hasActiveFilters,
  isError,
  noResultsState
}: Omit<
  DataTableEmptyStateProps,
  "columnCount" | "columnIds" | "isRetrying" | "noResultsAction" | "onRetry"
>) {
  if (isError) {
    return { message: errorState, variant: "error" as const };
  }

  if (hasActiveFilters) {
    return { message: noResultsState, variant: "search" as const };
  }

  return { message: emptyState, variant: "default" as const };
}

export function DataTableEmptyState({
  columnIds,
  columnCount,
  emptyState,
  errorState,
  hasActiveFilters,
  isError,
  isRetrying = false,
  noResultsAction,
  noResultsState,
  onRetry
}: DataTableEmptyStateProps) {
  const stateContent = getEmptyStateContent({
    emptyState,
    errorState,
    hasActiveFilters,
    isError,
    noResultsState
  });
  const action = hasActiveFilters && !isError ? noResultsAction : undefined;
  const skeletonRowStyle = {
    "--data-table-empty-column-count": columnIds.length
  } as CSSProperties;

  return (
    <tr>
      <td className={styles.stateCell} colSpan={columnCount}>
        <div className={styles.statePresentation}>
          <div aria-hidden="true" className={styles.stateSkeletonRows}>
            {emptyStateRowIds.map((rowId) => (
              <div
                className={styles.stateSkeletonRow}
                data-empty-state-skeleton-row="true"
                key={rowId}
                style={skeletonRowStyle}
              >
                {columnIds.map((columnId) => (
                  <span className={styles.stateSkeletonBar} key={columnId} />
                ))}
              </div>
            ))}
          </div>

          <div className={styles.stateOverlay}>
            <EmptyState
              isRetrying={isRetrying}
              message={stateContent.message}
              variant={stateContent.variant}
              {...(action ? { action } : {})}
              {...(onRetry ? { onRetry } : {})}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}
