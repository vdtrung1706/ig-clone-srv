import mongoose from 'mongoose';
import { PostInterface } from '../interfaces/PostInterface';

const postSchema = new mongoose.Schema<PostInterface>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    image: String,
    caption: String,
    hashtags: [String],
  },
  { timestamps: true }
);

const Post = mongoose.model<PostInterface>('post', postSchema);

export default Post;
