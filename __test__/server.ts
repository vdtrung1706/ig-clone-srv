/* eslint-disable @typescript-eslint/ban-types */
import { convertNodeHttpToRequest, runHttpQuery } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import express from 'express';
import { DocumentNode, ExecutionResult, print } from 'graphql';
import httpMocks, { RequestOptions, ResponseOptions } from 'node-mocks-http';
import { resolvers, typeDefs } from '../src/api';
import { createToken, getUserFromToken } from '../src/api/middlewares/auth';
import * as db from '../src/db';
import { IContext } from '../src/interfaces/IContext';
import { IUser } from '../src/interfaces/IUser';

// Create a test client from a lib: apollo-server-integration-testing

export type StringOrAst = string | DocumentNode;

export type Options<T extends object> = { variables?: T };

export type TestClientConfig = {
  apolloServer: ApolloServer;
  extendMockRequest?: RequestOptions;
  extendMockResponse?: ResponseOptions;
};

export type TestQuery = <T extends object = {}, V extends object = {}>(
  operation: StringOrAst,
  options?: Options<V>
) => Promise<ExecutionResult<T>>;

export type TestSetOptions = (options: {
  request?: RequestOptions;
  response?: ResponseOptions;
}) => void;

const mockRequest = (options: RequestOptions = {}) =>
  httpMocks.createRequest({
    method: 'POST',
    ...options,
  });

const mockResponse = (options: ResponseOptions = {}) =>
  httpMocks.createResponse(options);

export function createTestClient({
  apolloServer,
  extendMockRequest,
  extendMockResponse,
}: TestClientConfig): {
  query: TestQuery;
  mutate: TestQuery;
  setOptions: TestSetOptions;
} {
  const app = express();
  apolloServer.start().then(() => apolloServer.applyMiddleware({ app }));

  let mockRequestOptions = extendMockRequest;
  let mockResponseOptions = extendMockResponse;

  /**
   * Set the options after TestClient creation
   * Useful when you don't want to create a new instance just for a specific change in the request or response.
   *  */
  const setOptions: TestSetOptions = ({
    request,
    response,
  }: {
    request?: RequestOptions;
    response?: ResponseOptions;
  }) => {
    if (request) {
      mockRequestOptions = request;
    }
    if (response) {
      mockResponseOptions = response;
    }
  };

  const test: TestQuery = async <T extends object = {}, V extends object = {}>(
    operation: StringOrAst,
    { variables }: Options<V> = {}
  ) => {
    const req = mockRequest(mockRequestOptions);
    const res = mockResponse(mockResponseOptions);

    const graphQLOptions = await apolloServer.createGraphQLServerOptions(
      req,
      res
    );

    const { graphqlResponse } = await runHttpQuery([req, res], {
      method: 'POST',
      options: graphQLOptions,
      query: {
        query: typeof operation === 'string' ? operation : print(operation),
        variables,
      },
      request: convertNodeHttpToRequest(req),
    });

    return JSON.parse(graphqlResponse) as T;
  };

  return {
    query: test,
    mutate: test,
    setOptions,
  };
}

export function createServer(userMock: IUser): ApolloServer<ExpressContext> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }): Promise<IContext> => {
      const models = db.models;
      if (userMock) {
        return {
          res,
          req,
          user: userMock,
          models,
          createToken,
        };
      }

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
  });

  return server;
}

export const createTestServer = (
  userMock?: IUser
): {
  query: TestQuery;
  mutate: TestQuery;
  setOptions: TestSetOptions;
} =>
  createTestClient({
    apolloServer: createServer(userMock),
  });
