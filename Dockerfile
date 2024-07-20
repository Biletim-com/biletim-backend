# Builder stage
FROM node:18-slim as development

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY ./src ./src
COPY package.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
COPY *.lock ./

RUN yarn install


RUN yarn run build

# Final stage
FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV TZ="Asia/Istanbul"

COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package*.json ./
COPY --from=development /app/yarn.lock ./yarn.lock
COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma
COPY --from=development /app/.env ./.env
COPY --from=development /app/src ./src
COPY --from=development /app/docker-entrypoint.sh ./docker-entrypoint.sh

CMD ["/bin/bash", "/app/docker-entrypoint.sh"]
