# Keepwatch

Turn your competitors' winning ads into yours.

Keepwatch finds the Meta ads your rivals keep paying to run, shows why they work, and rebuilds them for your brand. A new set lands every Monday.

- **Category overview:** how many ads are running now, how many were killed and launched this week, each rival's longest-running ad, the format league, and how long each format lasts.
- **Playbooks:** for one rival, what they keep running, what they tested and dropped, what rotated out, and what they're testing now.
- **Hooks that lasted:** opening lines from ads that ran 30+ days, plus every angle rated by temperature. Open ground means no rival runs it, so you can say it first.
- **Rebuild ("Steal this ad"):** keeps the rival ad's scene and layout, then swaps in your product, offer and colour. It never copies their name, logo, claims or wording.
- **Ad test:** a simulated buyer panel picks between your ad and theirs. Each buyer sees both ads twice, with the order swapped.
- **Monday drop:** four new ads a week, built from different rivals' kept ads with different angles.
- **MCP server:** ask Claude, ChatGPT or Cursor what your rivals keep running (`POST /mcp`).

## Plans and credits
| Plan | Price | Tracked rivals | Credits a month | About |
|---|---|---|---|---|
| Trial | free, 14 days | 5 | 200 (whole trial) | 5 ads |
| Growth | $149/mo or $1,490/yr | 5 | 550 | 40 ads |
| Scale | $299/mo or $2,990/yr | 20 | 2,000 | 140 ads |
| Agency | $599/mo or $5,990/yr | 40 | 6,500 | 530 ads |

**What credits pay for:**
- One finished ad: 10 credits.
- One tracked rival: 30 credits a month. Its Read and Playbook are included.
- One buyer panel: 5 credits.
- One motion video: 2 credits. One AI video: 30 credits.

A failed render is refunded automatically. Every movement is recorded in `credit_ledger`.

**Not built yet:**
- Upgrades. Stripe will set `workspaces.plan` when billing is added.
- A path after the trial. When it ends, the account is read-only.

## Finished ads
1. **Import your brand kit** (Settings): paste your website. We pull your name, colours, font and real product photos. Shopify stores return clean shots from `/products.json`.
2. **Steal this ad:** pick a size (feed 4:5, story 9:16 or square) and the product to feature.
3. **Render:** the rival ad is the layout reference and your product photo is the second reference. Every product in the frame becomes yours, unchanged, and nothing of the rival's stays.
4. **Ad copy:** you also get the primary text, headline and call to action for Ads Manager.
5. **Video (9:16, 4–10 s):** turn any finished ad into a vertical video for Reels, Stories and TikTok. There are two modes:
   - **Motion:** the ad exactly as approved, with a slow camera push. It runs in ffmpeg only, takes seconds and needs no AI.
   - **AI video:** video models garble text, so we never animate the ad itself. We remove every word from the still (GPT Image 2), animate that clean frame (Seedance 1 Lite via `FAL_KEY`, or treg locally), then burn the ad's own lines back on with ffmpeg. The first line is the hook and stays up top; the other lines take turns below, and the badge closes the video.

   Both modes need ffmpeg and a font. The Dockerfile installs them.

## Run it
```sh
cd keepwatch
npm install
npm start          # http://localhost:3100 (sign up at /signup)
npm test
```
Node 22.5+ (built-in `node:sqlite`). One SQLite file holds everything, including Better Auth's tables.

**Environment variables:**

| Variable | Needed for |
|---|---|
| `BETTER_AUTH_SECRET` | Required in production: 32+ random characters. |
| `BETTER_AUTH_URL` | The public URL, e.g. `https://keepwatch.up.railway.app`. |
| `KEEPWATCH_DATA` | Folder for the database and rendered ads (a Railway volume, e.g. `/data`). |
| `SCRAPECREATORS_API_KEY` | Adding rivals and the weekly refresh. Without it, only the bundled demo data is available. |
| `FAL_KEY` | Ad images with GPT Image 2. Recommended: best at keeping your product photo exact. |
| `GEMINI_API_KEY` | Ad images with Gemini 3 Pro Image, used if `FAL_KEY` is not set. |
| `ANTHROPIC_API_KEY` | Claude-written concepts and ad copy, and the buyer panel. |

