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
    const { requestedQuantity } = body;

    if (!requestedQuantity || requestedQuantity < 1) {
      return new NextResponse("Invalid quantity", { status: 400 });
    }

    // Get the product and check stock
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    if (product.stock < requestedQuantity) {
      return new NextResponse(
        JSON.stringify({
          message: `Only ${product.stock} items available in stock`,
        }),
        { status: 400 }
      );
    }

    // Stock is available, reduce it
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: requestedQuantity,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("[CHECK_STOCK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
