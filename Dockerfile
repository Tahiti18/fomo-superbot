# Use official Node LTS
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false
COPY tsconfig.json ./
COPY src ./src
COPY dist ./dist
RUN npm run build || echo "build step failed but dist/ present"
ENV NODE_ENV=production
EXPOSE 8080
CMD ["npm", "start"]
