import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

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

    const memo = await prisma.memo.findUnique({
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

    if (!memo) {
      return NextResponse.json(
        { error: "Memo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(memo);
  } catch (error) {
    console.error("Error fetching memo:", error);
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

    const data = await request.json();

    // Update memo
    const memo = await prisma.memo.update({
      where: { id },
      data: {
        date: new Date(data.date),
        dueDate: new Date(data.dueDate),
        paymentTerms: data.paymentTerms,
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
      await prisma.memoItem.deleteMany({
        where: { memoId: id },
      });

      // Create new items
      await prisma.memoItem.createMany({
        data: data.items.map((item: any) => ({
          memoId: id,
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
      message: "Memo updated successfully",
      memo,
    });
  } catch (error) {
    console.error("Error updating memo:", error);
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

    // Delete memo (items will be deleted automatically due to cascade)
    await prisma.memo.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Memo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting memo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}







