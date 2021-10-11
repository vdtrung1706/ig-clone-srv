import mongoose from 'mongoose';
import { UserInterface } from './UserInterface';

export interface PostInterface {
  author: mongoose.Model<UserInterface>;
  image?: string;
  caption?: string;
  hashtags?: Array<string>;
  createdAt?: string;
}
