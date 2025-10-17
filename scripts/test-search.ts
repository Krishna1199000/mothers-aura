import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

async function testSearch() {
  try {
    // Test 1: Get all products
    console.log("1. Fetching all products...");
    const allProducts = await prisma.product.findMany({
      include: {
        category: true,
        subcategory: true,
      },
    });
    console.log(`Found ${allProducts.length} products`);
    allProducts.forEach(p => {
      console.log(`- ${p.name} (${p.category.name})`);
    });

    // Test 2: Search for "ring"
    console.log("\n2. Searching for 'ring'...");
    const ringResults = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: "ring", mode: "insensitive" } },
          { description: { contains: "ring", mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
        subcategory: true,
      },
    });
    console.log(`Found ${ringResults.length} results for 'ring'`);
    ringResults.forEach(p => {
      console.log(`- ${p.name} (${p.category.name})`);
    });

    // Test 3: Search by category
    console.log("\n3. Searching by category 'Rings'...");
    const categoryResults = await prisma.product.findMany({
      where: {
        category: {
          slug: "rings",
        },
      },
      include: {
        category: true,
        subcategory: true,
      },
    });
    console.log(`Found ${categoryResults.length} results for category 'rings'`);
    categoryResults.forEach(p => {
      console.log(`- ${p.name} (${p.category.name})`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSearch();





