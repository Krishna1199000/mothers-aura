import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { sendCustomerRejectedEmail } from "@/lib/email";

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

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        approvalAttempts: true,
        email: true,
        name: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextAttempts = existing.approvalAttempts + 1;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "REJECTED",
        approvalAttempts: nextAttempts,
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
      const remaining = Math.max(0, 3 - user.approvalAttempts);
      await sendCustomerRejectedEmail(
        user.email,
        user.name || "Customer",
        remaining,
      );
    }

    return NextResponse.json({
      message: "User rejected successfully",
      user,
    });
  } catch (error) {
    console.error("Error rejecting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

