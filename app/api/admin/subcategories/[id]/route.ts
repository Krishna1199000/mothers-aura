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
    const { name, categoryId } = body;

    if (!name || !categoryId) {
      return new NextResponse("Name and category are required", { status: 400 });
    }

    // Check if another subcategory with same name exists in the same category (case insensitive)
    const { id } = await params;
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        categoryId,
        NOT: {
          id,
        },
      },
    });

    if (existingSubcategory) {
      return new NextResponse(
        "Subcategory with this name already exists in this category",
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name,
        categoryId,
        slug: slugify(name, { lower: true }),
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("[SUBCATEGORY_PATCH]", error);
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
    const subcategory = await prisma.subcategory.delete({
      where: { id },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("[SUBCATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
