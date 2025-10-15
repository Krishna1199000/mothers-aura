import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncKyrahDiamondsBatch } from "@/lib/api/kyrah-sync-batch";
import db from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // Get the latest sync status
    const latestSync = await db.kyrahSync.findFirst({
      orderBy: { lastSyncAt: 'desc' },
    });

    // Get diamond count
    const diamondCount = await db.kyrahDiamond.count();

    return NextResponse.json({
      latestSync,
      diamondCount,
    });
  } catch (error) {
    console.error("Error fetching Kyrah sync status:", error);
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

    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const result = await syncKyrahDiamondsBatch();

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in Kyrah sync endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
