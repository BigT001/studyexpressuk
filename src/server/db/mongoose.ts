import mongoose from 'mongoose';

// Set global mongoose options
mongoose.set('bufferTimeoutMS', 30000); // 30 second buffer timeout for queries

const MONGODB_URI = process.env.MONGODB_URI || '';
const CONNECTION_TIMEOUT = 30000; // 30 second timeout (reduced from 60)
const MAX_RETRIES = 2; // Reduced from 3 to 2
const RETRY_DELAY = 1000; // Reduced from 2000 to 1 second between retries

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in environment');
  
  // Return cached connection if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  
  // Use cached connection if available
  if (cachedConnection) {
    return cachedConnection;
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[MongoDB] Connection attempt ${attempt}/${MAX_RETRIES}`);
      
      // Add connection timeout
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`MongoDB connection timeout after ${CONNECTION_TIMEOUT / 1000} seconds`)), CONNECTION_TIMEOUT)
      );
      
      const connectPromise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // Reduced from 60000
        socketTimeoutMS: 30000, // Reduced from 60000
        connectTimeoutMS: 30000, // Reduced from 60000
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 45000,
        retryWrites: true,
        w: 'majority',
        retryReads: true,
      });
      
      const result = await Promise.race([connectPromise, timeoutPromise]);
      cachedConnection = result;
      console.log('[MongoDB] Connection established successfully');
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[MongoDB] Connection attempt ${attempt} failed:`, lastError.message);
      
      // Reset mongoose connection state on failure
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
      
      // Don't retry if it's the last attempt
      if (attempt === MAX_RETRIES) {
        break;
      }
      
      // Wait before retrying
      console.log(`[MongoDB] Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  // All retries exhausted
  cachedConnection = null;
  const errorMsg = lastError?.message || 'Unknown error';
  console.error('[MongoDB] All connection attempts failed:', errorMsg);
  throw new Error(`MongoDB connection failed after ${MAX_RETRIES} attempts: ${errorMsg}`);
}

// Alias for backward compatibility
const connectDB = connectToDatabase;

export default connectDB;
