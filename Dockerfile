# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifests and install ALL deps (dev deps needed to compile TS)
COPY package*.json ./
RUN npm install --omit=optional

# Copy sources and tsconfig, then compile TS -> JS
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev --omit=optional

# Copy compiled output
COPY --from=build /app/dist ./dist

# Railway will inject PORT (fallback to 8080)
ENV PORT=8080
EXPOSE 8080

# Try common entrypoints so we don't care how you named it
CMD ["sh","-c","node dist/server.js || node dist/index.js || node dist/app.js"]
