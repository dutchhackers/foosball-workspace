FROM node:16-slim

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package.json ./

RUN npm install

COPY ./dist/apps/slackbot-api ./

CMD node ./main.js
