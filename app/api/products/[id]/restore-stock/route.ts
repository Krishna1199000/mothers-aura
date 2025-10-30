import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return new NextResponse("Invalid quantity", { status: 400 });
    }

    // Restore stock
    const { id } = await params;

    // Ensure product exists; if not, no-op to avoid noisy errors for deleted/non-UI items
    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true, name: true, stock: true } });
    if (!existing) {
      return NextResponse.json({ success: true, skipped: true, message: "Product not found; restore skipped" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: { increment: quantity },
      },
      select: { id: true, name: true, stock: true },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Stock restored successfully",
    });
  } catch (error) {
    console.error("[RESTORE_STOCK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
