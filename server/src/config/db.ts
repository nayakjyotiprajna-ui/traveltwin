import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && uri.trim() !== '') {
      console.log(`Connecting to specified MongoDB URI: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log('✓ Successfully connected to MongoDB Database');
      return;
    }
  } catch (err: any) {
    console.warn(`External MongoDB connection failed (${err.message}). Falling back to development MongoDB Memory Server...`);
  }

  // Development In-Memory Mongo fallback
  try {
    console.log('Starting Development MongoDB Memory Server...');
    mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log(`✓ Development MongoDB Memory Server connected at: ${memUri}`);
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
