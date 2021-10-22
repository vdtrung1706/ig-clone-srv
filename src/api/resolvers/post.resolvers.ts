import { IContext } from '../../interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    post: authenticated(async (_, { id }, context: IContext) => {
      const post = await context.models.Post.findById(id)
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
        { _id: input.id },
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
  },
};
