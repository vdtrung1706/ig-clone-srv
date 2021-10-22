import { Document } from 'mongoose';
import { IPost } from './post.interfaces';

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
