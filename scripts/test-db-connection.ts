import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    // Test basic connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    
    // Test if we can query users
    const userCount = await prisma.user.count();
    console.log(`✅ Users table accessible, found ${userCount} users`);
    
    // Try to find the specific user
    const testUser = await prisma.user.findUnique({
      where: { email: "gohilkrishna9004@gmail.com" }
    });
    
    if (testUser) {
      console.log(`✅ User found: ${testUser.email}`);
      console.log(`   Password hash exists: ${testUser.password ? 'Yes' : 'No'}`);
      console.log(`   Password starts with $2: ${testUser.password?.startsWith('$2') ? 'Yes (hashed)' : 'No (plaintext)'}`);
    } else {
      console.log("⚠️  User 'gohilkrishna9004@gmail.com' not found in database");
      console.log("   You need to create this user in your local database");
    }
    
  } catch (error: any) {
    console.error("❌ Database connection failed!");
    console.error("Error:", error.message);
    
    if (error.message.includes("Can't reach database server")) {
      console.log("\n💡 Possible solutions:");
      console.log("1. Check if your Neon database is paused - go to Neon console and resume it");
      console.log("2. Verify your DATABASE_URL in .env file is correct");
      console.log("3. Check your internet connection");
      console.log("4. Try using a local PostgreSQL database for development");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
