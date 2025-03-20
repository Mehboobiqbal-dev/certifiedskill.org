// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "../../../models/user";
import connectToDatabase from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }

  console.log("Received signup request", req.body);

  try {
    await connectToDatabase();
  } catch (error) {
    console.error("DB connection error:", error);
    return res.status(500).json({ message: "Database connection failed." });
  }

  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    console.error("Missing fields:", req.body);
    return res.status(400).json({ message: "All fields are required." });
  }
  if (password !== confirmPassword) {
    console.error("Password mismatch:", req.body);
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User already exists:", email);
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}
