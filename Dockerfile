# Building layer
FROM node:lts-alpine as development

WORKDIR /app

COPY . . 

RUN yarn install \
 && yarn cache clean
 
RUN yarn run build

RUN npx prisma generate

FROM node:lts-alpine as production

WORKDIR /app

COPY package*.json ./

COPY --from=development /app/dist/ ./dist/

EXPOSE 8080/tcp

CMD [ "yarn", "start:migrate:prod" ]