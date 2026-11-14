#!/bin/sh
# Container entrypoint (run from packages/api/.medusa/server).
set -e
MEDUSA=/app/node_modules/.bin/medusa
$MEDUSA db:migrate
# One-off setup, switched on by env vars and safe to leave on (both steps are idempotent):
#   SHELBY_SEED=true          load the Shelby sellers, products and offers (skips if present)
#   ADMIN_INVITE_EMAIL=...    create an operator invite; the token is printed to the logs
if [ "$SHELBY_SEED" = "true" ]; then $MEDUSA exec ./src/scripts/seed-shelby.js; fi
if [ -n "$ADMIN_INVITE_EMAIL" ]; then $MEDUSA user -e "$ADMIN_INVITE_EMAIL" --invite || echo "admin invite skipped (user may already exist)"; fi
exec $MEDUSA start
