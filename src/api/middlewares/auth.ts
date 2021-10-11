/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import config from '../../config';
import { IUser } from '../../interfaces/IUser';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { IContext } from '../../interfaces/IContext';

export function createToken({ id, username }: IUser): string {
  return jwt.sign({ id, username }, config.jwtSecret, { expiresIn: '7d' });
}

export async function getUserFromToken(token: string): Promise<IUser> | null {
  const userAuth = jwt.verify(token, config.jwtSecret) as
    | string
    | (jwt.JwtPayload & {
        id: string;
      });

  if (typeof userAuth !== 'string') {
    return await User.findOne({ id: userAuth.id });
  }
  return null;
}

/**
 * Checks if the user in the context object
 * @param next Next resolver function
 */
export const authenticated =
  (next: any) => async (root: any, args: any, context: IContext, info: any) => {
    if (context.token) {
      const user = await getUserFromToken(context.token);
      if (!user) {
        throw new Error('Not authenticated');
      }
    } else {
      throw new Error('Not authenticated');
    }

    return next(root, args, context, info);
  };
