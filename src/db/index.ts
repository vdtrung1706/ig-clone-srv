import mongoose from 'mongoose';
import User from '../models/user';
import Post from '../models/post';

export function connect(url: string): Promise<typeof mongoose> {
  return mongoose.connect(url);
}

export const models = {
  User,
  Post,
};
