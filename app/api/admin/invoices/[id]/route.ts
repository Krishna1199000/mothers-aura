import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();
const db = prisma as any;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        master: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const data = await request.json();

    // Update invoice
    const invoice = await db.invoice.update({
      where: { id },
      data: {
        date: new Date(data.date),
        dueDate: new Date(data.dueDate),
        paymentTerms: data.paymentTerms ? String(data.paymentTerms) : null,
        emailPdf: data.emailPdf,
        masterId: data.masterId,
        description: data.description,
        shipmentCost: data.shipmentCost,
        discount: data.discount,
        crPayment: data.crPayment,
        subtotal: data.subtotal,
        totalDue: data.totalDue,
      },
    });

    // Update items
    if (data.items) {
      // Delete existing items
      await db.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      // Create new items
      await db.invoiceItem.createMany({
        data: data.items.map((item: {
          description: string;
          carat: number;
          color: string;
          clarity: string;
          lab: string;
          reportNo: string;
          pricePerCarat: number;
          total: number;
        }) => ({
          invoiceId: id,
          description: item.description,
          carat: item.carat,
          color: item.color,
          clarity: item.clarity,
          lab: item.lab,
          reportNo: item.reportNo,
          pricePerCarat: item.pricePerCarat,
          total: item.total,
        })),
      });
    }

    return NextResponse.json({
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Delete invoice (items will be deleted automatically due to cascade)
    await db.invoice.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
