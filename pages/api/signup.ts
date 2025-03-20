// pages/api/signup.ts

import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import connectToDatabase from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests.
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }

  // Connect to the database.
  await connectToDatabase();

  const { name, email, password, confirmPassword } = req.body;

  // Basic validations.
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Check if a user with the given email already exists.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password before saving.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user.
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully!" });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
