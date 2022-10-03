ARG DOCKER_CACHE
FROM ${DOCKER_CACHE}node:14-alpine

ADD . /app

WORKDIR /app

RUN npm ci
RUN npm run build
