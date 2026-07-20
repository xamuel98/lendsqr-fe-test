import type { CSSProperties, ReactNode } from "react";

export type DataTableRowId = string | number;
export type DataTableAlignment = "left" | "center" | "right";
export type DataTablePopoverMotionMode = "default" | "instant";

export interface DataTableColumn<TRecord> {
  id: string;
  header: ReactNode;
  accessor?: keyof TRecord;
  cell?: (record: TRecord) => ReactNode;
  width?: CSSProperties["width"];
  minWidth?: CSSProperties["minWidth"];
  align?: DataTableAlignment;
  isFilterable?: boolean;
  filterLabel?: string;
  getCellLabel?: (record: TRecord) => string;
}

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isDisabled?: boolean;
}

export interface DataTableProps<TRecord> {
  records: TRecord[];
  columns: DataTableColumn<TRecord>[];
  getRowId: (record: TRecord) => DataTableRowId;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  emptyState?: ReactNode;
  noResultsState?: ReactNode;
  noResultsAction?: ReactNode;
  errorState?: ReactNode;
  onRetry?: () => void;
  isRetrying?: boolean;
  loadingRowCount?: number;
  hasActiveFilters?: boolean;
  activeFilterColumnId?: string | null;
  filterPopoverId?: string;
  onFilterColumnChange?: (
    columnId: string | null,
    triggerElement?: HTMLElement,
    motionMode?: DataTablePopoverMotionMode
  ) => void;
  renderRowActions?: (record: TRecord) => ReactNode;
  onRowClick?: (record: TRecord) => void;
  selectedRowId?: DataTableRowId | null;
  pagination?: DataTablePaginationProps;
  minWidth?: CSSProperties["minWidth"];
  className?: string;
  tableLabel?: string;
}
