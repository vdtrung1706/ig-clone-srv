import { AuthenticationError } from 'apollo-server-errors';
import { IContext as IContext } from '../../interfaces/IContext';
import { IUser } from '../../interfaces/IUser';

type AuthUser = {
  token: string;
  user: IUser;
};

export default {
  Mutation: {
    signin: async (
      _: unknown,
      { input }: { input: any },
      context: IContext
    ): Promise<AuthUser> => {
      const user = await context.models.User.findOne(input);
      if (!user) {
        throw new AuthenticationError('Invalid password + email');
      }
      const token = context.createToken(user);

      return { token, user };
    },
  },
};
