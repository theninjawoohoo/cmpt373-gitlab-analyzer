# 🦊 GitLab Iteration Analyzer

## Installations
-  [Docker](https://docs.docker.com/get-docker/)
-  [docker-compose](https://docs.docker.com/compose/install/)
-  [node.js](https://nodejs.org/en/) (version 14 LTS recommended)


## Setup Development Environment
1. In the project root, run `docker-compose up -d db`. This command will start up the postgres database on port 5433 on your computer.
2. In the project root, run `npm install` and then `npm run bootstrap`, and finally `npm run link`
3. In **packages/types** run `npm run build`
4. In **packages/api** folder run: `npm run build && npm run migrate` and then `npm run start:dev`
5. In **packages/webapp** run `npm run start`


## Packages and Commands Explanations
* `packages/api`: The backend server, which uses the Express and NestJS frameworks.  In `packages/api`, run: 
    1. `npm run build && npm run migrate`: to build the app and then run migrations to keep your database schema up to date
    2. `npm run start:dev`: start the server in development mode.
* `packages/types`: Shared type definitons so the front end and back end know what resources are being transferred: run `npm run build` before running the api or webapp
* `packages/webapp`: The frontend, which is a React application. Run `npm run start` (in `packages/webapp`) to start the front end in development mode.


### Docker 
~~This is not needed to development purposes and is used to run the webapp without any setup:
Run `docker-compose up` in the project root. This will take a few minutes to download and build everything, but once it's done it'll tell you to visit `http://localhost:3000`. You'll find the webapp there.~~ Docker needs to be updated since we introduced the `@ceres/types` package.
