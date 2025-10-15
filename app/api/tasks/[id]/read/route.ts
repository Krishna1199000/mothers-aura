import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = session.user.id;

    // Find the task assignment
    const taskAssignment = await db.taskAssignment.findFirst({
      where: {
        taskId: id,
        userId,
      },
    });

    if (!taskAssignment) {
      return NextResponse.json(
        { error: "Task assignment not found" },
        { status: 404 }
      );
    }

    // Mark the task assignment as read
    await db.taskAssignment.update({
      where: {
        id: taskAssignment.id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking task as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


