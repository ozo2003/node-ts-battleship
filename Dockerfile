FROM node:latest

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /app
COPY . .

RUN npm i -g typescript
RUN npm install

EXPOSE 7666