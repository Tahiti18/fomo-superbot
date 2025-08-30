# Multi-stage build for FOMO Superbot
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy manifests first for better layer caching
COPY package*.json ./
# Install deps (works with or without a lockfile)
RUN npm install --omit=dev

# Copy the rest of the source
COPY tsconfig.json ./
COPY src ./src

# Compile TS -> JS
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copy only what's needed to run
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Healthcheck is served by server.ts at GET /health
EXPOSE 8080
CMD ["node", "dist/server.js"]
