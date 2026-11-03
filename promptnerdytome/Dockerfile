# PromptNerdyToMe web app (UI + API). The GPU backend runs elsewhere (Modal or own GPU), set COMFY_BASE_URL.
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production FREEFIELD_HOST=0.0.0.0
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY . .
EXPOSE 3000
CMD ["node", "--experimental-strip-types", "--disable-warning=ExperimentalWarning", "server/server.ts"]
