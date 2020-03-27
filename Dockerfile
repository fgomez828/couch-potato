FROM node:current-slim

RUN mkdir /app
WORKDIR /app

COPY package.json .

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]

COPY . .