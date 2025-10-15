import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function POST(request: NextRequest) {
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
        { error: "Only admins can create notifications" },
        { status: 403 }
      );
    }

    const data = await request.json();
    console.log('Notification creation request data:', data);
    const { title, message, type, targetRoles, imageUrl } = data;
    console.log('Extracted imageUrl:', imageUrl);

    // Find users to send notifications to
    const users = await db.user.findMany({
      where: {
        OR: [
          // Include admin by default
          { id: session.user.id },
          // Include users with specified roles
          ...(targetRoles || []).map((role: string) => ({ role })),
        ],
      },
      select: {
        id: true,
      },
    });

    // Create notifications
    const notificationData = users.map(user => ({
      title,
      message,
      type,
      imageUrl: imageUrl || null,
      userId: user.id,
    }));
    
    console.log('Creating notifications with data:', notificationData);
    
    await db.notification.createMany({
      data: notificationData,
    });

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${users.length} users`,
      usersCount: users.length,
    });
  } catch (error) {
    console.error("Error creating notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
