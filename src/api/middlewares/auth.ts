import config from '../../config';
import { IUser } from '../../interfaces/IUser';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { IContext } from '../../interfaces/IContext';

type jwtPayload = jwt.JwtPayload & { id: string };

/**
 * takes user object and create jwt out of it
 * using {id, username}
 * @param {Object} IUser
 */
export function createToken({ id, username }: IUser): string {
  return jwt.sign({ id, username }, config.jwtSecret, { expiresIn: '7d' });
}

/**
 * will attemp to verify a jwt and find a user in the db
 * @param {String} token jwt from client
 */
export async function getUserFromToken(token: string): Promise<IUser> {
  try {
    const userAuth = jwt.verify(token, config.jwtSecret) as jwtPayload;
    const user = await User.findById(userAuth.id).exec();
    return user;
  } catch (err) {
    return new Promise((resolve) => resolve(null));
  }
}

/**
 * Checks if the user in the context object
 * @param next Next resolver function
 */
export const authenticated =
  (next: unknown): any =>
  async (root: any, args: any, context: IContext, info: any): Promise<void> => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    if (typeof next === 'function') {
      return next(root, args, context, info);
    }
  };
