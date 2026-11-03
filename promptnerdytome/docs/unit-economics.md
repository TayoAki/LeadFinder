# PromptNerdyToMe — Unit Economics (first pass)

Last updated 2026-11-03.

**Measured:**
- GPU seconds per app, from the project's own GPU test runs (`web/examples/index.json`).
- Modal GPU rates quoted in the upstream README: L40S $1.95/hr, H100 $3.95/hr.
- The backend's 10-minute warm window (`infra/modal_app.py`, `scaledown_window=600`).

**Everything else is an assumption, marked (A).**

## 1. Raw GPU cost per output (warm GPU, measured)
| Output | Typical app | GPU seconds | Raw cost |
|---|---|---|---|
| Image (median of 70 apps) | create-image, face-swap, character | 4–27 s | **$0.005** median, $0.018 at the 90th percentile |
| Video (median of 46 apps) | video, morph, dub, Scene Mixer | 60–110 s | **$0.07** median, $0.19 at the 90th percentile |
| Heavy video | effects 196 s, camera-moves 349 s, bullet-time 358 s | up to 6 min | **$0.19–0.22** |
| Audio | music, sfx | 19–26 s | **$0.01** |

These are warm-GPU numbers. Real cost adds:
- **Cold starts:** loading tens of GB of model weights.
- **App switching:** the gateway unloads the GPU when the app changes.
- **Failed runs:** 23 of 733 test cases failed, about 3%.
- **The idle tail:** the GPU stays up for 10 minutes after the last request. That's **$0.66 per session on an H100 and $0.33 on an L40S**.

**Overhead multiplier (A):** 3–5× while traffic is low, 1.3–1.6× at steady volume.

## 2. COGS per paying user per month (A: 60 images + 20 videos)
| Line | Early (low traffic) | At scale |
|---|---|---|
| GPU, raw | $2.90 | $2.90 |
| GPU overhead (cold start, idle, retries) | ×4 → $11.60 | ×1.5 → $4.35 |
| Storage of outputs (~0.4 GB a month, object storage) | <$0.05 | <$0.05 |
| Content moderation on outputs (A: ~$0.002/gen) | $0.16 | $0.16 |
| Payment fees on $19 (2.9% + $0.30) | $0.85 | $0.85 |
| **Total COGS** | **≈ $12.70** | **≈ $5.40** |
| **Gross margin at $19/mo** | **≈ 33%** | **≈ 72%** |

If sold through the iPhone app store, Apple takes 15–30% more, which drops margin by that much.

## 3. Fixed costs (A)
- **Web app hosting** (Railway): ~$20–50/mo.
- **Model weights storage** on Modal: hundreds of GB for all packs; check Modal's volume pricing.
- **Kept-warm GPUs:** one L40S always on costs ~$1,420/mo and one H100 ~$2,880/mo. Don't do this until volume justifies it.
- **Monitoring, email, domain:** ~$50/mo.
- **Moderation and takedown process:** staff time.

## 4. Free tier (the silent killer)
- **Cost per free user (A):** 3 images + 1 video ≈ $0.12 raw, ×4 overhead ≈ **$0.50**.
- **At a 4% free-to-paid conversion (A):** that's **~$12.50 of GPU per paying customer acquired**. Count it as acquisition cost.
- **Fix:** watermark free outputs ("Made with PromptNerdyToMe", which is also the growth engine), allow image-only free use, and require sign-up before any video.

## 5. Pricing: credits priced off GPU seconds
**Rule:** credits charged = loaded GPU cost × 3.3, for about 70% gross margin. 1 credit ≈ $0.01 retail (A).

| Output | Loaded cost (1.5×) | Credits | Retail value |
|---|---|---|---|
| Fast image | $0.008 | 3 | $0.03 |
| Standard image / face swap | $0.02–0.04 | 8 | $0.08 |
| Standard video (5 s) | $0.10–0.15 | 40 | $0.40 |
| Heavy video / camera moves | $0.30 | 100 | $1.00 |

**Plans (A):**
- Starter $9: 700 credits
- Creator $19: 1,700 credits
- Pro $49: 5,000 credits
- Annual plans 20% off.

**Let credits roll over one month.** "Credits I did not use would expire" is the top complaint about Higgsfield on Reddit, so this is a positioning win at a small cost.

## 6. SaaS math (A)
- **Lifetime value:**
  - $19 × 72% margin ÷ 10% monthly churn (A, typical of consumer AI tools) ≈ **$137 lifetime gross profit**.
  - With a 30% recurring creator affiliate (Higgsfield's growth engine), contribution falls to ≈ **$80**.
- **CAC ceiling** for a 3:1 LTV:CAC ratio: ≈ **$27–45 per paying customer**, including free-tier GPU burn.
- **Break-even on fixed costs** of ~$300/mo before kept-warm GPUs: about **20–25 paying users** at scale margins.
  - Early, at 33% margin, it takes about **50**.

## 7. What moves margin most
1. **GPU usage, not price.** Shorten the warm window (600 s → 120–180 s) once demand is steady. Send small image apps to L40S or cheaper GPUs, and keep H100 for the heavy video apps.
2. **Batch the queue** per app, so models aren't unloaded and reloaded between users.
3. **Cut the catalog:** ship the 10–20 apps people use, not all 120. Fewer models loaded means fewer cold starts.
4. **Compare hosted model APIs** (pay per output, no idle) for rarely used apps. Check their per-output prices against the loaded numbers above.
5. **Run the iPhone app as a companion:** take payment on the web to avoid the 15–30% App Store fee.

## 8. Risk costs to plan for
- **Face swap, character swap and AI influencer tools** need consent rules, moderation and a fast takedown process: non-consensual intimate imagery, likeness and deepfake laws such as the US TAKE IT DOWN Act. Budget for this from day one.
- **Model licenses:** some open-weights models restrict commercial use. Check each app's model list before charging for it.
