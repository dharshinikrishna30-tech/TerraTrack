import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      await mongoose.connect(mongoUri);
      console.log(`Connected to MongoDB successfully: ${mongoose.connection.host}`);
      return;
    }

    // Fallback to in-memory MongoDB runner
    console.log('No external MONGODB_URI detected. Initializing Embedded In-Memory MongoDB Engine...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to In-Memory MongoDB instance at: ${uri}`);
  } catch (error) {
    console.error('Initial MongoDB connection error:', error.message);
    try {
      console.log('Attempting in-memory MongoDB fallback...');
      if (!mongoMemoryServer) {
        mongoMemoryServer = await MongoMemoryServer.create();
      }
      const fallbackUri = mongoMemoryServer.getUri();
      await mongoose.connect(fallbackUri);
      console.log(`Fallback succeeded! Connected to in-memory MongoDB: ${fallbackUri}`);
    } catch (fallbackError) {
      console.error('Critical database initialization failure:', fallbackError);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error('Error during database teardown:', error);
  }
};
