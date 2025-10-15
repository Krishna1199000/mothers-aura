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

    const { id } = await params;
    const diamond = await db.kyrahDiamond.findUnique({
      where: { id },
    });

    if (!diamond) {
      return NextResponse.json(
        { error: "Diamond not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(diamond);
  } catch (error) {
    console.error("Error fetching Kyrah diamond:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


