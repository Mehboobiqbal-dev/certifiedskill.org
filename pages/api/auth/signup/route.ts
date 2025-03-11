import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "../../../models/user";
import connectToDatabase from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password, confirmPassword, recaptchaToken } =
      await request.json();

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !recaptchaToken
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // (ReCAPTCHA logic omitted if you wish to remove it)

    await connectToDatabase();

    // Cast to any to avoid union overload issues with findOne
    const existingUser = await (User as any).findOne({ email }).exec();
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
