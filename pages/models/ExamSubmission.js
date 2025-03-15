import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  answers: [String],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ExamSubmission || mongoose.model('ExamSubmission', SubmissionSchema);