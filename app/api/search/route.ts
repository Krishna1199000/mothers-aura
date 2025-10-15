import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build the where clause
    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        // Also search in category and subcategory names
        {
          category: {
            name: { contains: query, mode: "insensitive" }
          }
        },
        {
          subcategory: {
            name: { contains: query, mode: "insensitive" }
          }
        }
      ],
    };

    // Add category filter if provided
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Fetch products from UI inventory
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        subcategory: true,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform products for consistent response format
    const results = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      category: product.category.name,
      subcategory: product.subcategory?.name,
      type: "ui-inventory",
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}