import { Schema, model } from 'mongoose';
import { IFollow } from '../interfaces/follow.interfaces';

const followSchema = new Schema<IFollow>({
  user: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

const Follow = model<IFollow>('follow', followSchema);

export default Follow;