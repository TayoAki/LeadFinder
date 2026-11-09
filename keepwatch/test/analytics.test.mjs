import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enrich, survival } from '../lib/analytics.mjs';
import { extractHook, angleFor, normaliseAd } from '../lib/classify.mjs';

const T = '2026-11-08';
const ad = (start, end, active) => enrich({ start_date: start, end_date: end, is_active: active ? 1 : 0, format: 'video', angle: 'other' }, T);

test('piles follow the 30-day line', () => {
  assert.equal(ad('2026-09-01', T, true).pile, 'kept');
  assert.equal(ad('2026-10-25', T, true).pile, 'testing');
  assert.equal(ad('2026-10-01', '2026-10-10', false).pile, 'killed');
  assert.equal(ad('2026-06-01', '2026-09-01', false).pile, 'retired');
});

test('run days use today for live ads and the end date for stopped ones', () => {
  assert.equal(ad('2026-11-01', '2026-11-08', true).run_days, 7);
  assert.equal(ad('2026-10-01', '2026-10-11', false).run_days, 10);
  assert.equal(enrich({ start_date: null, is_active: 1 }, T).pile, null, 'no start date: left out');
});

test('Kaplan-Meier treats live ads as censored, not as deaths', () => {
  // 2 ads stopped at day 10, 2 still live at day 100: half survive past day 10 and stay there.
  const ads = [ad('2026-01-01', '2026-01-11', false), ad('2026-01-01', '2026-01-11', false), ad('2026-07-31', T, true), ad('2026-07-31', T, true)];
  const s = survival(ads);
  assert.equal(s.at[7], 100);
  assert.equal(s.at[30], 50);
  assert.equal(s.at[90], 50);
  assert.equal(s.median, 10);
});

test('hooks: spoken line first, joined until it carries a thought, templates skipped', () => {
  assert.deepEqual(extractHook({ transcript: 'I tell you what. This changed my afternoons.', body: 'Shop now' }), { hook: 'I tell you what. This changed my afternoons.', source: 'spoken' });
  assert.equal(extractHook({ body: '{{product.brand}}', title: 'Fiber you can taste' }).source, 'headline');
});

test('angles come from the hook before the body', () => {
  assert.equal(angleFor("Don't change your life, just change lunch", '26 vitamins and minerals', ''), 'comparison');
  assert.equal(angleFor('Get 30% off your first order', '', ''), 'discount');
  assert.equal(angleFor('Hello', '9g fiber per can', ''), 'science');
  assert.equal(angleFor('Just snap a photo of your plate', 'AI counts your protein', ''), 'demo');
  assert.equal(angleFor('I lost 32 lbs without counting every bite', '', ''), 'before_after');
});

test('normaliseAd reads video cards and template copy', () => {
  const a = normaliseAd({ ad_archive_id: 1, is_active: true, start_date: 1760000000, snapshot: { display_format: 'DCO', body: { text: '{{product.brand}}' },
    cards: [{ body: 'Real copy here', title: '{{product.name}}', video_hd_url: 'https://v', video_preview_image_url: 'https://t' }] } });
  assert.equal(a.format, 'video');
  assert.equal(a.body, 'Real copy here');
  assert.equal(a.title, '');
  assert.equal(a.thumb_url, 'https://t');
});
