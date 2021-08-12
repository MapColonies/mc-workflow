FROM node:erbium-alpine3.11 as production
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./run.sh ./run.sh
RUN chmod +x run.sh
RUN npm install
COPY . .
EXPOSE 3009
CMD ["./run.sh"]
