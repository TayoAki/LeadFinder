# Examples

## Contents
- "What did my competitors launch this week?"
- "Give me a table of everything Rival Co is running"
- Empty window

## "What did my competitors launch this week?"
1. `list_brands`: one brand, use it.
2. `list_new_competitor_ads` with that brand and no `since` (seven days).
3. Twelve ads from four rivals. Show six in the gallery.
4. Reply: "Four rivals started running ads this week. Rival Co added four videos that open with a customer question. Rival Two added two image ads with the same fast-shipping line. The other two added one ad each. The videos are the ones I would read first. Want me to save them, or adapt one for your brand?"

## "Give me a table of everything Rival Co is running"
1. `list_competitors` to find Rival Co's id.
2. `list_tracked_rival_ads` with `competitor_id` and `response_format: "table"`.
3. Share the CSV rows in the reply. Say it covers one page, not every ad Rival Co has run. Offer the next page with `next_cursor`.

## Empty window
`list_new_competitor_ads` returns no ads for the last seven days. Say: "I found no new ads from your tracked rivals in the last week. That can mean nothing new started, or that a scan has not run yet." Offer a 30-day window, or `scan_competitor` for a rival (tracking scans can use credits: show the cost and get a yes first).
