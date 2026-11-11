"""Monte Carlo revenue simulation for one plan folder.

Usage: python3 simulate_revenue.py <plan_dir> [--inbound LOW HIGH]
Reads <plan_dir>/data/icp.json, writes <plan_dir>/06-revenue-simulation.md and data/simulation.json.

Model (per segment, per run, monthly for 24 months):
- Outbound: CONTACTS_PER_SEGMENT new contacts a month (capped by the segment's US count).
- New deals = contacts * reply_rate * meeting_to_close, where each rate is drawn uniformly from the segment's [low, high].
- Deals land after a sales cycle drawn from [low, high] days.
- Customers churn each month at a rate drawn from [low, high].
- Optional inbound (search) customers a month, drawn from [low, high], shared across the plan.
- Cost: COST_PER_CONTACT covers data, enrichment, sending tools and SDR time.
Every rate is a planning assumption from icp.json; the output shows ranges (P10/P50/P90), not forecasts.
"""
import json, os, random, statistics, sys

RUNS = 5000
MONTHS = 24
CONTACTS_PER_SEGMENT = 1000      # per month, per segment, for the per-segment comparison
PLAN_CONTACTS = 3000             # per month across the top-3 segments for the combined plan
COST_PER_CONTACT = 1.00          # USD, all-in (data + enrichment + sending + SDR time)

def u(r):
    lo, hi = r
    return random.uniform(min(lo, hi), max(lo, hi))

def run_segment(seg, contacts_per_month, inbound=None):
    reply, close, churn = u(seg['reply_rate']), u(seg['meeting_to_close']), u(seg['monthly_churn'])
    cycle_m = max(0, round(u(seg['sales_cycle_days']) / 30))
    budget = seg.get('us_count') or 10**9
    pipeline = [0.0] * (MONTHS + 12)
    cust, contacted, mrr_path, cust_path, setup_rev = 0.0, 0, [], [], 0.0
    for m in range(MONTHS):
        c = min(contacts_per_month, max(0, budget - contacted))
        contacted += c
        pipeline[m + cycle_m] += c * reply * close
        if inbound:
            pipeline[m + 1] += u(inbound)
        new = pipeline[m]
        setup_rev += new * (seg.get('setup_fee') or 0)
        cust = cust * (1 - churn) + new
        cust_path.append(cust)
        mrr_path.append(cust * seg['price_mo'])
    cost = contacted * COST_PER_CONTACT
    total_new = sum(pipeline[:MONTHS])
    return dict(mrr6=mrr_path[5], mrr12=mrr_path[11], mrr24=mrr_path[23], cust12=cust_path[11], cust24=cust_path[23],
                cac=cost / total_new if total_new else float('inf'),
                won=total_new, contacted=contacted,
                m10k=next((i + 1 for i, v in enumerate(mrr_path) if v >= 10000), None),
                m100k=next((i + 1 for i, v in enumerate(mrr_path) if v >= 100000), None),
                setup=setup_rev)

def pct(xs, p):
    xs = sorted(xs); return xs[min(len(xs) - 1, int(p / 100 * len(xs)))]

def summarise(results):
    out = {}
    for k in ('mrr6', 'mrr12', 'mrr24', 'cust12', 'cust24', 'cac', 'setup'):
        vals = [r[k] for r in results if r[k] != float('inf')]
        out[k] = [pct(vals, 10), pct(vals, 50), pct(vals, 90)] if vals else [None] * 3
    out['p10k_by_m6'] = sum(1 for r in results if r['m10k'] and r['m10k'] <= 6) / len(results)
    out['p100k_by_m24'] = sum(1 for r in results if r['m100k'] and r['m100k'] <= 24) / len(results)
    return out

def money(v):
    if v is None: return '—'
    return f"{v/1000:,.0f}k" if abs(v) >= 1000 else f"{v:,.0f}"

