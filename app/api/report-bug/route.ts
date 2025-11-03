import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { subject, description } = await request.json();

    if (!subject || !description) {
      return NextResponse.json(
        { error: "Subject and description are required" },
        { status: 400 }
      );
    }

    // Send email to admin
    await sendEmail({
      to: "tejas@mothersauradiamonds.com",
      subject: `Bug Report: ${subject}`,
      html: `
        <h2>New Bug Report</h2>
        <p><strong>From:</strong> ${session.user.email} (${session.user.name})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Description:</h3>
        <p>${description.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ 
      success: true,
      message: "Bug report sent successfully" 
    });
  } catch (error) {
    console.error("Error sending bug report:", error);
    return NextResponse.json(
      { error: "Failed to send bug report" },
      { status: 500 }
    );
  }
}







