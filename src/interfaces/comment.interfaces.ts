import { Document } from 'mongoose';
import { IPost } from './post.interfaces';
import { IUser } from './user.interfaces';

export interface IComment extends Document {
  content: string;
  createdAt?: string;
  author: IUser;
  post: IPost;
  likes?: [IUser];
  replyTo?: IComment;
  replies?: [IComment];
}
