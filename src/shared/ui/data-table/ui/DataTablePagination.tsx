import { IChevronDown, IChevronLeft, IChevronRight } from "@shared/assets/icons";

import { getPageRange, getTotalPages } from "../model";
import styles from "./DataTablePagination.module.scss";
import type { DataTablePaginationProps } from "../model";

const defaultPageSizeOptions = [10, 25, 50, 100];

export function DataTablePagination({
  isDisabled = false,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  pageSizeOptions = defaultPageSizeOptions,
  totalRecords
}: DataTablePaginationProps) {
  const totalPages = getTotalPages(totalRecords, pageSize);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageRange = getPageRange(currentPage, totalPages);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav aria-label="Table pagination" className={styles.pagination}>
      <div className={styles.summary}>
        <span>Showing</span>
        <span className={styles.selectWrap}>
          <label className="visually-hidden" htmlFor="data-table-page-size">
            Records per page
          </label>
          <select
            aria-label="Records per page"
            className={styles.pageSizeSelect}
            disabled={isDisabled}
            id="data-table-page-size"
            value={pageSize}
            onChange={(event) => {
              onPageSizeChange(Number(event.target.value));
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <IChevronDown aria-hidden="true" className={styles.selectIcon} />
        </span>
        <span>out of {totalRecords}</span>
      </div>

      <div className={styles.controls}>
        <button
          aria-label="Go to previous page"
          className={styles.arrowButton}
          disabled={isDisabled || !hasPreviousPage}
          type="button"
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
        >
          <IChevronLeft aria-hidden="true" className={styles.arrowIcon} />
        </button>

        {pageRange.map((item) => {
          if (typeof item !== "number") {
            return (
              <span aria-hidden="true" className={styles.ellipsis} key={item}>
                ...
              </span>
            );
          }

          return (
            <button
              aria-current={item === currentPage ? "page" : undefined}
              className={styles.pageButton}
              data-current={item === currentPage}
              data-edge={item === 1 || item === totalPages}
              disabled={isDisabled}
              key={item}
              type="button"
              onClick={() => {
                onPageChange(item);
              }}
            >
              {item}
            </button>
          );
        })}

        <button
          aria-label="Go to next page"
          className={styles.arrowButton}
          disabled={isDisabled || !hasNextPage}
          type="button"
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
        >
          <IChevronRight aria-hidden="true" className={styles.arrowIcon} />
        </button>
      </div>
    </nav>
  );
}
