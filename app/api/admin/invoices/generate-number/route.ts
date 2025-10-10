import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current user's role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
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

    // Find the latest invoice for this day/month
    const latestInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          contains: `/${dateFormat}`,
        },
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
    });

    let nextNumber = 1;
    if (latestInvoice) {
      // Extract the number from the invoice number (MA-0001A/DDMM)
      const match = latestInvoice.invoiceNumber.match(/MA-(\d+)A/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

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
