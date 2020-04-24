FROM node:current-slim

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

COPY . /app