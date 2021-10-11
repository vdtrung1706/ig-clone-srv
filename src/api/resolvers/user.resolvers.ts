import { IContext } from '../../interfaces/IContext';
import { authenticated } from '../middlewares/auth';

export default {
  Query: {
    users: authenticated(async (_, __, context: IContext) => {
      const users = await context.models.User.find({});
      return users;
    }),
  },
};
