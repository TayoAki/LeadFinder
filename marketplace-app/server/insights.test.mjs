// Tests for the insights module, through its public interface only, against a real in-memory
// SQLite database with the production events schema. Expected numbers are worked out by hand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { EVENTS_SCHEMA } from './analytics.mjs';
import { dropoffs, funnel, people, retention, timeline } from './insights.mjs';

const T0 = Date.UTC(2026, 10, 2, 9, 0); // Mon 2 Nov 2026, 09:00 UTC
const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;

function makeDb() {
  const db = new DatabaseSync(':memory:');
  db.exec(EVENTS_SCHEMA);
  const ins = db.prepare('INSERT INTO events (ts, name, anon, session, source, platform, path, props) VALUES (?,?,?,?,?,?,?,?)');
  const add = (anon, name, at, { session = `${anon}-1`, source = 'app', platform = 'web', path = '/', props = {} } = {}) =>
    ins.run(T0 + at, name, anon, session, source, platform, path, JSON.stringify(props));
  return { db, add };
}
const range = { from: T0 - DAY, to: T0 + 60 * DAY };
const SHOP = ['product_view', 'add_to_cart', 'order_placed'];

test('funnel counts shoppers who did the steps in order', () => {
  const { db, add } = makeDb();
  add('ann', 'product_view', 0); add('ann', 'add_to_cart', 5 * MIN); add('ann', 'order_placed', 9 * MIN);
  add('bob', 'product_view', 0); add('bob', 'add_to_cart', 2 * MIN);
  add('cat', 'product_view', 0);
  // dan bought before ever viewing a product: only his view counts
  add('dan', 'order_placed', 0); add('dan', 'product_view', 3 * MIN);
  const r = funnel(db, { ...range, steps: SHOP, windowMs: DAY });
  assert.deepEqual(r.steps.map(s => s.people), [4, 2, 1]);
  assert.deepEqual(r.steps.map(s => s.dropped), [0, 2, 1]);
  assert.deepEqual(r.steps.map(s => s.fromPrev), [1, 0.5, 0.5]);
  assert.deepEqual(r.steps.map(s => s.fromStart), [1, 0.5, 0.25]);
});

test('funnel steps must happen within the conversion window of step 1, using the best attempt', () => {
  const { db, add } = makeDb();
  // eve: first view expires, a later view converts within a day
  add('eve', 'product_view', 0); add('eve', 'product_view', 8 * DAY); add('eve', 'add_to_cart', 8 * DAY + 10 * MIN);
  // fay: adds to cart three days after her only view
  add('fay', 'product_view', 0); add('fay', 'add_to_cart', 3 * DAY);
  const day = funnel(db, { ...range, steps: SHOP, windowMs: DAY });
  assert.deepEqual(day.steps.map(s => s.people), [2, 1, 0]);
  const week = funnel(db, { ...range, steps: SHOP, windowMs: 7 * DAY });
  assert.deepEqual(week.steps.map(s => s.people), [2, 2, 0]);
});

test('funnel reports the median time from the previous step', () => {
  const { db, add } = makeDb();
  add('a', 'product_view', 0); add('a', 'add_to_cart', 2 * MIN); add('a', 'order_placed', 12 * MIN);
  add('b', 'product_view', 0); add('b', 'add_to_cart', 4 * MIN);
  add('c', 'product_view', 0); add('c', 'add_to_cart', 30 * MIN); add('c', 'order_placed', 60 * MIN);
  const r = funnel(db, { ...range, steps: SHOP, windowMs: DAY });
  assert.deepEqual(r.steps.map(s => s.medianMsFromPrev), [null, 4 * MIN, 20 * MIN]);
});

test('funnel ignores seller-dashboard events and events without a shopper id', () => {
  const { db, add } = makeDb();
  add('s1', 'product_view', 0, { source: 'seller' });
  add('', 'product_view', 0);
  add('g', 'product_view', 0);
  const r = funnel(db, { ...range, steps: SHOP, windowMs: DAY });
  assert.equal(r.steps[0].people, 1);
});

