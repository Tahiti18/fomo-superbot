# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install all deps (dev + prod) to compile TS
COPY package*.json ./
RUN npm install

# Compile TS -> JS
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc -p tsconfig.json

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy only prod deps (prune dev out of the build layer)
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Bring compiled app
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/server.js"]
