FROM node:14

COPY . /project
WORKDIR /project

RUN npm ci
RUN npm run bootstrap:ci

WORKDIR /project/packages/api

RUN npm run build

EXPOSE 4000
CMD ["node", "dist/main"]