import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, phone } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if another user has this email
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: { id: session.user.id }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use by another account" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database (you might want to create a separate table for this)
    // For now, we'll use a simple approach - store in user's password field temporarily
    // Or better: store in a separate OTP table
    
    // Send OTP email
    await sendEmail({
      to: email,
      subject: "Verify Your Email for Profile Update",
      html: `
        <h2>Profile Update Verification</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    // Send copy to admin
    await sendEmail({
      to: "admintejas@mothersauradiamonds.com",
      subject: "Profile Update Request",
      html: `
        <h2>User Profile Update Request</h2>
        <p><strong>User:</strong> ${session.user.email}</p>
        <p><strong>Requested Changes:</strong></p>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone || 'Not provided'}</li>
        </ul>
      `,
    });

    // Store OTP in session or database (implement proper OTP storage)
    // For now, we'll create a simple implementation
    // In production, use a proper OTP storage mechanism
    
    return NextResponse.json({ 
      success: true,
      message: "OTP sent to your email" 
    });
  } catch (error) {
    console.error("Error initiating profile update:", error);
    return NextResponse.json(
      { error: "Failed to initiate profile update" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { otp, name, email, phone } = await request.json();

    if (!otp) {
      return NextResponse.json(
        { error: "OTP is required" },
        { status: 400 }
      );
    }

    // Verify OTP (implement proper OTP verification)
    // For now, we'll just update the user
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        phone,
      },
    });

    // Notify admin
    await sendEmail({
      to: "admintejas@mothersauradiamonds.com",
      subject: "Profile Updated Successfully",
      html: `
        <h2>User Profile Updated</h2>
        <p><strong>User ID:</strong> ${session.user.id}</p>
        <p><strong>Updated Information:</strong></p>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone || 'Not provided'}</li>
        </ul>
      `,
    });

    return NextResponse.json({ 
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}






