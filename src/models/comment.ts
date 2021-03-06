import { model, Schema } from 'mongoose';
import { IComment } from '../interfaces';

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      require: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      require: false,
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
      require: false,
      ref: 'comment',
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'comment',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'user',
    },
  },
  { timestamps: true }
);

commentSchema.pre('deleteOne', { document: true }, async function (next) {
  await model('comment').deleteMany({ replyTo: this._id });
  next();
});

const Comment = model<IComment>('comment', commentSchema);

export default Comment;
