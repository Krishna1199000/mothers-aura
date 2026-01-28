import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { sendCustomerApprovalPendingEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approvalStatus: true,
        approvalAttempts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only customers use this flow
    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customers can request approval" },
        { status: 400 },
      );
    }

    if (user.approvalStatus === "APPROVED") {
      return NextResponse.json(
        { error: "Your account is already approved" },
        { status: 400 },
      );
    }

    // If previously rejected, enforce max 3 re-request attempts
    let nextAttempts = user.approvalAttempts;
    if (user.approvalStatus === "REJECTED") {
      if (user.approvalAttempts >= 3) {
        return NextResponse.json(
          {
            error:
              "You have reached the maximum number of approval requests. Please contact support.",
          },
          { status: 400 },
        );
      }
      nextAttempts = user.approvalAttempts + 1;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        approvalStatus: "PENDING",
        approvalAttempts: nextAttempts,
      },
      select: {
        approvalStatus: true,
        approvalAttempts: true,
        email: true,
        name: true,
      },
    });

    // Notify customer that their request is pending
    if (updated.email) {
      await sendCustomerApprovalPendingEmail(
        updated.email,
        updated.name || "Customer",
      );
    }

    return NextResponse.json({
      message: "Approval request submitted. Please wait for admin to approve.",
      approvalStatus: updated.approvalStatus,
      approvalAttempts: updated.approvalAttempts,
    });
  } catch (error) {
    console.error("Error requesting approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

