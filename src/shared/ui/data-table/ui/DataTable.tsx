import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactNode
} from "react";
import { useCallback, useEffect, useRef } from "react";

import { IFilter } from "@shared/assets/icons";
import { joinClassNames } from "@shared/lib/joinClassNames";

import { DataTableEmptyState } from "./DataTableEmptyState";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSkeletonRows } from "./DataTableSkeletonRows";

import styles from "./DataTable.module.scss";
import type { DataTableColumn, DataTableProps } from "../model";

function getCellContent<TRecord>(
  column: DataTableColumn<TRecord>,
  record: TRecord
): ReactNode {
  if (column.cell) {
    return column.cell(record);
  }

  if (!column.accessor) {
    return null;
  }

  const value = record[column.accessor];

  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "string" || typeof value === "number"
    ? value
    : String(value);
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest("a, button, input, select, textarea, label"))
  );
}

export function DataTable<TRecord>({
  activeFilterColumnId = null,
  className,
  columns,
  emptyState = "No records are available.",
  errorState = "We could not load these records.",
  filterPopoverId,
  getRowId,
  hasActiveFilters = false,
  isError = false,
  isFetching = false,
  isLoading = false,
  isRetrying = false,
  loadingRowCount = 10,
  minWidth = "var(--layout-table-min-width)",
  noResultsAction,
  noResultsState = "No records match the current filters.",
  onFilterColumnChange,
  onRowClick,
  onRetry,
  pagination,
  records,
  renderRowActions,
  selectedRowId = null,
  tableLabel = "Data table"
}: DataTableProps<TRecord>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const totalColumnCount = columns.length + (renderRowActions ? 1 : 0);
  const emptyStateColumnIds = [
    ...columns.map((column) => column.id),
    ...(renderRowActions ? ["row-actions"] : [])
  ];
  const tableStyle = {
    "--data-table-min-width": minWidth
  } as CSSProperties;

  function handleRowClick(
    record: TRecord,
    event: MouseEvent<HTMLTableRowElement>
  ) {
    if (onRowClick && !isInteractiveTarget(event.target)) {
      onRowClick(record);
    }
  }

  function handleRowKeyDown(
    record: TRecord,
    event: KeyboardEvent<HTMLTableRowElement>
  ) {
    if (onRowClick && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onRowClick(record);
    }
  }

  const syncViewportState = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.style.setProperty(
      "--data-table-scroll-left",
      `${viewport.scrollLeft}px`
    );
    viewport.style.setProperty(
      "--data-table-viewport-width",
      `${viewport.clientWidth}px`
    );
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    syncViewportState();

    const ResizeObserverConstructor = (
      globalThis as unknown as {
        ResizeObserver?: typeof ResizeObserver;
      }
    ).ResizeObserver;
    const resizeObserver = ResizeObserverConstructor
      ? new ResizeObserverConstructor(syncViewportState)
      : undefined;

    if (resizeObserver) {
      resizeObserver.observe(viewport);
    }

    window.addEventListener("resize", syncViewportState);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncViewportState);
    };
  }, [syncViewportState]);

  return (
    <section className={joinClassNames(styles.section, className)}>
      <div
        aria-busy={isLoading || isFetching || undefined}
        aria-label={`${tableLabel}. Scroll horizontally to view all columns.`}
        className={styles.viewport}
        ref={viewportRef}
        tabIndex={0}
        onScroll={syncViewportState}
      >
        <table className={styles.table} style={tableStyle}>
          {!isError ? (
            <thead>
              <tr>
                {columns.map((column) => {
                  const isActive = activeFilterColumnId === column.id;
                  const columnStyle = {
                    minWidth: column.minWidth,
                    width: column.width
                  };

                  return (
                    <th
                      data-align={column.align ?? "left"}
                      key={column.id}
                      scope="col"
                      style={columnStyle}
                    >
                      {column.isFilterable ? (
                        <button
                          aria-controls={isActive ? filterPopoverId : undefined}
                          aria-expanded={isActive}
                          aria-haspopup="dialog"
                          aria-label={`Filter by ${column.filterLabel ?? "this column"}`}
                          className={styles.headerButton}
                          data-active={isActive}
                          type="button"
                          onClick={(event) => {
                            onFilterColumnChange?.(
                              isActive ? null : column.id,
                              event.currentTarget,
                              event.detail === 0 ? "instant" : "default"
                            );
                          }}
                        >
                          <span>{column.header}</span>
                          <IFilter
                            aria-hidden="true"
                            className={styles.filterIcon}
                          />
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                })}

                {renderRowActions ? (
                  <th className={styles.actionsHeader} scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                ) : null}
              </tr>
            </thead>
          ) : null}

          <tbody>
            {isLoading ? (
              <DataTableSkeletonRows
                columnCount={totalColumnCount}
                rowCount={loadingRowCount}
              />
            ) : records.length > 0 ? (
              records.map((record) => {
                const rowId = getRowId(record);
                const isSelectable = Boolean(onRowClick);

                return (
                  <tr
                    aria-selected={selectedRowId === rowId || undefined}
                    className={styles.row}
                    data-clickable={isSelectable}
                    data-selected={selectedRowId === rowId}
                    key={rowId}
                    role={isSelectable ? "button" : undefined}
                    tabIndex={isSelectable ? 0 : undefined}
                    onClick={(event) => {
                      handleRowClick(record, event);
                    }}
                    onKeyDown={(event) => {
                      handleRowKeyDown(record, event);
                    }}
                  >
                    {columns.map((column) => (
                      <td data-align={column.align ?? "left"} key={column.id}>
                        {getCellContent(column, record)}
                      </td>
                    ))}

                    {renderRowActions ? (
                      <td className={styles.actionsCell}>
                        {renderRowActions(record)}
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <DataTableEmptyState
                columnIds={emptyStateColumnIds}
                columnCount={totalColumnCount}
                emptyState={emptyState}
                errorState={errorState}
                hasActiveFilters={hasActiveFilters}
                isError={isError}
                isRetrying={isRetrying}
                noResultsAction={noResultsAction}
                noResultsState={noResultsState}
                {...(onRetry ? { onRetry } : {})}
              />
            )}
          </tbody>
        </table>
      </div>

      {pagination && records.length > 0 ? (
        <DataTablePagination {...pagination} />
      ) : null}
    </section>
  );
}
