# Builder stage
FROM node:18-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package.json ./
COPY prisma ./prisma/
COPY *.lock ./

RUN yarn install

COPY . .

RUN yarn run build

# Final stage
FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV TZ="Asia/Istanbul"

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/images ./images
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/src ./src
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

CMD ["/bin/bash", "/app/docker-entrypoint.sh"]
