export const API_BASE_URL =
  import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL ?? "");

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
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}