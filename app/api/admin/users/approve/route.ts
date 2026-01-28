import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { sendCustomerApprovedEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 },
      );
    }

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "APPROVED",
      },
      select: {
        id: true,
        email: true,
        name: true,
        approvalStatus: true,
        approvalAttempts: true,
      },
    });

    if (user.email) {
      await sendCustomerApprovedEmail(user.email, user.name || "Customer");
    }

    return NextResponse.json({
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

