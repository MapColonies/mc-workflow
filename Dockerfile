FROM node:12.18.1-alpine3.11 as production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3009
CMD ["node", "index.js"]
