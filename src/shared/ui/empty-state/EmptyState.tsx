import emptyRecordImage from "@shared/assets/images/empty-record.svg";
import emptySearchImage from "@shared/assets/images/empty-search.svg";
import { IErrorOctagon } from "@shared/assets/icons";
import { joinClassNames } from "@shared/lib/joinClassNames";
import { Button } from "@shared/ui/button";

import styles from "./EmptyState.module.scss";
import type { EmptyStateProps } from "./EmptyState.types";

function getImage(variant: NonNullable<EmptyStateProps["variant"]>) {
  return variant === "search" ? emptySearchImage : emptyRecordImage;
}

export function EmptyState({
  action,
  className,
  isRetrying = false,
  message,
  onRetry,
  variant = "default",
  ...rest
}: EmptyStateProps) {
  const isError = variant === "error";

  return (
    <div
      {...rest}
      aria-live={isError ? "assertive" : "polite"}
      className={joinClassNames(styles.content, className)}
      role={isError ? "alert" : "status"}
    >
      {isError ? (
        <span
          aria-hidden="true"
          className={styles.errorIcon}
          data-empty-state-error-icon="true"
        >
          <IErrorOctagon />
        </span>
      ) : (
        <img alt="" className={styles.image} src={getImage(variant)} />
      )}
      <p className={styles.message}>{message}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
      {isError && onRetry ? (
        <div className={styles.action}>
          <Button
            isLoading={isRetrying}
            loadingLabel="Retrying"
            variant="outline"
            onClick={onRetry}
          >
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
