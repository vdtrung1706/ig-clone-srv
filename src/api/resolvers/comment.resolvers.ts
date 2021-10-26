import { IContext } from '../../interfaces';
import { authenticated } from '../middlewares/auth';

const popArr = [
  'createdBy',
  'post',
  'likes',
  {
    path: 'replies',
    populate: {
      path: 'createdBy',
      model: 'user',
    },
  },
  {
    path: 'replyTo',
    populate: {
      path: 'createdBy',
      model: 'user',
    },
  },
];

export default {
  Query: {
    comment: authenticated(async (_, { commentId }, { models }: IContext) => {
      const comment = await models.Comment.findById(commentId)
        .populate(popArr)
        .lean()
        .exec();

      return comment;
    }),
    comments: authenticated(async (_, { postId }, { models }: IContext) => {
      const comments = await models.Comment.find({
        post: postId,
      })
        .populate(popArr)
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
          createdBy: user.id,
        });

        const query = await models.Comment.findById(comment.id)
          .populate(popArr)
          .lean()
          .exec();

        return query;
      }
    ),
    createReply: authenticated(
      async (_, { input }, { user, models }: IContext) => {
        const reply = await models.Comment.create({
          content: input.content,
          createdBy: user.id,
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
          .populate(popArr)
          .lean()
          .exec();

        return query;
      }
    ),
    updateComment: authenticated(async (_, { input }, { models }: IContext) => {
      const comment = await models.Comment.findOneAndUpdate(
        { _id: input.commentId },
        input,
        {
          new: true,
        }
      )
        .populate(popArr)
        .lean()
        .exec();

      return comment;
    }),
    deleteComment: authenticated(
      async (_, { commentId }, { models }: IContext) => {
        const comment = await models.Comment.findOne({ _id: commentId }).exec();

        await comment.deleteOne();

        return comment;
      }
    ),
    toggleLike: authenticated(
      async (_, { commentId }, { user, models }: IContext) => {
        const updatedComment = await models.Comment.updateOne(
          { _id: commentId, likes: { $ne: user.id } },
          {
            $push: {
              likes: user.id,
            },
          }
        );

        // if user've already liked then remove it from the likes,
        if (updatedComment.modifiedCount === 0) {
          await models.Comment.updateOne(
            {
              _id: commentId,
            },
            {
              $pull: {
                likes: user.id,
              },
            }
          );
        }

        const comment = await models.Comment.findById(commentId)
          .populate(popArr)
          .lean()
          .exec();

        return comment;
      }
    ),
  },
};
