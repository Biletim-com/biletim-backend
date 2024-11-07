# Development
FROM node:18-slim AS development

WORKDIR /app

RUN apt-get update -qq \
    && apt-get install \
    -yqq --no-install-recommends \
    build-essential \
    python3 \
    zstd

COPY ./src ./src
COPY ./test ./test
COPY package.json ./
COPY tsconfig.json ./
COPY pnpm-lock.yaml ./
COPY nest-cli.json ./
COPY global.d.ts ./
COPY ormconfig.ts ./
COPY open-zst.script.ts ./

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

# ENV TZ=UTC

# Production
FROM node:18-slim AS production

WORKDIR /app

RUN apt-get update -qq \
    && apt-get install openssl \ 
    -yqq --no-install-recommends \ 
    build-essential \
    python3 \
    zstd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=development /app/dist ./dist
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY global.d.ts ./
COPY ormconfig.ts ./
COPY open-zst.script.ts ./
COPY docker-entrypoint.sh ./

RUN npm install -g pnpm
RUN pnpm install --prod

# ENV TZ=UTC

CMD ["/bin/bash", "/app/docker-entrypoint.sh"]
