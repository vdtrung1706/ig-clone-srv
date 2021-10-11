import { ExpressContext } from 'apollo-server-express';
import { models } from '../db';
import { createToken } from '../api/middlewares/auth';

export interface IContext extends ExpressContext {
  token?: string;
  models?: typeof models;
  createToken?: typeof createToken;
}
