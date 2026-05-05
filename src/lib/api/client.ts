export type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: unknown;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  status: number;
  payload?: ApiEnvelope<unknown> | string | null;

  constructor(
    message: string,
    status: number,
    payload?: ApiEnvelope<unknown> | string | null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const buildUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const buildHeaders = (options: RequestInit) => {
  const headers = new Headers(options.headers || {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiSuccess<T>> => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: buildHeaders(options),
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String(payload.message)
        : response.statusText;
    throw new ApiError(message, response.status, payload);
  }

  if (typeof payload === "object" && payload && "success" in payload) {
    if (payload.success === false) {
      const message = payload.message || "So'rovda xatolik";
      throw new ApiError(message, response.status, payload);
    }

    return payload as ApiSuccess<T>;
  }

  return {
    success: true,
    data: payload as T,
  };
};
