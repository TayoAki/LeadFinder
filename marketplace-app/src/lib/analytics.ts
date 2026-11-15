// Shelby analytics: one tiny client for every platform. Events are queued and sent in batches
// to our own server (/api/events), which stores them and forwards them to Umami and PostHog.
// No PII: never pass emails, names, addresses or free text a person typed about themselves.
import { Dimensions, Platform } from 'react-native';
import { API_URL } from './api';

type Props = Record<string, string | number | boolean | null | undefined>;
type Event = { name: string; props: Props; ts: number; anon: string; session: string; platform: string; path: string; source: 'app'; title?: string; referrer?: string; screen?: string; language?: string };

const rid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const web = Platform.OS === 'web' && typeof window !== 'undefined';
const store = {
  get: (k: string) => { try { return web ? window.localStorage.getItem(k) : null; } catch { return null; } },
  set: (k: string, v: string) => { try { if (web) window.localStorage.setItem(k, v); } catch {} },
};

// Anonymous id: kept in localStorage on web; per launch on native until a storage module is added.
const anon = store.get('shelby_anon') ?? rid();
store.set('shelby_anon', anon);

// A session ends after 30 minutes without activity.
let session = store.get('shelby_session') ?? '';
let lastAt = Number(store.get('shelby_session_at') ?? 0);
const touch = () => {
  const now = Date.now();
  if (!session || now - lastAt > 30 * 60 * 1000) session = rid();
  lastAt = now; store.set('shelby_session', session); store.set('shelby_session_at', String(now));
};

// First-touch attribution: how this shopper first arrived. Attached to every event so any funnel
// can be broken down by campaign or referral, whatever its first step is.
type Attribution = { utm_source?: string; utm_campaign?: string; ref?: string };
let attribution: Attribution = (() => { try { return JSON.parse(store.get('shelby_attr') ?? '{}'); } catch { return {}; } })();
export function setAttribution(a: Attribution) {
  const clean = Object.fromEntries(Object.entries(a).filter(([, v]) => typeof v === 'string' && v)) as Attribution;
  if (!Object.keys(clean).length || Object.keys(attribution).length) return; // first touch wins
  attribution = clean; store.set('shelby_attr', JSON.stringify(clean));
}

// Extra props attached to every event (experiment assignments register here).
let globalProps: () => Props = () => ({});
export const setGlobalProps = (fn: () => Props) => { globalProps = fn; };

let path = '/';
let queue: Event[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
const firstReferrer = web ? document.referrer : '';
let referrerUsed = false;

export const ids = () => ({ anon, session, platform: Platform.OS });

function send(events: Event[], beacon = false) {
  const body = JSON.stringify({ events });
  const url = `${API_URL}/api/events`;
  if (beacon && web && navigator.sendBeacon) { navigator.sendBeacon(url, new Blob([body], { type: 'application/json' })); return; }
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {
    queue = [...events, ...queue].slice(0, 200); // retry with the next flush
  });
}

export function flush(beacon = false) {
  if (timer) { clearTimeout(timer); timer = null; }
  if (!queue.length) return;
  const batch = queue.splice(0, 50);
  send(batch, beacon);
  if (queue.length) flush(beacon);
}

export function track(name: string, props: Props = {}) {
  touch();
  const { width, height } = Dimensions.get('window');
  const e: Event = {
    name, props: Object.fromEntries(Object.entries({ ...attribution, ...globalProps(), ...props }).filter(([, v]) => v !== undefined && v !== null)) as Props,
    ts: Date.now(), anon, session, platform: Platform.OS, path, source: 'app',
    screen: `${Math.round(width)}x${Math.round(height)}`, language: web ? navigator.language : undefined,
    title: web ? document.title : undefined,
  };
  if (!referrerUsed && firstReferrer) { e.referrer = firstReferrer; referrerUsed = true; }
  queue.push(e);
  if (__DEV__) console.log('[track]', name, e.props);
  if (queue.length >= 20) flush(); else if (!timer) timer = setTimeout(() => flush(), 4000);
}

export function screen(pathname: string, params: Props = {}) {
  path = pathname;
  track('screen_view', params);
}

// Send what's queued when the tab is hidden or closed.
if (web) {
  window.addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });
}
