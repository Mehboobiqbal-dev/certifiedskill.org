
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  if (!process.env.MONGO_URI) {
    console.error('No MONGO_URI');
    process.exit(1);
  }
  
  console.log('Attempting to connect...');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 
    });
    console.log('Connection successful!');
    console.log('State:', mongoose.connection.readyState);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
