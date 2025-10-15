import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Only allow users to view their own orders (except admins)
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    // Get the current order to check previous status
    const { id } = await params;
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Update the order status
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Handle stock based on status changes
    if (status === "CANCELLED" && currentOrder.status !== "CANCELLED") {
      // Restore stock when order is cancelled
      for (const item of currentOrder.items as any[]) {
        if (item.productId) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the order first to restore stock before deleting
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Restore stock when deleting order (unless it was already cancelled)
    if (order.status !== "CANCELLED") {
      for (const item of order.items as any[]) {
        if (item.productId) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    // Delete the order
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("[ORDER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
