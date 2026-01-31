
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
});
const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);

async function listExams() {
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
    
    const exams = await Exam.find({});
    console.log(`Found ${exams.length} exams:`);
    exams.forEach(e => console.log(`- ID: ${e._id}, Title: "${e.title}"`));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('Connection failed:', error.message);
    process.exit(1);
  }
}

listExams();
