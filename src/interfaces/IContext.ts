import { ExpressContext } from 'apollo-server-express';
import { createToken } from '../api/middlewares/auth';
import { models } from '../db';
import { IUser } from './IUser';

export interface IContext extends ExpressContext {
  user?: IUser;
  models?: typeof models;
  createToken?: typeof createToken;
}
