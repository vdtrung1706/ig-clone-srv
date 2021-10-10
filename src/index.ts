import * as db from './db';
import config from './config';
import User from './models/user';

db.connect(config.dbURL).then(async () => {
  console.log('DB Connected!');

  const user = await User.create({
    email: 'vdtrung1706@gmail.com',
    username: 'vdtru',
    password: 'trung1234',
  });

  console.log(user._id, user.email);
});
