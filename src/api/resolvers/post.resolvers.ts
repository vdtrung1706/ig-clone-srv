import { IContext } from '../../interfaces/context.interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    post: authenticated(async (_, { id }, context: IContext) => {
      const post = await context.models.Post.findById(id).lean().exec();
      return post;
    }),
    posts: authenticated(async (_, __, { models, user }: IContext) => {
      const posts = await models.Post.find({ author: user.id }).lean().exec();
      return posts;
    }),
  },
  Mutation: {
    createPost: authenticated(async (_, { input }, context: IContext) => {
      const post = await context.models.Post.create({
        ...input,
        author: context.user.id,
      });
      return post;
    }),
    updatePost: authenticated(async (_, { input }, { models }: IContext) => {
      const post = await models.Post.findOneAndUpdate(
        { _id: input.id },
        input,
        {
          new: true,
        }
      )
        .lean()
        .exec();
      return post;
    }),
  },
};
