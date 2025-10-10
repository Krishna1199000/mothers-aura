import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current user's role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

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

    return NextResponse.json({
      message: "Users seeded successfully",
      users: {
        admin: { email: admin.email, password: "admin123" },
        employee: { email: employee.email, password: "employee123" },
        customer: { email: customer.email, password: "customer123" },
      }
    });

  } catch (error) {
    console.error("Error seeding users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}







