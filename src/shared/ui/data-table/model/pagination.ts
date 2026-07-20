export type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

export function getTotalPages(totalRecords: number, pageSize: number) {
  if (pageSize <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(totalRecords / pageSize));
}

export function getPageRange(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const page = Math.min(Math.max(currentPage, 1), totalPages);

  if (page <= 3) {
    return [1, 2, 3, "ellipsis-end", totalPages - 1, totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, 2, "ellipsis-start", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    2,
    "ellipsis-start",
    page - 1,
    page,
    page + 1,
    "ellipsis-end",
    totalPages - 1,
    totalPages
  ];
}
