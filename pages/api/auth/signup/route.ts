import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/app/models/user";
import connectToDatabase from "@/app/lib/mongodb";

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

   
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          message: "Server misconfiguration: reCAPTCHA secret key missing",
        },
        { status: 500 }
      );
    }

    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: recaptchaToken, 
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
     
      console.error(
        "reCAPTCHA verification failed:",
        recaptchaData["error-codes"]
      );
      return NextResponse.json(
        { message: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

   
    await connectToDatabase();

   
    const existingUser = await User.findOne({ email });
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
