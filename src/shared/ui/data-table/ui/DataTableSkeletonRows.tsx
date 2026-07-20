import styles from "./DataTable.module.scss";

interface DataTableSkeletonRowsProps {
  columnCount: number;
  rowCount: number;
}

export function DataTableSkeletonRows({
  columnCount,
  rowCount
}: DataTableSkeletonRowsProps) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <tr
      aria-hidden="true"
      className={styles.loadingRow}
      key={`loading-${rowIndex}`}
    >
      {Array.from({ length: columnCount }, (_, cellIndex) => (
        <td key={`loading-${rowIndex}-${cellIndex}`}>
          <span className={styles.skeleton} />
        </td>
      ))}
    </tr>
  ));
}
