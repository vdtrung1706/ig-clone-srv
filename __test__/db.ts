import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export async function connectToDb(endoint: string): Promise<void> {
  await mongoose.connect(process.env.DB_TESTING_URL + `-${endoint}`);
}

export async function dropDb(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db
      .dropDatabase()
      .catch((err) => console.log(err));
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}

export function generateMongooseId(): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId();
}
