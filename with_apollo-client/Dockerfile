FROM node:16-alpine as base
# TODO move this to lamda runtime API image ?

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

COPY .yarn/ ./
RUN yarn set version 3.4.1 && yarn plugin import interactive-tools

COPY yarn.lock ./
COPY .yarnrc.yml ./

# RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --immutable --silent
RUN yarn install --immutable --silent

COPY functions ./

EXPOSE 3000

CMD [ "yarn", "start:func" ]