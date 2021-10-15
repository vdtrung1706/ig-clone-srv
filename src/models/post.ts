import mongoose from 'mongoose';
import { IPost } from '../interfaces/post.interfaces';

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

postSchema.pre(/^find/, function (next) {
  this.populate('author').then(function () {
    next();
  });
});

postSchema.post('save', function (doc, next) {
  doc.populate('author').then(function () {
    next();
  });
});

const Post = mongoose.model<IPost>('post', postSchema);

export default Post;
