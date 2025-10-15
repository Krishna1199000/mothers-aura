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

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error("[CART_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      update: { items },
      create: {
        userId: session.user.id,
        items,
      },
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.error("[CART_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
