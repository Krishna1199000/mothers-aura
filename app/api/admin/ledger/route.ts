import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");
    const masterId = searchParams.get("masterId");

    // Build where clause
    const where: any = {};
    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }
    if (type) where.type = type;
    if (masterId) where.masterId = masterId;

    // Fetch ledger entries
    const entries = await prisma.ledger.findMany({
      where,
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
      orderBy: {
        date: "desc",
      },
    });

    // Calculate totals
    const totals = await prisma.ledger.groupBy({
      by: ["type"],
      where,
      _sum: {
        amount: true,
      },
    });

    const creditTotal = totals.find((t) => t.type === "CREDIT")?._sum.amount || 0;
    const debitTotal = totals.find((t) => t.type === "DEBIT")?._sum.amount || 0;

    return Response.json({
      entries,
      summary: {
        creditTotal,
        debitTotal,
        balance: creditTotal - debitTotal,
      },
    });
  } catch (error) {
    console.error("Ledger fetch error:", error);
    return Response.json(
      { error: "Failed to fetch ledger entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.date || !data.type || !data.amount || !data.masterId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If invoice is selected, validate amount
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

      if (data.amount > (invoice.totalDue || 0)) {
        return Response.json(
          { error: "Amount cannot exceed invoice total" },
          { status: 400 }
        );
      }
    }

    // Create ledger entry
    const entry = await prisma.ledger.create({
      data: {
        date: new Date(data.date),
        type: data.type,
        amount: data.amount,
        description: data.description,
        invoiceId: data.invoiceId,
        masterId: data.masterId,
        createdById: session.user.id,
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
    console.error("Ledger creation error:", error);
    return Response.json(
      { error: "Failed to create ledger entry" },
      { status: 500 }
    );
  }
}
