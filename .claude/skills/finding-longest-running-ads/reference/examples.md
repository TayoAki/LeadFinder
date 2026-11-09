# Examples

## "Find the longest-running ads in the meal kit category"
`search_ads` query "meal kit delivery", `min_run_days: 90`, `format` omitted -> `get_ad` on three -> `show_ad_gallery`.
> I found six meal-kit ads running 90+ days. The oldest, about 7 months, is a simple static ad with a first-box discount and a photo of the finished dish. Two videos open with a person unboxing. Long run time suggests the advertiser keeps paying for these; it doesn't prove they were profitable. Want one adapted for your brand?

## "Which of Peloton's ads have they kept running?"
`search_advertisers` "peloton.com" -> `search_ads` with page id and `min_run_days: 90`. If under four results, drop to 60 and say so.
