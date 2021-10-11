import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: String,
    bio: {
      type: String,
      maxlength: 130,
    },
    website: {
      type: String,
      maxlength: 65,
    },
    private: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    bookmarks: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'post',
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('user', userSchema);

export default User;
