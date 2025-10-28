import { NextRequest, NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(`Testing email to: ${email}`);

    // Send a test OTP email
    await sendOTPEmail(email, "123456", "signup");

    return NextResponse.json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send test email", 
        details: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code || "UNKNOWN"
      },
      { status: 500 }
    );
  }
}
