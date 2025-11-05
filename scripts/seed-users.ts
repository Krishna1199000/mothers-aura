import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log("Seeding users...");

    // Create Admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@mothersaura.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@mothersaura.com",
        password: adminPassword,
        role: "ADMIN",
        phone: "+1-555-0123",
      },
    });

    // Create Employee user
    const employeePassword = await bcrypt.hash("employee123", 10);
    const employee = await prisma.user.upsert({
      where: { email: "employee@mothersaura.com" },
      update: {},
      create: {
        name: "Employee User",
        email: "employee@mothersaura.com",
        password: employeePassword,
        role: "EMPLOYEE",
        phone: "+1-555-0124",
      },
    });

    // Create Customer user
    const customerPassword = await bcrypt.hash("customer123", 10);
    const customer = await prisma.user.upsert({
      where: { email: "customer@mothersaura.com" },
      update: {},
      create: {
        name: "Customer User",
        email: "customer@mothersaura.com",
        password: customerPassword,
        role: "CUSTOMER",
        phone: "+1-555-0125",
      },
    });

    console.log("Users seeded successfully:");
    console.log("- Admin:", admin.email, "(password: admin123)");
    console.log("- Employee:", employee.email, "(password: employee123)");
    console.log("- Customer:", customer.email, "(password: customer123)");

  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();



































