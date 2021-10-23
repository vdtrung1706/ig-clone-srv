import { IContext } from '../../interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    post: authenticated(async (_, { postId }, context: IContext) => {
      const post = await context.models.Post.findById(postId)
        .populate('author')
        .lean()
        .exec();

      return post;
    }),
    posts: authenticated(async (_, __, { models, user }: IContext) => {
      try {
        const posts = await models.Post.find({ author: user.id })
          .populate('author')
          .exec();

        return posts;
      } catch (err) {
        console.log(err);
      }

      return [];
    }),
  },
  Mutation: {
    createPost: authenticated(async (_, { input }, context: IContext) => {
      const post = await context.models.Post.create({
        ...input,
        author: context.user.id,
      });

      return await post.populate('author');
    }),
    updatePost: authenticated(async (_, { input }, { models }: IContext) => {
      const post = await models.Post.findOneAndUpdate(
        { _id: input.postId },
        input,
        {
          new: true,
        }
      )
        .populate('author')
        .lean()
        .exec();

      return post;
    }),
    deletePost: authenticated(async (_, { postId }, { models }: IContext) => {
      const post = await models.Post.findOne({ _id: postId }).exec();

      await post.deleteOne();

      return post;
    }),
  },
};
