import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();
const db = prisma as any;

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

    // Find the latest invoice globally (do not reset by date)
    const latestInvoice = await db.invoice.findFirst({
      orderBy: {
        sequenceNum: 'desc',
      },
    });

    const nextNumber = (latestInvoice?.sequenceNum ?? 0) + 1;

    // Format the number with leading zeros
    const formattedNumber = String(nextNumber).padStart(4, '0');
    const invoiceNumber = `MA-${formattedNumber}A/${dateFormat}`;

    return NextResponse.json({ invoiceNumber });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
