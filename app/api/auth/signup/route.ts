import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";
import { verifyOTP } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp, 'signup');
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Get stored signup data
    const signupData = await prisma.verificationToken.findFirst({
      where: {
        identifier: `signup-data:${email}`,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!signupData) {
      return NextResponse.json(
        { error: "Signup session expired" },
        { status: 400 }
      );
    }

    const { name, password, phone } = JSON.parse(signupData.token);

    // Delete the stored signup data
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: signupData.identifier,
          token: signupData.token,
        },
      },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with default CUSTOMER role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'CUSTOMER',
        emailVerified: new Date(), // Mark email as verified since OTP was validated
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    });

    return NextResponse.json(
      { 
        message: "User created successfully",
        user 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
