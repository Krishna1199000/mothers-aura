import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      carat,
      cut,
      color,
      clarity,
      stock,
      images,
      categoryId,
      subcategoryId,
    } = body;

    if (!name || !price || !categoryId) {
      return new NextResponse("Name, price, and category are required", {
        status: 400,
      });
    }

    // Check if another product with same name exists (case insensitive)
    const { id } = await params;
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });

    if (existingProduct) {
      return new NextResponse("Product with this name already exists", {
        status: 400,
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: slugify(name, { lower: true }),
        description,
        price: parseFloat(price),
        carat: carat ? parseFloat(carat) : undefined,
        cut,
        color,
        clarity,
        stock: parseInt(stock),
        images,
        categoryId,
        subcategoryId,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const product = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
