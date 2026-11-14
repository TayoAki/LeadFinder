import { Platform } from 'react-native';

// Web build is served by the API itself, so same-origin works. Native builds need the full URL
// (set EXPO_PUBLIC_API_URL at build time, e.g. https://<railway-domain>).
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'web' ? '' : 'http://localhost:3200');

export async function api<T>(path: string, body?: unknown, timeoutMs = 8000): Promise<T> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, { method: body ? 'POST' : 'GET', headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, signal: ctl.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status})`);
    return data as T;
  } finally { clearTimeout(t); }
}

export const absolute = (u: string) => (u && u.startsWith('/') ? `${API_URL}${u}` : u);
