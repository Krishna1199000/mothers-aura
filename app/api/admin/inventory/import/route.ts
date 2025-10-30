import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "public", "csvjsoncranberri.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Source file not found" }, { status: 404 });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const rows = JSON.parse(raw) as Array<Record<string, any>>;

    let created = 0;
    let updated = 0;

    for (const row of rows) {
      const stockId: string = String(row["Stock ID"] ?? "").trim();
      if (!stockId) continue;

      const shape = String(row["Shape"] ?? "").trim() || "Unknown";
      const carat = Number(row["Carat"] ?? 0) || 0;
      const color = String(row["Color"] ?? "").trim() || "";
      const clarity = String(row["Clarity"] ?? "").trim() || "";
      const cut = String(row["Cut"] ?? "").trim() || undefined;
      const polish = String(row["Polish"] ?? "").trim() || "";
      const symmetry = String(row["Sym"] ?? "").trim() || "";
      const lab = String(row["Lab"] ?? "").trim() || "-";
      const amount = Number(row["Amount"] ?? 0) || 0;
      // Ignore held-by-company and force status to AVAILABLE for all rows
      const heldByCompany = null;
      const status = "AVAILABLE";

      const askingAmount = amount;

      const result = await db.inventory.upsert({
        where: { stockId },
        update: {
          heldByCompany: undefined,
          status,
          shape,
          carat,
          color,
          clarity,
          cut,
          polish,
          symmetry,
          lab,
          askingAmount,
          greenAmount: askingAmount,
          redAmount: askingAmount,
          superRedAmount: askingAmount,
          imageUrl: undefined,
          videoUrl: undefined,
          certificateUrl: undefined,
          measurement: undefined,
          location: undefined,
        },
        create: {
          stockId,
          heldByCompany: undefined,
          status,
          shape,
          carat,
          color,
          clarity,
          cut,
          polish,
          symmetry,
          lab,
          askingAmount,
          greenAmount: askingAmount,
          redAmount: askingAmount,
          superRedAmount: askingAmount,
          imageUrl: undefined,
          videoUrl: undefined,
          certificateUrl: undefined,
          measurement: undefined,
          location: undefined,
          createdById: (session.user as any).id as string,
        },
      });

      if ((result as any).createdAt.getTime() === (result as any).updatedAt.getTime()) {
        created += 1;
      } else {
        updated += 1;
      }
    }

    return NextResponse.json({ success: true, created, updated });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Failed to import" }, { status: 500 });
  }
}
 