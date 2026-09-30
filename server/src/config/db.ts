import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  if (isConnected) return true;

  const uri = ENV.MONGODB_URI.trim();

  // Check if URI is default placeholder or missing
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️ [Database Warning] MONGODB_URI is not configured with valid Atlas credentials in .env.');
    console.warn('⚡ CampusConnect is running with its Built-in Resilient Storage Engine.');
    console.warn('   All CRUD operations, registrations, CSV exports, and JWT auth will work seamlessly.');
    console.warn('   To sync with your MongoDB Atlas cluster, update MONGODB_URI in server/.env\n');
    return false;
  }

  try {
    console.log('🔄 Attempting connection to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`\n⚠️ [Database Warning] Could not connect to MongoDB Atlas (${error.message}).`);
    console.warn('⚡ CampusConnect falling back to Built-in Resilient Storage Engine.');
    console.warn('   The full website and admin panel will continue to function flawlessly.\n');
    return false;
  }
};

export const getDbStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'Built-in Engine',
  };
};
