import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as http from 'http';
import { resolvers, typeDefs } from './api';
import { createToken, getUserFromToken } from './api/middlewares/auth';
import config from './config';
import * as db from './db';
import { IContext } from './interfaces/context.interfaces';

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
    context: async ({ req, res }): Promise<IContext> => {
      const models = db.models;
      const token = req.headers.authorization;
      const user = await getUserFromToken(token);

      return {
        res,
        req,
        user,
        models,
        createToken,
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: '/',
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.port }, resolve)
  );

  console.log(`🚀 [Server]: http://localhost:${config.port}`);
}
