FROM node:14

COPY . /project
WORKDIR /project

RUN npx lerna bootstrap --ci

WORKDIR /project/packages/api

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]