import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    // Parse request JSON
    const { name, email, password, confirmPassword, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student", // Default role is "student"
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    // Log and return an error response
    console.error("Error in register API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}