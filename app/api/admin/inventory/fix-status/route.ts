import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update all inventory rows
    const result = await db.inventory.updateMany({
      data: {
        status: "AVAILABLE",
        heldByCompany: null,
      },
    });

    return NextResponse.json({ success: true, updated: result.count });
  } catch (error) {
    console.error("Bulk fix error:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}



