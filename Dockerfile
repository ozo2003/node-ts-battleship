FROM node:latest

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /app
COPY . .

RUN npm i -g pnpm
RUN npm i -g typescript

RUN pnpm install --force
EXPOSE 7666