import dotenv from 'dotenv';

dotenv.config();

export default {
  dbURL: process.env.DB_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};
