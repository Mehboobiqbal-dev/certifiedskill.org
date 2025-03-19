import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    // Verify that the request has the proper Content-Type header
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    // Parse the request body as JSON
    const { name, email, password, confirmPassword, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Validate email format using a simple regex test
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // Ensure that the password is sufficiently long
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check that the passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    // Connect to MongoDB; ensure your connectToDatabase() function handles connection errors
    await connectToDatabase();

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password securely using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user; note that the default role is "student"
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    await newUser.save();

    // Respond with a successful registration message
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    // Log the error details for debugging
    console.error("Error in register API:", error);
    // Return a JSON-formatted error instead of letting an HTML error response slip through
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
