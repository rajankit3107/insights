import prisma from "@/lib/prisma";
import { generateOTP } from "@/utils/random-otp-generator";
import { signupSchema } from "@/validation/signup-schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/send-verification-mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data received" },
        { status: 400 }
      );
    }

    const { username, email, password } = body;

    // Check if a verified user already exists with same username
    const existingUserByUsername = await prisma.user.findFirst({
      where: { username, isVerified: true },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, message: "User already exists with this username" },
        { status: 400 }
      );
    }

    // Check for existing user by email
    const existingUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // CASE 1: Existing but verified
    if (existingUserByEmail && existingUserByEmail.isVerified) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // CASE 2: Existing but not verified → update their OTP and password
    if (existingUserByEmail && !existingUserByEmail.isVerified) {
      await prisma.user.update({
        where: { id: existingUserByEmail.id },
        data: {
          password: hashedPassword,
          verifyCode: otp,
          verifycodeExpiry: expiryDate,
        },
      });
    }

    // CASE 3: No existing user → create new
    if (!existingUserByEmail) {
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verifyCode: otp,
          verifycodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessages: true,
        },
      });
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, otp);

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signup successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
