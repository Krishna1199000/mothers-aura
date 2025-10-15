import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function PUT(
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

    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can edit notifications" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { title, message, type } = data;

    // Find all related notifications (same title and creation time)
    const { id } = await params;
    const originalNotification = await db.notification.findUnique({
      where: { id },
      select: { title: true, createdAt: true },
    });

    if (!originalNotification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Update all related notifications
    const updatedNotifications = await db.notification.updateMany({
      where: {
        title: originalNotification.title,
        createdAt: originalNotification.createdAt,
      },
      data: {
        title,
        message,
        type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notifications updated",
      count: updatedNotifications.count,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete notifications" },
        { status: 403 }
      );
    }

    // Find all related notifications (same title and creation time)
    const { id } = await params;
    const originalNotification = await db.notification.findUnique({
      where: { id },
      select: { title: true, createdAt: true },
    });

    if (!originalNotification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Delete all related notifications
    const deletedNotifications = await db.notification.deleteMany({
      where: {
        title: originalNotification.title,
        createdAt: originalNotification.createdAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notifications deleted",
      count: deletedNotifications.count,
    });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