Locally, the **treg** CLI stands in for the ad-data and image keys.

**Startup and refresh:**
- On first boot, the server imports `seed-data/ads.json.gz`: public Ad Library rows for a demo category, so "Try the demo" works with no keys.
- Every hour it refreshes any tracked rival not updated in 7 days.

**Collector commands:**
- `npm run collect -- --seed seed.json`: set a workspace's brand and rivals from a file.
- `--rival "Name"`: add one rival by name.
- `--page <pageId> "Name"`: add a rival by page id, for when name search picks the wrong page.
- `--retag`: re-run hook and angle tagging.
- `node --experimental-sqlite lib/seed.mjs --export`: rebuild the seed file.

## How we count
| Term | Meaning |
|---|---|
| Run days | Days from the Ad Library start date to the end date, or to today if the ad is still live. Ads with no start date are left out. |
| Kept | Still running, live 30+ days. An ad that has paid its way through a full test cycle. |
| Testing | Running, under 30 days. |
| Killed | Stopped inside 30 days. |
| Retired | Ran 30+ days, then stopped (often seasonal). |
| New | Start date in the last 7 days. This is the real launch date from the Ad Library, not the day we first saw it. |
| Survival | Kaplan–Meier by format. Ads still running count as "lasted at least this long", not as finished. |
| Temperature | Open ground (no rival runs it), Warm (1–2 rivals), Crowded (3+), Burning out (tried, now stopped). |

**Caveats:**
- **Sample sizes:** under 10 ads we describe instead of ranking; under 3 we just show the ads.
- **Samples, not totals:** every number comes from a sample of each rival's public, English-language ads, never their whole library.
- **Lasting isn't selling:** run length shows an ad lasted, not that it made money.

## How it's built
```
collect.mjs        ScrapeCreators Ad Library via treg → SQLite (active by reach, active newest, stopped newest; video transcripts)
lib/classify.mjs   format, hook (spoken > copy > headline), angle taxonomy (regex, tunable)
lib/analytics.mjs  piles, overview, rival keeps, format league, Kaplan–Meier survival, hooks, angle temperature, playbooks
lib/rebuild.mjs    concept (Claude or rules) + Gemini 3 Pro Image render with the rival ad as layout reference; Monday drop
lib/llm.mjs        Claude concept writer + buyer panel (personas judge blind, both orders; flips count as ties)
server.mjs         JSON API, static UI, MCP endpoint
web/               UI: left rail, rival sidebar, tabs, main content, right sidebar, bottom bar
```

**Credits:**
- The brand-kit scrape and the "real product photo as a reference" rendering are adapted from [RENDER Studio](https://robonuggets.com) by RoboNuggets (CC BY 4.0).
- The method draws on Matt Berman's MIT-licensed kits:
- [Steal-Ads-Nano-Banana](https://github.com/TheMattBerman/Steal-Ads-Nano-Banana): ranking, image prompt structure and no-logo rules.
- [ads-mcp](https://github.com/TheMattBerman/ads-mcp): the 30-day line, the kept / killed / retired / testing piles, sample floors and adaptation rules.
- [creator-breakout-kit](https://github.com/TheMattBerman/creator-breakout-kit), [openclaw-100k-posts-kit](https://github.com/TheMattBerman/openclaw-100k-posts-kit) and [meta-ads-kit](https://github.com/TheMattBerman/meta-ads-kit): hook rules, buyer inputs and copy specs.

No code or brand assets were copied. Keepwatch is not affiliated with StealAds.

**Data use:** ads come from the public Meta Ad Library through a third-party scraping provider. Meta's terms restrict automated collection, so check that this fits your use before running it at scale.
