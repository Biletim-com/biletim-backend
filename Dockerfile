# Development
FROM node:18-slim AS development

WORKDIR /app

COPY ./src ./src
COPY ./test ./test
COPY package.json ./
COPY tsconfig.json ./
COPY pnpm-lock.yaml ./
COPY nest-cli.json ./
COPY ormconfig.ts ./ormconfig.ts

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

# Production
FROM node:18-slim AS production

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV TZ="Asia/Istanbul"

COPY --from=development /app/dist ./dist
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY ormconfig.ts ./ormconfig.ts
COPY docker-entrypoint.sh ./

RUN npm install -g pnpm
RUN pnpm install --prod

CMD ["/bin/bash", "/app/docker-entrypoint.sh"]
