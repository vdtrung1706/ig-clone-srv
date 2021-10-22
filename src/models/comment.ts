import { model, Schema } from 'mongoose';
import { IComment } from '../interfaces';

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

const popArray = [
  'author',
  'post',
  'likes',
  {
    path: 'replies',
    populate: {
      path: 'author',
      model: 'user',
    },
  },
  {
    path: 'replyTo',
    populate: {
      path: 'author',
      model: 'user',
    },
  },
];

commentSchema.pre('deleteOne', { document: true }, async function (next) {
  await model('comment').deleteMany({ replyTo: this._id });
  next();
});

commentSchema.pre(/^find/, function (next) {
  this.populate(popArray).then(function () {
    next();
  });
});

// commentSchema.post('save', function (doc, next) {
//   doc.populate(popArray).then(function () {
//     next();
//   });
// });

const Comment = model<IComment>('comment', commentSchema);

export default Comment;
