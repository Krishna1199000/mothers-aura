import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const masterId = searchParams.get("masterId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    // Build where clause for ledger entries
    const where: any = {};
    if (masterId) {
      where.masterId = masterId;
    }
    if (fromDate || toDate) {
      where.date = {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      };
    }

    // Get all relevant masters
    const masters = await db.master.findMany({
      where: masterId ? { id: masterId } : {},
      select: {
        id: true,
        companyName: true,
      },
    });

    // Get transactions for each master
    const reports = await Promise.all(
      masters.map(async (master) => {
        // Get all invoices
        const invoices = await db.invoice.findMany({
          where: {
            masterId: master.id,
            ...(fromDate && { date: { gte: new Date(fromDate) } }),
            ...(toDate && { date: { lte: new Date(toDate) } }),
          },
          select: {
            id: true,
            date: true,
            invoiceNumber: true,
            totalDue: true,
          },
        });

        // Get all ledger entries
        const ledgerEntries = await db.ledger.findMany({
          where: {
            masterId: master.id,
            ...(fromDate && { date: { gte: new Date(fromDate) } }),
            ...(toDate && { date: { lte: new Date(toDate) } }),
          },
          select: {
            id: true,
            date: true,
            type: true,
            amount: true,
            description: true,
            invoice: {
              select: {
                invoiceNumber: true,
              },
            },
          },
        });

        // Calculate totals
        const totalPurchase = invoices.reduce((sum, inv) => sum + (inv.totalDue || 0), 0);
        const totalPayment = ledgerEntries
          .filter(entry => entry.type === "CREDIT")
          .reduce((sum, entry) => sum + entry.amount, 0);

        // Combine transactions
        const transactions = [
          ...invoices.map(inv => ({
            id: inv.id,
            date: inv.date?.toISOString() || "",
            type: "PURCHASE",
            description: "Invoice Purchase",
            amount: inv.totalDue || 0,
            invoiceNumber: inv.invoiceNumber,
          })),
          ...ledgerEntries.map(entry => ({
            id: entry.id,
            date: entry.date.toISOString(),
            type: entry.type,
            description: entry.description,
            amount: entry.amount,
            invoiceNumber: entry.invoice?.invoiceNumber,
          })),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
          master,
          transactions,
          totalPurchase,
          totalPayment,
          outstandingAmount: totalPurchase - totalPayment,
        };
      })
    );

    // If specific master was requested, return single report, otherwise return all
    return NextResponse.json(
      masterId ? reports[0] : {
        transactions: reports.flatMap(r => r.transactions),
        totalPurchase: reports.reduce((sum, r) => sum + r.totalPurchase, 0),
        totalPayment: reports.reduce((sum, r) => sum + r.totalPayment, 0),
        outstandingAmount: reports.reduce((sum, r) => sum + r.outstandingAmount, 0),
      }
    );
  } catch (error) {
    console.error("Error generating outstanding report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}






