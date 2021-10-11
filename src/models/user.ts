import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: String,
    bio: {
      type: String,
      maxlength: 130,
    },
    website: {
      type: String,
      maxlength: 65,
    },
    private: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    bookmarks: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'post',
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.method(
  'checkPassword',
  function (password: string): Promise<boolean> {
    const passwordHash = this.password;

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
);

const User = mongoose.model<IUser>('user', userSchema);

export default User;
