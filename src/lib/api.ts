/**
 * API configuration helper.
 * If NEXT_PUBLIC_API_URL is set (e.g. https://your-backend.onrender.com),
 * it routes requests to the backend server.
 * Otherwise, it uses the local Next.js relative API routes (/api/...).
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
