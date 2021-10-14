import { model, Schema } from 'mongoose';
import { IComment } from '../interfaces/comment.interfaces';

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'user',
    },
    post: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'post',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'user',
      },
    ],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'comment',
      },
    ],
  },
  { timestamps: true }
);

commentSchema.pre('deleteOne', { document: true }, async function (next) {
  await model('comment').deleteMany({ replyTo: this._id });
  next();
});

const Comment = model<IComment>('comment', commentSchema);

export default Comment;
