FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Prefer npm ci, fall back to install if no lock exists
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm","start"]
