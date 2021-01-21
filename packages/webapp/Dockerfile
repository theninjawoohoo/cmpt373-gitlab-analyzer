FROM node:14

COPY . /project
WORKDIR /project

RUN npm ci
RUN npm run bootstrap:ci

WORKDIR /project/packages/webapp

RUN npm run build

EXPOSE 3000
CMD ["npx", "serve", "build", "-l", "3000"]
