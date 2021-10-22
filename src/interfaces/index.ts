import { ExpressContext } from 'apollo-server-express';
import { Document } from 'mongoose';
import { createToken } from '../api/middlewares/auth';
import { models } from '../db';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  private?: boolean;
  verified?: boolean;
  bookmarks?: IPost[];
  checkPassword: (password: string) => Promise<boolean>;
}

export interface IContext extends ExpressContext {
  user?: IUser;
  models?: typeof models;
  createToken?: typeof createToken;
}

export interface IFollow extends Document {
  user: IUser;
  followers: IUser[];
  following: IUser[];
}

export interface IPost extends Document {
  author: IUser;
  image?: string;
  caption?: string;
  hashtags?: Array<string>;
  createdAt?: string;
}

export interface IComment extends Document {
  content: string;
  createdAt?: string;
  author: IUser;
  post: IPost;
  likes?: [IUser];
  replyTo?: IComment;
  replies?: [IComment];
}
