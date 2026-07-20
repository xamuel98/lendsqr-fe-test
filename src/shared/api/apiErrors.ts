export type ApiErrorKind =
  | "authentication"
  | "not-found"
  | "rate-limit"
  | "network"
  | "response"
  | "server";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;

  constructor({
    kind,
    message,
    status
  }: {
    kind: ApiErrorKind;
    message: string;
    status?: number;
  }) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

export function isAbortError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}
