import mongoose from 'mongoose';
import Comment from '../models/comment';
import Post from '../models/post';
import User from '../models/user';
import Follow from '../models/follow';

export function connect(url: string): Promise<typeof mongoose> {
  return mongoose.connect(url);
}

export const models = {
  User,
  Post,
  Comment,
  Follow,
};
