# Instagram API clone

## Links

- [igdb.trungvu.live](https://igdb.trungvu.live/) (If the server isn't expired 😗)
- [on dockerhub](https://hub.docker.com/repository/docker/vdtrung1706/ig-clone-srv)

## Tech Stack

- [Nodejs](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [GraphQL](https://graphql.org/)
- [MongoDb](https://www.mongodb.com/)
- [Apollo Server/Express](https://www.apollographql.com/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)

## Features

- JWT authentication
- CRUD post, user, following, followers, comment
- Some Jest test cases
- ...

## About

This is a simple Instagram API clone. I've done with just purpose of learning Typescript, how to use it in Nodejs, GraphQL repo... And then put them all in containers. After that, I also learn how to run it on a remote server as well.

## Quick Start

### Run locally

- Needs Nodejs, MongoDb installed.
- Clone the project

```bash
  $ git clone git@github.com:vdtrung1706/ig-clone-srv.git
```

- Install dependencies

```bash
  $ npm install
```

- Add `.env` then enter smt like this

```bash
DB_URL=mongodb://127.0.0.1:27017/ig-clone
DB_TESTING_URL=mongodb://127.0.0.1:27017/ig-clone-testing
PORT=8080
JWT_SECRET=anystring
JWT_EXP=10d
```

- Run app

```bash
  $ npm start
```

### Run containers using Docker

- [Go to repo on dockerhub](https://hub.docker.com/repository/docker/vdtrung1706/ig-clone-srv)

### Or docker-compose

```bash
  $ docker-compose up -d
```

## License

MIT
