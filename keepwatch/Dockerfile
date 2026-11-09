FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 KEEPWATCH_DATA=/data
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY . .
EXPOSE 3100
CMD ["node", "--experimental-sqlite", "--no-warnings", "server.mjs"]
