import { Document } from 'mongoose';
import { IUser } from './IUser';

export interface IPost extends Document {
  author: IUser;
  image?: string;
  caption?: string;
  hashtags?: Array<string>;
  createdAt?: string;
}
