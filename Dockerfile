# Use Node LTS
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install deps first (better caching)
COPY package.json package-lock.json* ./

RUN npm install --production=false

# Copy the rest
COPY tsconfig.json ./
COPY src ./src

# Build TS -> JS
RUN npm run build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "start"]
