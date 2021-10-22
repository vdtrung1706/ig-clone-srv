import { IContext } from '../../interfaces';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    me: authenticated((_, __, { user }: IContext) => {
      return user.populate('bookmarks');
    }),
    user: authenticated(async (_, { id }, { models }: IContext) => {
      const user = await models.User.findById(id)
        .populate('bookmarks')
        .lean()
        .exec();

      return user;
    }),
    users: authenticated(async (_, __, context: IContext) => {
      const users = await context.models.User.find({})
        .populate('bookmarks')
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
          .populate('bookmarks')
          .lean()
          .exec();

        return updatedUser;
      }
    ),
  },
};
