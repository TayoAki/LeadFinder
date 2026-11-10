# Niche Scorecard: "Website guard" on Uptime Kuma (Gate 0)

2026-11-10 · Offer: 24/7 monitoring of the site, checkout and booking form, plus SSL and domain expiry, text alerts and a monthly report. Price in the video: $99/mo direct to online stores and clinics, or $300/mo wholesale to an agency for 50 sites. Hook: "your SSL expires in 9 days".
Sources: Google index of Upwork job pages via treg (past year, 2 queries), Reddit search via treg (2 queries, 50 posts), live pricing pages (UptimeRobot, Better Stack, StatusCake, Pingdom), Let's Encrypt and Shopify documentation.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight: 0 standalone requests found. Loose: ~10 Upwork posts list "uptime monitoring" as one line inside a maintenance or dev job. |
| 2. Competitors with live prices | ❌ They kill the price | UptimeRobot is free for 50 monitors including SSL and domain expiry, and Solo is $13/mo. StatusCake is $20-24/mo for 100 monitors. Better Stack is free for 10. |
| 3. Margin ≥50% | ✅ PASS (on paper) | About 75-90% at $99, if anyone pays it. |
| 4. Named watering holes | ✅ PASS | See section 4. |

## The repo
[louislam/uptime-kuma](https://github.com/louislam/uptime-kuma): real, 93.4k stars, MIT, self-hosted, with multiple status pages and 90+ notification services. The README lists "Certificate info". It does not explicitly confirm SSL-expiry alerts or domain-expiry checks on that page (not verified). Monitoring a checkout or booking form needs a browser-based check, for which there is a separate [real-browsers plugin](https://github.com/louislam/uptime-kuma-real-browsers-plugin). Basic HTTP pings do not test a checkout.

## 1. Buyers asking
**Upwork (past year).** Every hit bundles monitoring into a bigger job. Examples: "WordPress Maintenance & Security Freelancer (Monthly)" (Upwork ID 022118106687), with updates, backups, uptime monitoring and a monthly report; Monthly Website Maintenance (ID 022114407111); WordPress/Webflow Developer: Build, Maintain & Edit (ID 022118491205); Digital Analytics & Website Performance Tracking (ID 022116763472). **Tight count is 0.** Nobody posts "monitor my site for $99/mo". They post "maintain my site", and monitoring comes free with it.

**Reddit.** People asking are developers and agencies choosing tools, not owners wanting a service: "Your Favorite Free Uptime Monitoring?" (r/webhosting, Aug 2026, 78 comments), "How do you guys monitor websites you manage for clients?" (r/ProWordPress, Aug 2026), and "How do you monitor SSL renewals across multiple domains?" (r/Hosting, Oct 2026). Sellers outnumber buyers: "Would you use an uptime monitor built for agencies?" (r/SaasDevelopers, Nov 2026), and "I spent $424 on ads for my uptime monitor and got 0 paying customers" (r/microsaas, Oct 2026). That second post is a direct failure signal for this exact market.

## 2. Competitors (live prices)
- **UptimeRobot** ([pricing](https://uptimerobot.com/pricing/)): Free has 50 monitors at 5-minute checks, "SSL & Domain exp. monitor", and is allowed for commercial use. Solo is $13/mo (60-second checks, SMS credits). Team is $46/mo for 100 monitors with 100 status pages.
- **StatusCake** ([pricing](https://www.statuscake.com/pricing/)): Free has 10 uptime checks plus 1 SSL and 1 domain check. Superior is $24.49/mo for 100 uptime, 50 SSL and 50 domain checks.
- **Better Stack** ([pricing](https://betterstack.com/pricing)): free for 10 monitors; then $25/mo per 50 monitors, with SSL and TLD-expiry monitoring and unlimited SMS and phone alerts listed.
- **Pingdom**: tiers listed, but prices did not render (not verified).
- **Bundled for free:** WordPress care plans list uptime monitoring as a base feature at $39-129/mo, with GoWP said to start at $39 (secondary source, [round-up](https://belovdigital.agency/blog/wordpress-maintenance-plans-explained-whats-worth-paying-for/)).

**The SSL hook mostly misses.** [Shopify issues free TLS for every domain added](https://help.shopify.com/manual/domains/ssl) and manages it. Most managed hosts auto-renew Let's Encrypt. The real gap is narrow: [Let's Encrypt stopped expiry emails on 2025-06-04](https://letsencrypt.org/2025/06/26/expiration-notification-service-has-ended), so self-managed servers lost their safety net. Those owners are technical, and they use free tools.

## 3. Margin
- Direct, $99/mo: tools ~$0-13/mo (self-host on a $5-10 VPS, plus SMS). Hours: monthly report plus alert triage, about 1 h at $50. (99 − 13 − 50) / 99 = **36%** at 1 h/mo, or **61%** at 0.5 h with an automated report.
- Wholesale, $300/mo for 50 sites: that is $6/site, against UptimeRobot Team at about $0.46/monitor. The agency can buy it themselves in 10 minutes. Margin is high on paper, but there is no reason for the agency to pay.

## 4. Watering holes
r/ProWordPress, r/webhosting, r/Hosting, r/shopify; the Shopify Partners directory; WP agency communities (WP Engine and Kinsta agency partner programs); local dental and medical-practice marketing agencies; BuiltWith or Wappalyzer lists of WooCommerce stores on self-managed hosting (the only segment where SSL actually lapses).

## Attention (30-day)
At least 4 Reddit posts in the last 30 days from founders building uptime monitors "for agencies". There is no buyer-side volume.

## The video's claims vs the evidence
- "$99/mo to stores and clinics": no request found. A free tool covers the same checks.
- "Your SSL expires in 9 days": rarely true for Shopify or managed hosts. It is true for some self-hosted sites, whose owners can fix it for free.
- "$300/mo wholesale to an agency": the agency's cost to do it itself is $0-46/mo.

## Verdict: ❌ REJECT (fails check 1 and check 2)
There are no standalone buyers, and a free or $13/mo tool already does the job, so no price gap exists to justify a done-for-you service.

**Better angle:** do not sell monitoring. Sell an outcome monitoring cannot deliver. One option is a "checkout and booking-form test" for clinics and stores, where a real browser books a test appointment daily and alerts if the form, payment or email confirmation breaks, sold as part of a maintenance retainer. Another is to fold Uptime Kuma into a $75-150/mo WordPress care plan, where buyers already post (about 10 Upwork maintenance jobs a year in this index).
