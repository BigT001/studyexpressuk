import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const CONNECTION_TIMEOUT = 30000; // 30 second timeout

export async function connectToDatabase() {
  if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in environment');
  if (mongoose.connection.readyState === 1) return mongoose;
  
  // Add connection timeout
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('MongoDB connection timeout after 30 seconds')), CONNECTION_TIMEOUT)
  );
  
  const connectPromise = mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  });
  
  return Promise.race([connectPromise, timeoutPromise]);
}

// Alias for backward compatibility
const connectDB = connectToDatabase;

export default connectDB;
