import { MongoDBAdapter } from '@auth/mongodb-adapter';
import mongoose from 'mongoose';
import { connectToDatabase } from '../db/mongoose';

let cachedClient: any = null;

async function getMongoClient() {
  if (!cachedClient) {
    await connectToDatabase();
    cachedClient = mongoose.connection.getClient();
  }
  return cachedClient;
}

export async function getMongoDBAdapter() {
  const client = await getMongoClient();
  return MongoDBAdapter(client) as any;
}
