import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase } from '../../src/server/db/mongoose';

let mongod: MongoMemoryServer | null = null;

export default async function globalSetup() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  await connectToDatabase();
}

export async function globalTeardown() {
  if (mongod) await mongod.stop();
}
