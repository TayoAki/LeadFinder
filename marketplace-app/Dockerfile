# Build the Expo web app, then run the Shelby API (which also serves the app and the seller dashboard).
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npx expo export -p web

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production DATA_DIR=/data
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/data ./src/data
EXPOSE 3200
CMD ["node", "--experimental-sqlite", "--no-warnings", "server/server.mjs"]
