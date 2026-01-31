
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkCertificates() {
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
    
    // Check for specific certificate IDs
    const idsToCheck = [
        "0195e970-ea78-461b-a4c8-33c258ddf8b6", 
        "4c205170-7ce3-443b-953e-b2eb7018eae9"
    ];
    
    // Check 'certificates' collection directly via driver to avoid schema/model mismatch
    const db = mongoose.connection.db;
    
    console.log("\n--- Checking 'certificates' collection ---");
    const collection = db.collection('certificates');
    
    for (const id of idsToCheck) {
        const cert = await collection.findOne({ certificateId: id });
        if (cert) {
            console.log(`[FOUND] ID: ${id}`);
            console.log(JSON.stringify(cert, null, 2));
        } else {
            console.log(`[NOT FOUND] ID: ${id}`);
        }
    }
    
    // Also list all to see what's actually there
    console.log("\n--- Listing all certificates (first 5) ---");
    const all = await collection.find({}).limit(5).toArray();
    console.log(`Total count: ${await collection.countDocuments()}`);
    all.forEach(c => console.log(`- ID: ${c.certificateId}, User: ${c.userName}, Exam: ${c.examName}`));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
}

checkCertificates();
