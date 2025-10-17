import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

async function testConnection() {
  try {
    console.log("Testing database connection...");
    
    // Test basic connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    
    // Test if tables exist
    const categories = await prisma.category.findMany();
    console.log(`✅ Categories table exists, found ${categories.length} categories`);
    
    const subcategories = await prisma.subcategory.findMany();
    console.log(`✅ Subcategories table exists, found ${subcategories.length} subcategories`);
    
    const products = await prisma.product.findMany();
    console.log(`✅ Products table exists, found ${products.length} products`);
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();





