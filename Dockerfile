FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node","dist/server.js"]
