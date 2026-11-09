# Examples

## Make it here
User: "Make me an ad like this one for my coffee brand."
1. `get_ad` the ad. 2. `list_brands` -> "Harbor Coffee". 3. Plan: "keep the bold one-line benefit headline and the subscribe-and-save offer shape, with Ridge's product and voice."
4. `quote_steal_ad` -> 10 credits, balance 140.
5. "This will use 10 credits and you have 140. Make it?" -> "yes"
6. `steal_ad` with the quote's key. 7. `get_ad_status` until ready -> show the image inline with a download link.

## Hand off
Same request on a research-only connection: after the plan sentence, `make_ad_in_stealads` with the ad id -> "Open this to finish your version in StealAds. You'll choose your brand and see the cost before anything is made: <link>".

