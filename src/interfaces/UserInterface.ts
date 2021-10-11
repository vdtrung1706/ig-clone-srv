import mongoose from 'mongoose';
import { PostInterface } from './PostInterface';

export interface UserInterface {
  email: string;
  username: string;
  password: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  private?: boolean;
  confirmed?: boolean;
  bookmarks?: Array<{ post: mongoose.Model<PostInterface> }>;
}
