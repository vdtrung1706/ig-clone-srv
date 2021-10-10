import mongoose from 'mongoose';
import { UserInterface } from '../interfaces/UserInterface';

const userSchema = new mongoose.Schema({
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
});

const User = mongoose.model<UserInterface & mongoose.Document>(
  'user',
  userSchema
);

export default User;
