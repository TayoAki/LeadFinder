# PromptNerdyToMe

An AI image, video and audio studio: 120 apps on open-weights models, laid out like the big AI video platforms.
- **Create:** images, videos with sound, music and sound effects.
- **Edit:** relight, inpaint, upscale, remove backgrounds.
- **Effects:** camera moves, morphs, transitions.
- **People:** character and face swap, lip sync, an AI influencer builder, cinema studio shots.

Built on [Freefield](https://github.com/neuregex/freefield) (MIT). See NOTICE.md.

## How it runs
```
browser ──▶ web/ + server/ (Node 22.6+) ──▶ GPU backend (ComfyUI behind a token gateway)
                                            on Modal (cloud GPU, pay per second) or your own GPU
```
The web app runs anywhere (Railway, a laptop). **Generating anything needs the GPU backend.**

## Quick start (UI only, no GPU)
```sh
npm install
npm run serve            # http://127.0.0.1:3000 : browse every app and the example results
```

## With a GPU (Modal)
Follow "Run it" in UPSTREAM-README.md:
1. Run `python tools/doctor.py`.
2. Set up the gateway token and the Hugging Face secret.
3. Download the model packs.
4. Run `modal deploy infra/modal_app.py`.
5. Put `COMFY_BASE_URL` and the token in `.env`.

Internal names are unchanged so upstream updates still merge: the `FREEFIELD_*` env vars, the `/freefield/*` gateway routes and the Modal app names.

## Hosting it publicly
`server/guard.ts` adds a passcode and run caps:
- `FREEFIELD_PASSCODE`
- `FREEFIELD_MAX_RUNS_PER_DAY`
- `FREEFIELD_MAX_ACTIVE`

There are no user accounts, credits or payments yet. Those are the next step before opening it to the public.
