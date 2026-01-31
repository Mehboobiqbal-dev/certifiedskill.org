// lib/db.js
import mongoose from 'mongoose';

if (!process.env.MONGO_URI) {
  // Only throw an error if NOT building (to avoid build-time crashes on Vercel)
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
     // throw new Error('Please define the MONGO_URI environment variable');
     console.warn('WARN: MONGO_URI is not defined');
  }
}

// Use a global variable to cache the connection in development.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
