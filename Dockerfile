# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Only copy manifests first for better caching
COPY package*.json ./
# Install ALL deps including dev (TypeScript, etc.)
RUN npm install --omit=optional

# Copy tsconfig and sources
COPY tsconfig.json ./
COPY src ./src

# Compile TS -> JS
RUN npm run build

# ---- runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install prod deps
COPY package*.json ./
RUN npm install --omit=dev --omit=optional

# Copy compiled output only
COPY --from=build /app/dist ./dist

# Railway will inject PORT; default to 8080
ENV PORT=8080
EXPOSE 8080

# Try common entrypoints (server.js/index.js/app.js) to be resilient
CMD [ "sh", "-c", "node dist/server.js || node dist/index.js || node dist/app.js" ]
