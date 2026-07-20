import { ApiError, isAbortError } from "./apiErrors";

type ApiRequestOptions = {
  headers?: HeadersInit;
  signal?: AbortSignal;
};

function getHttpError(response: Response) {
  if (response.status === 401 || response.status === 403) {
    return new ApiError({
      kind: "authentication",
      message: "Unable to authenticate with the data service.",
      status: response.status
    });
  }

  if (response.status === 404) {
    return new ApiError({
      kind: "not-found",
      message: "The requested data could not be found.",
      status: response.status
    });
  }

  if (response.status === 429) {
    return new ApiError({
      kind: "rate-limit",
      message: "The data service is receiving too many requests. Try again shortly.",
      status: response.status
    });
  }

  return new ApiError({
    kind: "server",
    message: "Unable to load data right now.",
    status: response.status
  });
}

async function get<T>(url: URL, { headers, signal }: ApiRequestOptions = {}) {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  const requestOptions: RequestInit = {
    headers: requestHeaders,
    method: "GET"
  };

  if (signal) {
    requestOptions.signal = signal;
  }

  let response: Response;

  try {
    response = await fetch(url, requestOptions);
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new ApiError({
      kind: "network",
      message: "Unable to reach the data service. Check your connection and retry."
    });
  }

  if (!response.ok) {
    throw getHttpError(response);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError({
      kind: "response",
      message: "The data service returned an invalid response."
    });
  }
}

export const apiClient = { get } as const;