test('funnel breaks down by platform and by a property of the step-1 event', () => {
  const { db, add } = makeDb();
  add('w1', 'app_open', 0, { props: { utm_source: 'tiktok' } }); add('w1', 'add_to_cart', MIN);
  add('w2', 'app_open', 0, { props: { utm_source: 'tiktok' } });
  add('i1', 'app_open', 0, { platform: 'ios' }); add('i1', 'add_to_cart', MIN);
  const steps = ['app_open', 'add_to_cart'];
  const byPlatform = funnel(db, { ...range, steps, windowMs: DAY, breakdown: 'platform' });
  assert.deepEqual(byPlatform.breakdown.map(b => [b.key, b.steps.map(s => s.people)]), [['web', [2, 1]], ['ios', [1, 1]]]);
  const bySource = funnel(db, { ...range, steps, windowMs: DAY, breakdown: 'utm_source' });
  assert.deepEqual(bySource.breakdown.map(b => [b.key, b.steps.map(s => s.people)]), [['tiktok', [2, 1]], ['(none)', [1, 1]]]);
});

test('dropoffs lists shoppers who reached the previous step but not this one', () => {
  const { db, add } = makeDb();
  add('ann', 'product_view', 0); add('ann', 'add_to_cart', MIN); add('ann', 'order_placed', 2 * MIN);
  add('bob', 'product_view', 0); add('bob', 'add_to_cart', MIN);
  add('cat', 'product_view', 0); add('cat', 'add_to_cart', MIN);
  add('dan', 'product_view', 0);
  assert.deepEqual(dropoffs(db, { ...range, steps: SHOP, windowMs: DAY }, 2).sort(), ['bob', 'cat']);
  assert.deepEqual(dropoffs(db, { ...range, steps: SHOP, windowMs: DAY }, 1), ['dan']);
});

test('retention groups shoppers by first-seen day and counts who came back each later day', () => {
  const { db, add } = makeDb();
  add('zed', 'app_open', -10 * DAY); add('zed', 'app_open', 0); // first seen before the range: no cohort
  add('ann', 'app_open', 0); add('ann', 'order_placed', DAY + HOUR);
  add('bob', 'app_open', 0); add('bob', 'search', 2 * DAY);
  add('cat', 'app_open', HOUR);
  add('dan', 'app_open', DAY); add('dan', 'app_open', 2 * DAY + HOUR);
  const opts = { from: T0, to: T0 + 30 * DAY, period: 'day', periods: 3 };
  assert.deepEqual(retention(db, opts).cohorts, [
    { start: '2026-11-02', size: 3, values: [3, 1, 1] },
    { start: '2026-11-03', size: 1, values: [1, 1, 0] },
  ]);
  assert.deepEqual(retention(db, { ...opts, returnEvent: 'order_placed' }).cohorts.map(c => c.values), [[3, 1, 0], [1, 0, 0]]);
});

test('weekly retention uses Monday-start weeks and leaves future periods empty', () => {
  const { db, add } = makeDb();
  add('ann', 'app_open', 0); add('ann', 'app_open', 9 * DAY); // Mon 2 Nov, then Wed 11 Nov (week 1)
  add('bob', 'app_open', 6 * DAY); // Sun 8 Nov: still the week of 2 Nov
  const r = retention(db, { from: T0, to: T0 + 10 * DAY, period: 'week', periods: 3 });
  assert.deepEqual(r.cohorts, [{ start: '2026-11-02', size: 2, values: [2, 1, null] }]);
});

// ann: two sessions, one confirmed order of $42.50 (client + server events for the same order)
function shoppers() {
  const t = makeDb(), { add } = t;
  add('ann', 'app_open', 0, { path: '/' });
  add('ann', 'product_view', MIN, { path: '/product/2', props: { product_id: '2' } });
  add('ann', 'app_open', DAY, { session: 'ann-2', platform: 'ios', path: '/' });
  add('ann', 'order_placed', DAY + 5 * MIN, { session: 'ann-2', platform: 'ios', path: '/checkout', props: { order_id: 'o1', total: 42.5 } });
  add('ann', 'order_confirmed', DAY + 5 * MIN, { session: 'ann-2', platform: 'ios', path: '/checkout', props: { order_id: 'o1', total: 42.5 } });
  // bob: no confirmation reached the server, so his client-side order counts
  add('bob', 'app_open', 2 * DAY, { path: '/' });
  add('bob', 'order_placed', 2 * DAY + MIN, { path: '/checkout', props: { order_id: 'o9', total: 10 } });
  add('cat', 'app_open', 3 * HOUR, { path: '/search' });
  add('sel', 'screen_view', 4 * DAY, { source: 'seller' });
  return t;
}

