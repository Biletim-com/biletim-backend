# Development
FROM node:18-slim AS development

WORKDIR /app

# Install necessary tools and dependencies in a single layer
RUN apt-get update -qq && apt-get install -y \
    # Essentials for building native modules and handling zstd
    build-essential \
    python3 \
    zstd \
    # Chromium dependencies
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libnss3 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    # Install Chromium browser
    chromium \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

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
FROM node:18-slim AS production

WORKDIR /app

# Install necessary tools and dependencies in a single layer
RUN apt-get update -qq && apt-get install -y \
    # Essentials for building native modules and handling zstd
    build-essential \
    python3 \
    zstd \
    # Chromium dependencies
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libnss3 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    # Install Chromium browser
    chromium \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY --from=development /app/dist ./dist
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY global.d.ts ./
COPY ormconfig.ts ./
COPY open-zst.script.ts ./
COPY docker-entrypoint.sh ./

RUN npm install -g pnpm
RUN pnpm install --prod && \
    addgroup --system pptruser && adduser --system --ingroup pptruser pptruser && \
    mkdir -p /home/pptruser/Downloads && \
    chown -R pptruser:pptruser /home/pptruser && \
    chown -R pptruser:pptruser /app && \
    chown -R pptruser:pptruser ./node_modules

CMD ["/bin/bash", "/app/docker-entrypoint.sh"]
