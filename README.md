# GitLab Analyzer

## Docker

If you want to just run the webapp without any setup:
1. [Install Docker](https://docs.docker.com/get-docker/)
2. [Install docker-compose](https://docs.docker.com/compose/install/)
3. Run `docker-compose up` in the project root. This will take a few minutes to download and build everything, but once it's done it'll tell you to visit `http://localhost:3000`. You'll find the webapp there.

## Setup

1. Install [node.js](https://nodejs.org/en/) (version 14 LTS recommended)
2. In the project root, run `docker-compose up -d db` (you'll need to install docker and docker-compse, see instructions above): this command will start up the postgres database on port 5433 on your computer.
3. In the project root, run `npm install` and then `npm run bootstrap`, and finally `npm run link`

## Packages

* `packages/api`: The backend server, which uses the Express and NestJS frameworks.  In `packages/api`, run: 
    1. `npm run build && npm run migrate`: to build the app and then run migrations to keep your database schema up to date
    2. `npm run start:dev`: start the server in development mode.
* `packages/types`: Shared type definitons so the front end and back end know what resources are being transferred: run `npm run build` before running the api or webapp
* `packages/webapp`: The frontend, which is a React application. Run `npm run start` (in `packages/webapp`) to start the front end in development mode.
