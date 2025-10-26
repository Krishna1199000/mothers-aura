import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const ledgerId = id;

    // Validate required fields
    if (!data.date || !data.type || !data.amount || !data.masterId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the existing ledger entry
    const existingEntry = await prisma.ledger.findUnique({
      where: { id: ledgerId },
      include: { invoice: true },
    });

    if (!existingEntry) {
      return Response.json(
        { error: "Ledger entry not found" },
        { status: 404 }
      );
    }

    // If invoice is selected, validate amount against total credits
    if (data.invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: data.invoiceId },
        select: { totalDue: true },
      });

      if (!invoice) {
        return Response.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }

      // Calculate total credits for this invoice (excluding current entry if it's being updated)
      const totalCredits = await prisma.ledger.aggregate({
        where: {
          invoiceId: data.invoiceId,
          type: "CREDIT",
          id: { not: ledgerId }, // Exclude current entry
        },
        _sum: { amount: true },
      });

      const currentTotalCredits = (totalCredits._sum.amount || 0) + data.amount;

      if (invoice.totalDue && currentTotalCredits > invoice.totalDue) {
        const remainingAmount = invoice.totalDue - (totalCredits._sum.amount || 0);
        return Response.json(
          { 
            error: `Cannot credit $${data.amount}. Invoice total is $${invoice.totalDue}, already credited $${totalCredits._sum.amount || 0}. Maximum additional credit allowed: $${remainingAmount}` 
          },
          { status: 400 }
        );
      }
    }

    // Update ledger entry
    const entry = await prisma.ledger.update({
      where: { id: ledgerId },
      data: {
        date: new Date(data.date),
        type: data.type,
        amount: data.amount,
        description: data.description,
        invoiceId: data.invoiceId,
        masterId: data.masterId,
      },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            totalDue: true,
          },
        },
        master: {
          select: {
            companyName: true,
          },
        },
      },
    });

    return Response.json(entry);
  } catch (error) {
    console.error("Ledger update error:", error);
    return Response.json(
      { error: "Failed to update ledger entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: ledgerId } = await params;
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the ledger entry before deleting
    const entry = await prisma.ledger.findUnique({
      where: { id: ledgerId },
      include: { invoice: true },
    });

    if (!entry) {
      return Response.json(
        { error: "Ledger entry not found" },
        { status: 404 }
      );
    }

    // Delete the ledger entry
    await prisma.ledger.delete({
      where: { id: ledgerId },
    });

    return Response.json({ message: "Ledger entry deleted successfully" });
  } catch (error) {
    console.error("Ledger deletion error:", error);
    return Response.json(
      { error: "Failed to delete ledger entry" },
      { status: 500 }
    );
  }
}



