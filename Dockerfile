# Development
FROM node:18-alpine AS development

WORKDIR /app

# Copy project files
COPY ./src ./src
COPY ./test ./test
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY global.d.ts ./
COPY ormconfig.ts ./
COPY open-zst.script.ts ./

RUN apk add --no-cache \
    build-base \
    python3 \
    zstd


# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install PNPM and dependencies
RUN npm install -g pnpm
RUN pnpm install && \
    addgroup --system pptruser && adduser --system --ingroup pptruser pptruser && \
    mkdir -p /home/pptruser/Downloads && \
    chown -R pptruser:pptruser /home/pptruser && \
    chown -R pptruser:pptruser /app && \
    chown -R pptruser:pptruser ./node_modules

RUN pnpm run build

# Production
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=development /app/dist ./dist
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY global.d.ts ./
COPY ormconfig.ts ./
COPY open-zst.script.ts ./
COPY docker-entrypoint.sh ./

RUN apk add --no-cache \
    build-base \
    python3 \
    zstd && \
    rm -rf /var/lib/apt/lists/*

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm install -g pnpm
RUN pnpm install --prod && \
    addgroup --system pptruser && adduser --system --ingroup pptruser pptruser && \
    mkdir -p /home/pptruser/Downloads && \
    chown -R pptruser:pptruser /home/pptruser && \
    chown -R pptruser:pptruser /app && \
    chown -R pptruser:pptruser ./node_modules

CMD ["/bin/bash", "/app/docker-entrypoint.sh"]
