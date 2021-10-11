import * as db from './db';
import config from './config';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as http from 'http';
import { typeDefs, resolvers } from './api';

startApolloServer().catch((err) => console.log(err));

async function startApolloServer(): Promise<void> {
  // Express app
  const app = express();
  app.disable('x-powered-by');
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Connect to MongoDb
  await db.connect(config.dbURL);

  // Server
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: config.api.prefix,
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.port }, resolve)
  );

  console.log(
    `🚀 [Server]: http://localhost:${config.port}${config.api.prefix}`
  );
}
