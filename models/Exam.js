import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true }
    }
  ],
  duration: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

export default mongoose.models.Exam || mongoose.model('Exam', examSchema);
