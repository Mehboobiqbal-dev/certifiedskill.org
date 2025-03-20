import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../models/user";
import connectToDatabase from "../../../lib/db";

// This function handles POST requests
export async function POST(request: Request) {
  // Connect to the database
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("DB connection error:", error);
    return NextResponse.json(
      { message: "Database connection failed." },
      { status: 500 }
    );
  }

  // Parse the JSON request body
  const body = await request.json();
  const { name, email, password, confirmPassword } = body;

  // Validate the incoming request
  if (!name || !email || !password || !confirmPassword) {
    console.error("Missing fields:", body);
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    console.error("Password mismatch:", body);
    return NextResponse.json(
      { message: "Passwords do not match." },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User already exists:", email);
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
