import mongoose from 'mongoose';

// Ensure that the MONGO_URI is defined
if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

// Check if there's already a cached connection.
// The global object in Node.js is similar to the window object in browsers.
let cached = global.mongoose;

if (!cached) {
  // If there's no existing cache, initialize one.
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // If there's an existing connection, return it
  if (cached.conn) {
    return cached.conn;
  }
  
  // Otherwise, if there's no promise, create one and cache it.
  if (!cached.promise) {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, options)
      .then((mongooseInstance) => {
        // Return an object that contains the DB connection
        return { db: mongooseInstance.connection.db };
      });
  }

  // Await the promise to finish and cache the connection.
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
