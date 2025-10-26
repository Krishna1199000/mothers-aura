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
    const searchTerm = searchParams.get("search");

    // Build the where clause
    const where: any = {};
    const orConditions: any[] = [];

    // Add search conditions
    if (category) {
      orConditions.push(
        { name: { contains: category, mode: "insensitive" } },
        { description: { contains: category, mode: "insensitive" } }
      );
    }

    if (subcategory) {
      orConditions.push(
        { name: { contains: subcategory, mode: "insensitive" } },
        { description: { contains: subcategory, mode: "insensitive" } }
      );
    }

    if (type) {
      orConditions.push(
        { name: { contains: type, mode: "insensitive" } },
        { description: { contains: type, mode: "insensitive" } }
      );
    }

    if (searchTerm) {
      orConditions.push(
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } }
      );
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    // Fetch matching products
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no matches found, return all products
    if (products.length === 0) {
      const allProducts = await prisma.product.findMany({
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
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    images: product.images,
    shape: product.shape,
    carat: product.carat,
    color: product.color,
    clarity: product.clarity,
  };
}










