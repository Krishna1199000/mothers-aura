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

    // Fetch all memos with related data
    const memos = await prisma.memo.findMany({
      select: {
        id: true,
        memoNumber: true,
        date: true,
        dueDate: true,
        totalDue: true,
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

    return NextResponse.json(memos);
  } catch (error) {
    console.error("Error fetching memos:", error);
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

    // Get the current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true }
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Create memo with items
    const memo = await prisma.memo.create({
      data: {
        memoNumber: data.memoNumber,
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
        createdById: currentUser.id,
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            carat: item.carat,
            color: item.color,
            clarity: item.clarity,
            lab: item.lab,
            reportNo: item.reportNo,
            pricePerCarat: item.pricePerCarat,
            total: item.total,
          }))
        }
      },
      include: {
        items: true,
        master: true,
      },
    });

    return NextResponse.json({
      message: "Memo created successfully",
      memo,
    });
  } catch (error) {
    console.error("Error creating memo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}







