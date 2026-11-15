#!/bin/sh
# Container entrypoint (run from packages/api/.medusa/server).
set -e
MEDUSA=/app/node_modules/.bin/medusa
$MEDUSA db:migrate
# One-off setup, switched on by env vars and safe to leave on (both steps are idempotent):
#   SHELBY_SEED=true          load the Shelby sellers, products and offers (skips if present)
#   ADMIN_INVITE_EMAIL=...    create an operator invite; the token is printed to the logs
if [ "$SHELBY_SEED" = "true" ]; then $MEDUSA exec ./src/scripts/seed-shelby.js; fi
# Synthetic demo content (supplements + skincare shop, product details), clearly marked in metadata:
#   SHELBY_DEMO=seed     add it (needs DEMO_IMAGE_BASE = the Shelby web URL that serves /demo/*.webp)
#   SHELBY_DEMO=remove   delete all of it; leave either value set, both are idempotent
if [ "$SHELBY_DEMO" = "seed" ]; then $MEDUSA exec ./src/scripts/seed-demo-niches.js; fi
if [ "$SHELBY_DEMO" = "remove" ]; then $MEDUSA exec ./src/scripts/remove-demo-niches.js; fi
if [ -n "$ADMIN_INVITE_EMAIL" ]; then $MEDUSA user -e "$ADMIN_INVITE_EMAIL" --invite || echo "admin invite skipped (user may already exist)"; fi
# Region payment providers follow the config: Stripe only when STRIPE_SECRET_KEY is set.
$MEDUSA exec ./src/scripts/sync-payment-providers.js
exec $MEDUSA start
