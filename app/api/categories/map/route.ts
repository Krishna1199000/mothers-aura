import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const type = searchParams.get("type");

    // Build the where clause
    const where: any = {};

    // First try exact match
    if (category) {
      where.OR = [
        // Direct category match
        {
          category: {
            name: { contains: category, mode: "insensitive" }
          }
        },
        // Category in name or description
        { name: { contains: category, mode: "insensitive" } },
        { description: { contains: category, mode: "insensitive" } },
      ];
    }

    if (subcategory) {
      where.OR = [
        // Direct subcategory match
        {
          subcategory: {
            name: { contains: subcategory, mode: "insensitive" }
          }
        },
        // Subcategory in name or description
        { name: { contains: subcategory, mode: "insensitive" } },
        { description: { contains: subcategory, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.OR = [
        // Type in name or description
        { name: { contains: type, mode: "insensitive" } },
        { description: { contains: type, mode: "insensitive" } },
      ];
    }

    // Fetch matching products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no exact matches found, return all products from the closest matching category
    if (products.length === 0 && category) {
      const fallbackProducts = await prisma.product.findMany({
        where: {
          category: {
            name: { contains: category.split(" ")[0], mode: "insensitive" }
          }
        },
        include: {
          category: true,
          subcategory: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // If still no matches, return all products
      if (fallbackProducts.length === 0) {
        const allProducts = await prisma.product.findMany({
          include: {
            category: true,
            subcategory: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        });

        return NextResponse.json({
          products: allProducts.map(formatProduct),
          isExactMatch: false,
          message: "No exact matches found. Showing our other items.",
        });
      }

      return NextResponse.json({
        products: fallbackProducts.map(formatProduct),
        isExactMatch: false,
        message: `No exact matches found. Showing similar items from ${fallbackProducts[0].category.name}.`,
      });
    }

    return NextResponse.json({
      products: products.map(formatProduct),
      isExactMatch: true,
    });
  } catch (error) {
    console.error("[CATEGORY_MAP_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function formatProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    images: product.images,
    category: product.category.name,
    subcategory: product.subcategory?.name,
  };
}