test('people lists shoppers, most recently seen first, with sessions, orders and spend', () => {
  const { db } = shoppers();
  assert.deepEqual(people(db, { ...range, limit: 10 }), [
    { anon: 'bob', firstSeen: T0 + 2 * DAY, lastSeen: T0 + 2 * DAY + MIN, sessions: 1, events: 2, orders: 1, spend: 10, platform: 'web', lastPath: '/checkout' },
    { anon: 'ann', firstSeen: T0, lastSeen: T0 + DAY + 5 * MIN, sessions: 2, events: 5, orders: 1, spend: 42.5, platform: 'ios', lastPath: '/checkout' },
    { anon: 'cat', firstSeen: T0 + 3 * HOUR, lastSeen: T0 + 3 * HOUR, sessions: 1, events: 1, orders: 0, spend: 0, platform: 'web', lastPath: '/search' },
  ]);
});

test('people can be filtered to shoppers who did an event', () => {
  const { db } = shoppers();
  assert.deepEqual(people(db, { ...range, did: 'product_view', limit: 10 }).map(p => p.anon), ['ann']);
});

test('timeline returns one shopper\'s sessions, newest first, events in order', () => {
  const { db } = shoppers();
  const t = timeline(db, 'ann');
  assert.equal(t.summary.orders, 1);
  assert.equal(t.summary.spend, 42.5);
  assert.deepEqual(t.sessions.map(s => [s.id, s.start, s.end, s.events.map(e => e.name)]), [
    ['ann-2', T0 + DAY, T0 + DAY + 5 * MIN, ['app_open', 'order_placed', 'order_confirmed']],
    ['ann-1', T0, T0 + MIN, ['app_open', 'product_view']],
  ]);
  assert.deepEqual(t.sessions[1].events[1], { ts: T0 + MIN, name: 'product_view', path: '/product/2', platform: 'web', props: { product_id: '2' } });
  assert.equal(timeline(db, 'nobody'), null);
});

test('funnel credits the earliest attempt when two attempts reach the same step', () => {
  const { db, add } = makeDb();
  add('ann', 'product_view', 0); add('ann', 'add_to_cart', 10 * MIN);
  add('ann', 'product_view', DAY); add('ann', 'add_to_cart', DAY + MIN);
  const r = funnel(db, { ...range, steps: SHOP, windowMs: DAY / 2 });
  assert.equal(r.steps[1].medianMsFromPrev, 10 * MIN);
});

test('funnel lets an attempt that starts inside the range finish after it, within the window', () => {
  const { db, add } = makeDb();
  add('ann', 'product_view', 0); add('ann', 'add_to_cart', 2 * HOUR);
  const r = funnel(db, { from: T0 - DAY, to: T0 + HOUR, steps: SHOP, windowMs: DAY });
  assert.deepEqual(r.steps.map(s => s.people), [1, 1, 0]);
});

test('people can be filtered to shoppers who did one event but not another (abandoned checkout)', () => {
  const { db, add } = makeDb();
  add('ann', 'checkout_start', 0); add('ann', 'order_placed', MIN);
  add('bob', 'checkout_start', 0);
  add('sel', 'checkout_start', 0, { source: 'seller' });
  assert.deepEqual(people(db, { ...range, did: 'checkout_start', didNot: 'order_placed' }).map(p => p.anon), ['bob']);
});

test('spend counts each order once: confirmed by the server, or client-side when unconfirmed', () => {
  const { db, add } = makeDb();
  add('ann', 'order_placed', 0, { props: { order_id: 'o1', total: 20 } });
  add('ann', 'order_confirmed', 0, { props: { order_id: 'o1', total: 20 } });
  add('ann', 'order_placed', DAY, { props: { order_id: 'o2', total: 5.5 } });
  const [p] = people(db, range);
  assert.deepEqual([p.orders, p.spend], [2, 25.5]);
});
