import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if ((session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // Get current date for format (DDMM)
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateFormat = `${day}${month}`;

    // Find the latest memo for this day/month
    const latestMemo = await prisma.memo.findFirst({
      where: {
        memoNumber: {
          contains: `/${dateFormat}`,
        },
      },
      orderBy: {
        memoNumber: 'desc',
      },
    });

    let nextNumber = 1;
    if (latestMemo) {
      // Extract the number from the memo number (MAM-0001A/DDMM)
      const match = latestMemo.memoNumber.match(/MAM-(\d+)A/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Format the number with leading zeros
    const formattedNumber = String(nextNumber).padStart(4, '0');
    const memoNumber = `MAM-${formattedNumber}A/${dateFormat}`;

    return NextResponse.json({ memoNumber });
  } catch (error) {
    console.error("Error generating memo number:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
