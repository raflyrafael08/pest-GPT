const apiOrigin = (process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000').replace(/\/$/, '');
export const API = process.env.NEXT_PUBLIC_API_URL || `${apiOrigin}/api/v1`;

export async function api<T = any>(path: string, options: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `HTTP ${r.status}`);
  }
  return r.headers.get('content-type')?.includes('application/json')
    ? (r.json() as Promise<T>)
    : (r as any);
}
