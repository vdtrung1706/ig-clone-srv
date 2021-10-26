import { IContext, IPost } from '../../interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    post: authenticated(async (_, { postId }, context: IContext) => {
      const post = await context.models.Post.findById(postId)
        .populate('createdBy')
        .lean()
        .exec();

      return post;
    }),
    posts: authenticated(async (_, __, { models, user }: IContext) => {
      try {
        const posts = await models.Post.find({ createdBy: user.id })
          .populate('createdBy')
          .exec();

        return posts;
      } catch (err: any) {
        throw new Error(err.message);
      }
    }),
    recentPosts: authenticated(async (_, __, { models, user }: IContext) => {
      try {
        const follow = await models.Follow.findOne({ user: user.id }).populate(
          'following'
        );
        let posts: Array<IPost>;

        for (const followingUser of follow.following) {
          const followingUserPosts = await models.Post.find({
            createdBy: followingUser.id,
          })
            .populate('createdBy')
            .limit(2)
            .exec();

          posts = [...posts, ...followingUserPosts];
        }

        return posts;
      } catch (err: any) {
        throw new Error(err.message);
      }
    }),
  },
  Mutation: {
    createPost: authenticated(async (_, { input }, context: IContext) => {
      const post = await context.models.Post.create({
        ...input,
        createdBy: context.user.id,
      });

      return await post.populate('createdBy');
    }),
    updatePost: authenticated(async (_, { input }, { models }: IContext) => {
      const post = await models.Post.findOneAndUpdate(
        { _id: input.postId },
        input,
        {
          new: true,
        }
      )
        .populate('createdBy')
        .lean()
        .exec();

      return post;
    }),
    deletePost: authenticated(async (_, { postId }, { models }: IContext) => {
      const post = await models.Post.findOne({ _id: postId })
        .populate('createdBy')
        .exec();

      await post.deleteOne();

      return post;
    }),
  },
};
