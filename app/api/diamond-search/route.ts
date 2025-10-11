import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
const db = prisma as any;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Build where clause for search
    const where: any = {
      OR: [
        { stockId: { contains: query, mode: "insensitive" } },
        { shape: { contains: query, mode: "insensitive" } },
        { color: { contains: query, mode: "insensitive" } },
        { clarity: { contains: query, mode: "insensitive" } },
        { cut: { contains: query, mode: "insensitive" } },
        { certificateNo: { contains: query, mode: "insensitive" } },
        { lab: { contains: query, mode: "insensitive" } },
      ],
    };

    // Only show available items for customers
    if ((session.user as any)?.role === "CUSTOMER") {
      where.status = "AVAILABLE";
    }

    // For employees, only show items they created
    if ((session.user as any)?.role === "EMPLOYEE") {
      where.createdById = session.user.id;
    }

    const inventory = await db.inventory.findMany({
      where,
      select: {
        id: true,
        stockId: true,
        shape: true,
        carat: true,
        color: true,
        clarity: true,
        cut: true,
        certificateNo: true,
        lab: true,
        pricePerCarat: true,
        amount: true,
        status: true,
        imageUrl: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Diamond search error:", error);
    return NextResponse.json(
      { error: "Failed to search diamonds" },
      { status: 500 }
    );
  }
}
