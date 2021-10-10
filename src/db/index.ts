import mongoose from 'mongoose';
import User from '../models/user';

export function connect(url: string): Promise<typeof mongoose> {
  return mongoose.connect(url);
}

export const models = {
  User,
};
