# Shelby Commerce: Mercur (Medusa v2 marketplace) API + admin panel (/dashboard) + seller panel (/seller).
FROM node:24-slim
RUN npm install -g bun@1.4.4
WORKDIR /app

# Dependencies first so they cache between deploys. Hoisted layout: the panels expect npm-style node_modules.
COPY package.json bun.lock ./
COPY apps/admin/package.json apps/admin/
COPY apps/vendor/package.json apps/vendor/
COPY packages/api/package.json packages/api/
RUN bun install --linker hoisted --frozen-lockfile

COPY . .
# The panels bake the public API origin in at build time.
ARG MERCUR_BACKEND_URL
RUN test -n "$MERCUR_BACKEND_URL" && NODE_ENV=production MERCUR_DISABLE_TELEMETRY=true MEDUSA_DISABLE_TELEMETRY=true bun run build

WORKDIR /app/packages/api/.medusa/server
ENV NODE_ENV=production MERCUR_DISABLE_TELEMETRY=true MEDUSA_DISABLE_TELEMETRY=true PORT=9000
EXPOSE 9000
# boot.sh: migrate, optional seed/admin invite, start. Uploads live in ./static (mount a volume there).
CMD ["sh", "/app/boot.sh"]
