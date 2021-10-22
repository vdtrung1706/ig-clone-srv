import { IContext } from '../../interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    comment: authenticated(async (_, { id }, { models }: IContext) => {
      const comment = await models.Comment.findById(id).lean().exec();

      return comment;
    }),
    comments: authenticated(async (_, { postId }, { models }: IContext) => {
      const comments = await models.Comment.find({
        post: postId,
      })
        .lean()
        .exec();

      return comments;
    }),
  },

  Mutation: {
    createComment: authenticated(
      async (_, { input }, { user, models }: IContext) => {
        const comment = await models.Comment.create({
          content: input.content,
          post: input.postId,
          author: user.id,
        });

        const query = await models.Comment.findById(comment.id).lean().exec();

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

        const query = await models.Comment.findById(reply.id).lean().exec();

        return query;
      }
    ),
    updateComment: authenticated(async (_, { input }, { models }: IContext) => {
      const comment = await models.Comment.findOneAndUpdate(
        { _id: input.it },
        input,
        {
          new: true,
        }
      )
        .lean()
        .exec();

      return comment;
    }),
    deleteComment: authenticated(async (_, { id }, { models }: IContext) => {
      const comment = await models.Comment.findOne({ _id: id }).exec();

      await comment.deleteOne();

      return comment;
    }),
    toggleLike: authenticated(async (_, { id }, { user, models }: IContext) => {
      const comment = await models.Comment.findOneAndUpdate({ _id: id }).exec();

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
