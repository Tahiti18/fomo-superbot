
FROM node:20-alpine
WORKDIR /app

# Install all deps including dev (typescript) so build succeeds
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TS -> JS
RUN npm run build

EXPOSE 8080
CMD ["node","dist/server.js"]
