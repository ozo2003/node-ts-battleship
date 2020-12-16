FROM node:latest

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /app

RUN npm i -g typescript

EXPOSE 7666
