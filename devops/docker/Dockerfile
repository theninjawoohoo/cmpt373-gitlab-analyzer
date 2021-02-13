FROM node:14

COPY . /project
WORKDIR /project

RUN npm ci
RUN npm run bootstrap:ci
RUN npm run link
RUN npm run build
RUN npm run lint
