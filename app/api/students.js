import connectDB from "../../lib/db";
import User from "../../../../pages/models//User";
import { getSession } from 'next-auth';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await connectDB();
  const students = await User.find({ role: 'student' }).select('username _id');
  res.status(200).json(students);
}