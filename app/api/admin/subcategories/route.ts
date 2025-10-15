import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import slugify from "slugify";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subcategories = await prisma.subcategory.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("[SUBCATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
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

    // Check if subcategory with same name exists in the same category (case insensitive)
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        categoryId,
      },
    });

    if (existingSubcategory) {
      return new NextResponse(
        "Subcategory with this name already exists in this category",
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.create({
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
    console.error("[SUBCATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
