# Examples

## 1. "What Facebook ads is Gymshark running right now?"
Steps: `search_advertisers` "gymshark.com" -> `search_ads` with the page id -> `get_ad` on four ads -> `show_ad_gallery`.

Reply shape:
> Here is a sample of Gymshark's current ads (I can't see all of them). Three things stand out:
> 1. Product-first static ads with a one-line benefit headline; two have run for 70+ days.
> 2. Video ads that open with a creator talking to camera ("I tried...").
> 3. A new restock offer ad that started this week.
> Run time shows an ad has lasted, not that it sold. Want me to open their Playbook to see what they keep and drop, or adapt one of these for your brand?

## 2. "Show me my competitor's ads that have been running the longest"
Ask which competitor if unclear. Then `search_advertisers` -> `search_ads` with `min_run_days: 90`. If empty, retry once with 60 and say you lowered the bar.

## 3. "What is my competitor testing right now?"
`list_brands` to find the brand, `list_competitors` to find the rival, `get_playbook` and read "testing now" and what started since the last read. If the rival is not tracked, say so and offer `add_competitor` with the cost shown first.
