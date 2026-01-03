import { MongoDBAdapter } from '@auth/mongodb-adapter';
import mongoose from 'mongoose';

let cachedClient: any = null;

async function getMongoClient() {
  if (!cachedClient) {
    await mongoose.connect(process.env.MONGODB_URI || '');
    cachedClient = mongoose.connection.getClient();
  }
  return cachedClient;
}

export async function getMongoDBAdapter() {
  const client = await getMongoClient();
  return MongoDBAdapter(client) as any;
}
