import { Document } from 'mongoose';
import { IPost } from './IPost';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  private?: boolean;
  confirmed?: boolean;
  bookmarks?: Array<{ post: IPost }>;
  checkPassword: (password: string) => Promise<boolean>;
}
