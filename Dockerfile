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

# Install PNPM and dependencies
RUN npm install -g pnpm
RUN pnpm install

RUN pnpm run build

# Production
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=development /app/dist ./dist
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY global.d.ts ./
COPY ormconfig.ts ./
COPY docker-entrypoint.sh ./

RUN npm install -g pnpm
RUN pnpm install --prod

CMD ["/bin/sh", "/app/docker-entrypoint.sh"]
