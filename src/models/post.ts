import mongoose from 'mongoose';
import { IPost } from '../interfaces';

const postSchema = new mongoose.Schema<IPost>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'user',
    },
    image: String,
    caption: String,
    hashtags: [String],
  },
  { timestamps: true }
);

postSchema.pre('deleteOne', { document: true }, async function (next) {
  await mongoose.model('comment').deleteMany({ postId: this._id });
  next();
});

const Post = mongoose.model<IPost>('post', postSchema);

export default Post;
