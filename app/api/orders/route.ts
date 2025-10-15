import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items, totalAmount, shippingInfo } = body;

    if (!items?.length || !totalAmount || !shippingInfo) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        items,
        totalAmount,
        shippingInfo,
      },
    });

    // Clear the user's cart after successful order
    await prisma.cart.delete({
      where: { userId: session.user.id },
    }).catch(() => {
      // Ignore error if cart doesn't exist
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