def main():
    plan = sys.argv[1]
    inbound = None
    if '--inbound' in sys.argv:
        i = sys.argv.index('--inbound'); inbound = [float(sys.argv[i + 1]), float(sys.argv[i + 2])]
    segs = json.load(open(os.path.join(plan, 'data', 'icp.json')))
    random.seed(42)
    per = []
    for s in segs:
        res = [run_segment(s, CONTACTS_PER_SEGMENT) for _ in range(RUNS)]
        sm = summarise(res)
        needed = 100e6 / 12 / s['price_mo']
        sm.update(segment=s['segment'], price=s['price_mo'], us_count=s.get('us_count'),
                  share_for_100m=(needed / s['us_count']) if s.get('us_count') else None)
        per.append(sm)
    per.sort(key=lambda x: -x['mrr12'][1])
    top = [next(s for s in segs if s['segment'] == p['segment']) for p in per[:3]]
    combined = []
    for _ in range(RUNS):
        rs = [run_segment(s, PLAN_CONTACTS / 3, inbound if j == 0 else None) for j, s in enumerate(top)]
        agg = {k: sum(r[k] for r in rs) for k in ('mrr6', 'mrr12', 'mrr24', 'cust12', 'cust24', 'setup')}
        agg['cac'] = sum(r['contacted'] for r in rs) * COST_PER_CONTACT / max(1e-9, sum(r['won'] for r in rs))
        mrr_hits = [r['m10k'] for r in rs if r['m10k']]
        agg['m10k'] = min(mrr_hits) if mrr_hits else None
        agg['m100k'] = None
        combined.append(agg)
    comb = summarise(combined)
    json.dump({'per_segment': per, 'combined_top3': comb, 'top3': [s['segment'] for s in top],
               'settings': dict(runs=RUNS, months=MONTHS, contacts_per_segment=CONTACTS_PER_SEGMENT,
                                plan_contacts=PLAN_CONTACTS, cost_per_contact=COST_PER_CONTACT, inbound=inbound)},
              open(os.path.join(plan, 'data', 'simulation.json'), 'w'), indent=1)
    L = ['# Revenue simulation (Monte Carlo)', '',
         f'**{RUNS:,} simulated runs per segment, 24 months.** Every rate comes from `data/icp.json` as a range and is drawn at random in each run, so the results are ranges, not forecasts. These are planning assumptions until the smoke test replaces them with measured numbers.', '',
         '**Settings:**',
         f'- **Per-segment comparison:** {CONTACTS_PER_SEGMENT:,} new outbound contacts per month into each segment, at {COST_PER_CONTACT:.2f} USD per contact all-in (data, enrichment, sending tools and SDR time).',
         f'- **Combined plan:** {PLAN_CONTACTS:,} contacts per month split across the top 3 segments' + (f', plus inbound search customers of {inbound[0]:g}–{inbound[1]:g} a month' if inbound else '') + '.',
         '- **P10 / P50 / P90:** the pessimistic, middle and optimistic outcomes; 80% of runs fall between P10 and P90.', '',
         '## Per segment (1,000 contacts a month each)', '',
         '| Segment | Price/mo | MRR at month 6 (P50) | MRR at month 12 (P10 / P50 / P90) | Customers at month 12 (P50) | MRR at month 24 (P50) | Cost per customer (P50) | Chance of 10k MRR by month 6 | Chance of 100k MRR by month 24 | US share needed for 100M ARR |',
         '|---|---|---|---|---|---|---|---|---|---|']
    for p in per:
        sh = f"{p['share_for_100m']*100:.1f}%" if p['share_for_100m'] else '—'
        if p['share_for_100m'] and p['share_for_100m'] > 1: sh += ' (exceeds the US market)'
        L.append(f"| {p['segment']} | {p['price']:,} | {money(p['mrr6'][1])} | {money(p['mrr12'][0])} / **{money(p['mrr12'][1])}** / {money(p['mrr12'][2])} | {p['cust12'][1]:.0f} | {money(p['mrr24'][1])} | {money(p['cac'][1])} | {p['p10k_by_m6']*100:.0f}% | {p['p100k_by_m24']*100:.0f}% | {sh} |")
    L += ['', f"## Combined plan: top 3 segments ({', '.join(s['segment'] for s in top)})", '',
          '| Metric | P10 | P50 | P90 |', '|---|---|---|---|']
    for k, lab in (('mrr6', 'MRR at month 6'), ('mrr12', 'MRR at month 12'), ('mrr24', 'MRR at month 24'), ('cust12', 'Customers at month 12'), ('cust24', 'Customers at month 24'), ('setup', 'Setup fees collected over 24 months'), ('cac', 'Cost per customer')):
        a, b, c = comb[k]
        f = (lambda v: f'{v:,.0f}') if k.startswith('cust') else money
        L.append(f'| {lab} | {f(a)} | {f(b)} | {f(c)} |')
    L += ['', f"Chance the combined plan reaches 10k USD MRR by month 6: **{comb['p10k_by_m6']*100:.0f}%**.", '',
          '## How to read this', '',
          '- The simulation ranks segments by how quickly the *same outbound effort* turns into recurring revenue, given each segment\'s price, reply and close ranges, sales cycle and churn.',
          '- **"US share needed for 100M ARR"** shows whether a segment alone could ever carry a 100M-dollar business. Above ~10% means the segment is a beachhead, not the whole company.',
          '- **Replace the assumed ranges** in `data/icp.json` with the smoke test\'s measured reply and close rates, then re-run `python3 ../simulate_revenue.py .`.']
    open(os.path.join(plan, '06-revenue-simulation.md'), 'w').write('\n'.join(L) + '\n')
    print(os.path.join(plan, '06-revenue-simulation.md'))

if __name__ == '__main__':
    main()
