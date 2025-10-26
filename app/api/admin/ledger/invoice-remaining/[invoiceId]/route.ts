import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;
    
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get invoice details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { totalDue: true },
    });

    if (!invoice) {
      return Response.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Calculate total credits for this invoice
    const totalCredits = await prisma.ledger.aggregate({
      where: {
        invoiceId: invoiceId,
        type: "CREDIT",
      },
      _sum: { amount: true },
    });

    const creditedAmount = totalCredits._sum.amount || 0;
    const remainingAmount = (invoice.totalDue || 0) - creditedAmount;

    return Response.json({
      totalDue: invoice.totalDue,
      creditedAmount,
      remainingAmount: Math.max(0, remainingAmount),
    });
  } catch (error) {
    console.error("Invoice remaining amount error:", error);
    return Response.json(
      { error: "Failed to get invoice remaining amount" },
      { status: 500 }
    );
  }
}



