import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  // add any other fields you need
});

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
