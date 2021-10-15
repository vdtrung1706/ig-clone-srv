import { IContext } from '../../interfaces/context.interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    me: authenticated((_, __, { user }: IContext) => {
      return user.populate(['followers', 'following', 'bookmarks']);
    }),
    user: authenticated(async (_, { id }, { models }: IContext) => {
      const user = await models.User.findById(id)
        .populate(['followers', 'following', 'bookmarks'])
        .lean()
        .exec();

      return user;
    }),
    users: authenticated(async (_, __, context: IContext) => {
      const users = await context.models.User.find({})
        .populate(['followers', 'following', 'bookmarks'])
        .lean()
        .exec();

      return users;
    }),
  },
  Mutation: {
    updateMe: authenticated(
      async (_, { input }, { models, user }: IContext) => {
        const updatedUser = await models.User.findOneAndUpdate(
          { _id: user.id },
          input,
          {
            new: true,
          }
        )
          .populate(['followers', 'following', 'bookmarks'])
          .lean()
          .exec();

        return updatedUser;
      }
    ),
    toggleFollow: authenticated(
      async (_, { id }, { user, models }: IContext) => {
        const userFollow = await models.User.findById(id)
          .populate(['followers', 'following', 'bookmarks'])
          .exec();

        const index = user.following.findIndex((u) => u._id == id);

        if (index !== -1) {
          user.following.filter((u) => u._id != id);
          userFollow.followers.filter((u) => u._id != user.id);
        } else {
          user.following.push(userFollow);
          userFollow.followers.push(user);
        }

        user.save();
        userFollow.save();

        return userFollow;
      }
    ),
    deleteFollower: authenticated(
      async (_, { id }, { user, models }: IContext) => {
        const userFollower = await models.User.findById(id)
          .populate(['followers', 'following', 'bookmarks'])
          .exec();

        const index = user.followers.findIndex((u) => u._id == id);

        if (index !== -1) {
          user.followers.filter((u) => u._id != id);
          userFollower.following.filter((u) => u._id != user.id);
        }

        return await user.save();
      }
    ),
  },
};
