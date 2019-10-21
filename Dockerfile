FROM node:latest

ENV DEBIAN_FRONTEND noninteractive

COPY . /app
WORKDIR /app

RUN npm i -g pnpm
RUN npm i -g typescript

RUN pnpm run watch