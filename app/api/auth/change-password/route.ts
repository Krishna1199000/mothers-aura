import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateOTP, storeOTP, verifyOTP, sendOTPEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Initiate password change
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword } = await request.json();
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    // Verify current password
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user?.password) {
      return NextResponse.json(
        { error: "Invalid user" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(session.user.email, otp, 'password-change');

    // Send OTP email
    await sendOTPEmail(session.user.email, otp, 'password-change');

    return NextResponse.json(
      { 
        message: "OTP sent successfully",
        email: session.user.email
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password initiation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Complete password change with OTP
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { otp, newPassword } = await request.json();
    if (!otp || !newPassword) {
      return NextResponse.json(
        { error: "OTP and new password are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(session.user.email, otp, 'password-change');
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


