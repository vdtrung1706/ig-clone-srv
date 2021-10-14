import { AuthenticationError } from 'apollo-server-errors';
import { IContext as IContext } from '../../interfaces/context.interfaces';
import { IUser } from '../../interfaces/user.interfaces';

type AuthUser = {
  token: string;
  user: IUser;
};
type InputType = {
  input: any;
};

export default {
  Mutation: {
    signin: async (
      _: unknown,
      { input }: InputType,
      context: IContext
    ): Promise<AuthUser> => {
      const user = await context.models.User.findOne({
        email: input.email,
      }).exec();
      if (!user) {
        throw new AuthenticationError('Invalid password or email');
      }

      const match = await user.checkPassword(input.password);
      if (!match) {
        throw new AuthenticationError('Invalid password or email');
      }

      const token = context.createToken(user);

      return { token, user };
    },
    signup: async (
      _: unknown,
      { input }: InputType,
      { createToken, models }: IContext
    ): Promise<AuthUser> => {
      const existing = await models.User.findOne({ email: input.email }).exec();
      if (existing) {
        throw new AuthenticationError('Account existed!');
      }

      const user = await models.User.create(input);
      const token = createToken(user);

      return { token, user };
    },
  },
};
