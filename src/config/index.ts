import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export default {
  dbURL: process.env.DB_URL,
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
  api: {
    prefix: '/api',
  },
};
