import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export async function connectToDb(): Promise<void> {
  await mongoose.connect(process.env.DB_TESTING_URL);
}

export async function dropDb(): Promise<boolean> {
  if (mongoose.connection.readyState === 1) {
    return await mongoose.connection.db.dropDatabase();
  }
  return false;
}

export async function disconnectDb(): Promise<void> {
  return await mongoose.disconnect();
}

export function generateMongooseId(): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId();
}
