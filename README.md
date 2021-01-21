# GitLab Analyzer

## Docker

If you want to just run the webapp without any setup:
1. [Install Docker](https://docs.docker.com/get-docker/)
2. [Install docker-compose](https://docs.docker.com/compose/install/)
3. Run `docker-compose up` in the project root. This will take a few minutes to download and build everything, but once it's done it'll tell you to visit `http://localhost:3000`. You'll find the webapp there.

## Setup

1. Install [node.js](https://nodejs.org/en/) (version 14 LTS recommended)

2. In the project root, run `npm install` and then `npm run bootstrap`

## Packages

* `packages/api`: The backend server, which uses the Express and NestJS frameworks. Run `npm run start:dev` (in `packages/api`) to start the server in development mode.
