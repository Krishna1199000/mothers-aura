import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ source: string; id: string }> }
) {
  try {
    const { source, id } = await params;

    if (!source || !id) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Currently only Mothers Aura (internal inventory) is supported publicly
    if (source !== "mothersaura") {
      return NextResponse.json({ error: "Source not supported" }, { status: 404 });
    }

    const inv = await db.inventory.findUnique({ where: { id } });
    if (!inv) {
      return NextResponse.json({ error: "Diamond not found" }, { status: 404 });
    }

    // Expose a safe subset for customers
    const payload = {
      id: inv.id,
      stockId: inv.stockId,
      shape: inv.shape,
      carat: inv.carat,
      color: inv.color,
      clarity: inv.clarity,
      cut: inv.cut,
      polish: inv.polish,
      symmetry: inv.symmetry,
      lab: inv.lab,
      pricePerCarat: inv.askingAmount && inv.carat ? Number(inv.askingAmount) / Number(inv.carat) : null,
      amount: inv.askingAmount,
      imageUrl: inv.imageUrl,
      videoUrl: inv.videoUrl,
      certificateUrl: inv.certificateUrl,
      fluorescence: null,
      source: "mothersaura" as const,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Public diamond fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



