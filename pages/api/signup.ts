import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import User from '../../models/user';
import connectToDatabase from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check for correct Content-Type header
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return res
      .status(400)
      .json({ message: 'Content-Type must be application/json' });
  }

  try {
    // Parse body (Next.js automatically parses JSON for API routes if the header is set)
    const { name, email, password, confirmPassword, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }

    // Check that the passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: 'Passwords do not match' });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    await newUser.save();

    // Respond with a success message
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in register API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
