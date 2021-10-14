import { IComment } from '../../interfaces/comment.interfaces';
import { IContext } from '../../interfaces/context.interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    comments: authenticated(
      async (_, { postId }, { models }: IContext): Promise<Array<IComment>> => {
        const comments = await models.Comment.find({
          post: postId,
        })
          .populate('author')
          .populate('post')
          .populate('likes')
          .populate({
            path: 'replies',
            populate: {
              path: 'author',
              model: 'user',
            },
          });

        return comments;
      }
    ),
  },
  Mutation: {
    createComment: authenticated(
      async (_, { input }, { user, models }: IContext) => {
        const comment = await models.Comment.create({
          content: input.content,
          post: input.postId,
          author: user.id,
        });

        const query = await models.Comment.findById(comment.id)
          .populate('author')
          .populate('post')
          .populate('replyTo')
          .populate('likes')
          .populate('replies')
          .exec();

        return query;
      }
    ),
    createReply: authenticated(
      async (_, { input }, { user, models }: IContext) => {
        const reply = await models.Comment.create({
          content: input.content,
          author: user.id,
          post: input.postId,
          replyTo: input.replyTo,
        });

        await models.Comment.updateOne(
          { _id: input.replyTo },
          {
            $push: {
              replies: {
                _id: reply.id,
              },
            },
          }
        );

        const query = await models.Comment.findById(reply.id)
          .populate('author')
          .populate('post')
          .populate('likes')
          .populate('replies')
          .populate({
            path: 'replyTo',
            populate: {
              path: 'author',
              model: 'user',
            },
          })
          .exec();

        return query;
      }
    ),
    updateComment: authenticated(async (_, { input }, { models }: IContext) => {
      const comment = await models.Comment.updateOne({ _id: input.it }, input, {
        new: true,
      })
        .populate('author')
        .populate('post')
        .populate('likes')
        .populate('replies')
        .populate({
          path: 'replyTo',
          populate: {
            path: 'author',
            model: 'user',
          },
        })
        .exec();

      return comment;
    }),
    deleteComment: authenticated(async (_, { id }, { models }: IContext) => {
      const comment = await models.Comment.findOne({ _id: id })
        .populate('author')
        .populate('post')
        .populate('likes')
        .populate('replies')
        .populate({
          path: 'replyTo',
          populate: {
            path: 'author',
            model: 'user',
          },
        })
        .exec();

      await comment.deleteOne();

      return comment;
    }),
    toggleLike: authenticated(async (_, { id }, { user, models }: IContext) => {
      const comment = await models.Comment.findOneAndUpdate({ _id: id })
        .populate('author')
        .populate('post')
        .populate('likes')
        .populate('replies')
        .populate({
          path: 'replyTo',
          populate: {
            path: 'author',
            model: 'user',
          },
        })
        .exec();

      if (comment) {
        const userIdx = comment.likes.findIndex((item) => item._id == user.id);
        if (userIdx !== -1) {
          comment.likes.splice(userIdx);
        } else {
          comment.likes.push(user);
        }
        comment.save();
      }

      return comment;
    }),
  },
};
