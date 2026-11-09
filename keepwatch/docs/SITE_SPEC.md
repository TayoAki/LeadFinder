# Keepwatch landing page: site spec

Reference: stealads.ai, scraped 2026-11-09 with Firecrawl. Sources: the full-page screenshot (1920×13,762), the raw HTML, the compiled CSS (`/_astro/index@_@astro.*.css`), and a crawl of 10 pages (home, resources, facebook-ads, integrations, docs, changelog, breakdowns, terms, privacy, removal).

**What we take from the reference and what we don't.** We keep its structure:
- the order of sections and what each one shows;
- the layout patterns;
- the type scale;
- the dark theme with live product previews.

We do **not** copy its copy, logo, colours, illustrations or screenshots. StealAds is a direct competitor, and every word and image on our page must be our own. This is the same rule Keepwatch applies to ads: keep the structure, change the words, the look and the product.

## 1. Project overview
- **Product:** Keepwatch, competitor ad intelligence for Meta.
- **What the page does:** shows the product working, section by section, and ends in a signup.
- **Stack:** one static page, `web/landing.html`, served by `server.mjs`. Plain CSS and a few lines of JS: no framework, no build step, the same deploy as the app.
  - This is a deliberate change from the skill's Next.js scaffold. A second app for one page would mean a second deploy and a second set of dependencies.

## 2. Design tokens
### 2.1 Reference (measured)
| Token | Value |
|---|---|
| Page background | `#0a0a0b` |
| Raised surface | `#141416` |
| Card border | ~`rgba(255,255,255,.08)` |
| Text | `#ffffff`; muted text at about 55% white |
| Accent | neon green `#00ff80`, for the primary CTA only |
| Data colours | running `#6FC7C0` teal, killed `#F07A73`, new `#D9C57F`, chart blue `#8DA6E8` |
| Fonts | Inter (400–900) plus JetBrains Mono (400/500) for small labels |
| Display size | `clamp(2.5rem, 4.5vw, 4rem)` |
| Heading tracking | −.04em to −.045em |
| Reading widths | 46ch, 440px and 640px |
| Radii | pill, `--r-lg`, `--r` and `--r-sm` tokens |
| Floating shadow | `0 40px 80px -30px rgba(0,0,0,.95)` |
| Edge fades | `--fade-x` and `--fade-y` linear-gradient masks |

### 2.2 Keepwatch (ours)
| Token | Value | Why |
|---|---|---|
| `--bg` | `#0c0b0a` | warm near-black, not their cool black |
| `--surface` | `#161412` | |
| `--surface-2` | `#1d1a17` | |
| `--line` | `rgba(255,240,225,.09)` | |
| `--ink` | `#f4efe8` | warm off-white |
| `--ink-2` | `rgba(244,239,232,.62)` | |
| `--ink-3` | `rgba(244,239,232,.4)` | |
| `--accent` | `#e0705a` | Keepwatch coral, the brand colour already in the app (dark-mode step) |
| `--accent-ink` | `#1a0c08` | |
| Data colours | blue `#3987e5`, orange `#d95926`, aqua `#199e70` | the validated dark palette from the dataviz reference, as in the app |
| Status colours | running = aqua, killed = `#e66767`, new = `#c98500` | |

**Type and shape:**
- **Font:** Inter only, weights 400–800. No monospace labels; that's the reference's signature.
- **Sizes:** display `clamp(2.5rem, 5vw, 4.25rem)`, h2 `clamp(2rem, 4vw, 3.25rem)`, tracking −.035em.
- **Layout:** container 1120px, 16px side gutter on phones, section padding 112px desktop / 72px phone.
- **Radii:** 18px for cards, 12px inside cards, pills for buttons.

## 3. Global styles
- **Theme:** dark, set via `color-scheme: dark`. `body` gets an explicit background.
- **Text selection:** accent at 35% opacity.
- **Motion:** none, beyond hover transitions of 150ms.

## 4. Two-tone headline pattern
- **Reference:** each h2 is one sentence. The first clause is white and the second is in a `<span>` at about 55% white.
- **Ours:** we keep the pattern, which is a common editorial device, with our own sentences.

## 5. Buttons
| Button | Reference | Ours |
|---|---|---|
| Primary | neon-green pill, dark text, about 40px tall | coral pill, dark text, 44px tall, 0 18px padding, 600 weight |
| Secondary | transparent pill with a 1px border | same pattern: transparent, 1px `--line` border, ink text |

On hover, the background brightens 6%.

## 6. Sections: reference → ours
| # | Reference shows | Ours |
|---|---|---|
| 0 | Sticky nav: logo, 5 links, CTA pill | Keepwatch mark; How it works · Pricing · FAQ; Sign in + "Start free trial" |
| 1 | Hero: four-line headline, last word coloured; sub; two CTAs; ad collage with a floating video card and "77 days running" chip | Our headline and sub; a collage of **our own generated ads** (Weight Class and Orchard Hour) with "live N days" chips on the source ads |
| 2 | "Category read": KPI card (running / killed / new), rival-keeps card, format league, survival chart | The same four tiles built from Keepwatch's **real Weight Class read**: 354 running, 90 killed, 190 new; Noom 599 days and others; video vs static league; survival curve |
| 3 | Matchup: yours vs theirs, 8 buyers, vote bar | The Keepwatch buyer panel: your ad vs a rival tile, buyers voting in two orders, the verdict |
| 4 | Playbook: rival list on the left, playbook card on the right | Rival list (Shotsy, Cal AI, Noom); Shotsy's real read ("41 of 41 kept ads are GLP-1 education") |
| 5 | Hooks that lasted + angles by temperature | Hook rows with day counts, and angle cards with temperature pills, from the Weight Class data |
| 6 | Rebuild: ad in the centre, floating "scene / layout / swapped" chips, "why this works" card | A real Weight Class rebuild in the centre, with chips for "Same story / New location / Different person" |
| 7 | Monday drop: notification card plus fanned ads | Notification card plus four fanned Weight Class drop ads |
| 8 | Works in your AI: client chips | Same: Claude, ChatGPT, Cursor, Codex, any MCP client |
| 9 | Testimonials (3 quotes) | **Omitted.** We have no customer quotes yet and won't invent any. Replaced by "How we count" (the honesty rules) |
| 10 | Pricing: 3 plans | Growth / Scale / Agency, our own copy, monthly/yearly toggle |
| 11 | Fit / not for you | Our own lists |
| 12 | FAQ accordion | Our own questions and answers (`<details>`, no JS) |
| 13 | Final CTA card with collage | "Start free trial" card |
| 14 | Footer | Product / account links, copyright |

## 7. Assets
**We use:**
- `web/img/wc-1..4.jpg`: Weight Class ads we generated (the client's own brand).
- `web/img/example-*.jpg`: Orchard Hour ads (a demo brand).

**We never use:**
- rival ads;
- the reference's images;
- real third-party brands' creative.

"Their ad" tiles in mocks are abstract placeholders labelled with run length.

## 8. Third-party integrations
- **Google Fonts:** Inter.
- **Nothing else:** no analytics and no chat widget.

## 9. Build and verify
1. Write `web/landing.html`.
2. Check it at 1440px and 390px wide: no horizontal scroll, and every section renders.
3. Run a headless screenshot, then deploy with the app.
