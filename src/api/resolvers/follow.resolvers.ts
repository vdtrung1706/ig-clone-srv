import { IContext } from '../../interfaces/context.interfaces';
import { authenticated } from '../middlewares/auth';

const popArr = ['user', 'followers', 'following'];

export default {
  Query: {
    getFollow: authenticated(async (_, __, { user, models }: IContext) => {
      const follow = await models.Follow.findOne({ user: user.id })
        .populate(popArr)
        .lean()
        .exec();

      return follow;
    }),
  },
  Mutation: {
    toggleFollow: authenticated(
      async (_, { userId }, { user, models }: IContext) => {
        await models.Follow.updateOne({ user: user.id }, {}, { upsert: true });

        const followingUpdate = await models.Follow.updateOne(
          { user: user.id, following: { $ne: userId } },
          {
            $push: {
              following: userId,
            },
          }
        );

        const { modifiedCount } = followingUpdate;

        // Nothing modified - means that user is already followed
        // then unfollow
        if (modifiedCount < 1) {
          await models.Follow.updateOne(
            { user: user.id },
            {
              $pull: { following: userId },
            }
          );
          await models.Follow.updateOne(
            { user: userId },
            {
              $pull: { followers: user.id },
            }
          );
        } else {
          // push into follower of user to follow
          await models.Follow.updateOne(
            { user: userId },
            {
              $push: {
                followers: user.id,
              },
            },
            {
              upsert: true,
            }
          );
        }

        const follow = await models.Follow.findOne({ user: user.id })
          .populate('following')
          .lean()
          .exec();

        return follow.following;
      }
    ),
    deleteFollower: authenticated(
      async (_, { userId }, { user, models }: IContext) => {
        const updatedFollow = await models.Follow.updateOne(
          { user: user.id, followers: { $ne: userId } },
          {
            $pull: {
              followers: userId,
            },
          }
        );

        // unfollowing of the follower
        if (updatedFollow.modifiedCount > 0) {
          await models.Follow.updateOne(
            {
              user: userId,
              following: { $ne: user.id },
            },
            {
              $pull: {
                following: user.id,
              },
            }
          );
        }

        const follow = await models.Follow.findOne({ user: user.id })
          .populate('followers')
          .lean()
          .exec();

        return follow.followers;
      }
    ),
  },
};
