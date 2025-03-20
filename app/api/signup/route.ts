// app/api/signup/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../models/user";
import connectToDatabase from "../../../lib/db";

export async function POST(request: Request) {
  await connectToDatabase();

  const body = await request.json();
  const { name, email, password, confirmPassword } = body;

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
