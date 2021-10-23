import { Schema, model } from 'mongoose';
import { IFollow } from '../interfaces';

const followSchema = new Schema<IFollow>({
  user: {
    type: Schema.Types.ObjectId,
    require: true,
    unique: true,
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
