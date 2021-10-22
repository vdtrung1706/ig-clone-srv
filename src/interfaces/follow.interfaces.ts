import { Document } from 'mongoose';
import { IUser } from './user.interfaces';

export interface IFollow extends Document {
  user: IUser;
  followers: IUser[];
  following: IUser[];
}
