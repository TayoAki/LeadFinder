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

## Run it
```sh
cd keepwatch
npm install
npm run collect -- --seed seed.json   # sets your brand + rivals, pulls their ads (~$0.01 per rival)
npm start                              # http://localhost:3100
npm test
```
**Requirements:**
- Node 22.5+, for the built-in `node:sqlite`.
- The **treg** CLI, to collect ads and render images. treg injects the provider keys, so this app never holds them.
- `ANTHROPIC_API_KEY` (optional). It turns on Claude-written concepts and the buyer panel. They use `claude-opus-5-5` with server-side refusal fallbacks.

**Other commands:**
- `npm run collect`: refresh all rivals.
- `npm run collect -- --rival "Olipop"`: add one rival by name.
- `npm run collect -- --page 183869772601 "AG1"`: add a rival by page id, for when name search picks the wrong page.
- `npm run collect -- --retag`: re-run hook and angle tagging after you change `lib/classify.mjs`.

**Environment variables:**
- `KEEPWATCH_PASSCODE`: required for anything that spends money or changes data, and for `/mcp`.
- `PORT` (default 3100).
- `KEEPWATCH_DATA`: database and image folder.
- Collector tuning: `KW_ACTIVE_PAGES`, `KW_RECENT_PAGES`, `KW_KILLED_PAGES` (30 ads per page), `KW_TRANSCRIPTS` (video transcripts per rival), and `KW_LANGUAGE` (default `EN`).

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

**Credits:** the method draws on Matt Berman's MIT-licensed kits:
- [Steal-Ads-Nano-Banana](https://github.com/TheMattBerman/Steal-Ads-Nano-Banana): ranking, image prompt structure and no-logo rules.
- [ads-mcp](https://github.com/TheMattBerman/ads-mcp): the 30-day line, the kept / killed / retired / testing piles, sample floors and adaptation rules.
- [creator-breakout-kit](https://github.com/TheMattBerman/creator-breakout-kit), [openclaw-100k-posts-kit](https://github.com/TheMattBerman/openclaw-100k-posts-kit) and [meta-ads-kit](https://github.com/TheMattBerman/meta-ads-kit): hook rules, buyer inputs and copy specs.

No code or brand assets were copied. Keepwatch is not affiliated with StealAds.

**Data use:** ads come from the public Meta Ad Library through a third-party scraping provider. Meta's terms restrict automated collection, so check that this fits your use before running it at scale.
