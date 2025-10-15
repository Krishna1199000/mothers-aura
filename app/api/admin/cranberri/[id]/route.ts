import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorization: Only ADMIN or EMPLOYEE can view Cranberri diamond details
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const cranberriDiamond = await db.cranberriDiamond.findUnique({
      where: { id },
    });

    if (!cranberriDiamond) {
      return NextResponse.json(
        { error: "Cranberri Diamond not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cranberriDiamond);
  } catch (error) {
    console.error("Error fetching Cranberri diamond details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
