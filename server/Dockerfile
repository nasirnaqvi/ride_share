FROM node:20-alpine AS node-backend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]
