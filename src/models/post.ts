import mongoose from 'mongoose';
import { IPost } from '../interfaces/IPost';

const postSchema = new mongoose.Schema<IPost>(
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

const Post = mongoose.model<IPost>('post', postSchema);

export default Post;
