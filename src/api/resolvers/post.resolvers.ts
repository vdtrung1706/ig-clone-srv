import { IContext } from '../../interfaces/IContext';
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
      const posts = await models.Post.find({ author: user.id })
        .populate('author')
        .lean()
        .exec();
      return posts;
    }),
  },
  Mutation: {
    createPost: authenticated(async (_, { input }, context: IContext) => {
      const post = await context.models.Post.create({
        ...input,
        author: context.user.id,
      });
      return post.populate('author');
    }),
    updatePost: authenticated(async (_, { input }, { models }: IContext) => {
      const updatedUser = await models.Post.updateOne(
        { _id: input.id },
        input,
        {
          new: true,
        }
      )
        .populate('bookmarks')
        .lean()
        .exec();

      return updatedUser;
    }),
  },
};
