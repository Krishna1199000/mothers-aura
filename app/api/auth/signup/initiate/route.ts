import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { generateOTP, storeOTP, sendOTPEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    console.log('Signup initiate request:', { name, email, phone });

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    
    await storeOTP(email, otp, 'signup');
    console.log('OTP stored successfully');

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, 'signup');
      console.log('OTP email sent successfully');
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Don't fail the signup process if email fails, just log it
      // The user can still complete signup with the OTP stored in database
    }

    // Store signup data temporarily
    await prisma.verificationToken.create({
      data: {
        identifier: `signup-data:${email}`,
        token: JSON.stringify({ name, email, password, phone }),
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      },
    });

    return NextResponse.json(
      { 
        message: "OTP sent successfully",
        email 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup initiation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
