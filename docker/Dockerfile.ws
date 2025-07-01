FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml turbo.json ./

COPY ./apps/ws/package.json ./apps/ws/package.json

COPY . .

RUN npm install -g pnpm

WORKDIR /app/packages/db

RUN pnpx prisma generate

WORKDIR /app

RUN pnpm install 

RUN pnpm build:ws


WORKDIR /app/apps/ws
EXPOSE 8080

CMD [ "pnpm","dev" ]