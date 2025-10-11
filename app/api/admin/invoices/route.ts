import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    // Build where clause
    const where: any = {};

    // For employees, only show invoices they created
    if ((session.user as any)?.role === "EMPLOYEE") {
      where.createdById = session.user.id;
    }

    // Fetch all invoices with related data
    const invoices = await db.invoice.findMany({
      where,
      select: {
        id: true,
        invoiceNumber: true,
        date: true,
        dueDate: true,
        totalDue: true,
        createdById: true,
        master: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Basic validation to avoid runtime errors
    if (!data.masterId || typeof data.masterId !== 'string') {
      return NextResponse.json(
        { error: "masterId is required" },
        { status: 400 }
      );
    }
    if (!data.invoiceNumber || typeof data.invoiceNumber !== 'string') {
      return NextResponse.json(
        { error: "invoiceNumber is required" },
        { status: 400 }
      );
    }

    // Create invoice with items
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        date: data.date ? new Date(data.date) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        paymentTerms: typeof data.paymentTerms === 'string' ? data.paymentTerms : String(data.paymentTerms ?? ''),
        emailPdf: data.emailPdf,
        masterId: data.masterId,
        description: data.description,
        shipmentCost: typeof data.shipmentCost === 'number' ? data.shipmentCost : 0,
        discount: typeof data.discount === 'number' ? data.discount : 0,
        crPayment: typeof data.crPayment === 'number' ? data.crPayment : 0,
        subtotal: typeof data.subtotal === 'number' ? data.subtotal : 0,
        totalDue: typeof data.totalDue === 'number' ? data.totalDue : 0,
        createdById: session.user.id as string,
        items: data.items && Array.isArray(data.items) ? {
          create: (data.items as Array<{
            description: string;
            carat: number;
            color: string;
            clarity: string;
            lab: string;
            reportNo: string;
            pricePerCarat: number;
            total: number;
          }>).
            filter((item) => Number.isFinite(item.carat) && Number.isFinite(item.pricePerCarat) && Number.isFinite(item.total)).
            map((item) => ({
              description: item.description ?? '',
              carat: item.carat ?? 0,
              color: item.color ?? null,
              clarity: item.clarity ?? null,
              lab: item.lab ?? null,
              reportNo: item.reportNo ?? null,
              pricePerCarat: item.pricePerCarat ?? 0,
              total: item.total ?? 0,
            }))
        } : undefined
      },
      include: {
        items: true,
        master: true,
      },
    });

    return NextResponse.json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}







