export const API_BASE_URL =
  import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL ?? "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// FastAPI errors look like {"detail": "..."}; surface that text when present
function errorMessage(text: string, status: number): string {
  try {
    const detail = JSON.parse(text)?.detail;
    if (typeof detail === "string") return detail;
  } catch {
    // Not JSON; fall through to the raw text
  }
  return text || `Request failed: ${status}`;
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  // In dev: call /api/* directly; proxy rewrites and forwards.
  // In prod: strip leading /api and prefix VITE_API_URL.
  const url = import.meta.env.DEV
    ? path
    : `${API_BASE_URL}${path.replace(/^\/api/, "")}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(errorMessage(text, res.status), res.status);
  }
  return res.json() as Promise<T>;
}