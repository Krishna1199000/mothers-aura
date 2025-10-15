import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    const userId = session.user.id;

    // For admin, return all tasks they created
    if (userRole === "ADMIN") {
      const tasks = await db.task.findMany({
        where: {
          createdById: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return NextResponse.json(tasks);
    }

    // For employees, return tasks assigned to them
    if (userRole === "EMPLOYEE") {
      const taskAssignments = await db.taskAssignment.findMany({
        where: {
          userId,
        },
        include: {
          task: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      const tasks = taskAssignments.map(assignment => ({
        ...assignment.task,
        isRead: assignment.isRead,
      }));
      
      return NextResponse.json(tasks);
    }

    // For customers, return tasks assigned to them
    if (userRole === "CUSTOMER") {
      const taskAssignments = await db.taskAssignment.findMany({
        where: {
          userId,
        },
        include: {
          task: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      const tasks = taskAssignments.map(assignment => ({
        ...assignment.task,
        isRead: assignment.isRead,
      }));
      
      return NextResponse.json(tasks);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
        { error: "Only admins can create tasks" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { name, description, type } = data;

    // Create the task
    const task = await db.task.create({
      data: {
        name,
        description,
        type,
        createdById: session.user.id,
      },
    });

    // Find users to assign the task to
    const roleClauses = [
      { role: type === "BOTH" ? "EMPLOYEE" : type },
      ...(type === "BOTH" ? [{ role: "CUSTOMER" }] : []),
    ];

    const users = await db.user.findMany({
      where: {
        OR: roleClauses as any,
      },
      select: {
        id: true,
      },
    });

    // Create task assignments
    await db.taskAssignment.createMany({
      data: users.map(user => ({
        taskId: task.id,
        userId: user.id,
      })),
    });

    // Create notifications for assigned users and admin
    const notifications = [
      // Notifications for assigned users
      ...users.map(user => ({
        title: "New Task Assigned",
        message: `You have been assigned a new task: ${name}`,
        type: "TASK",
        userId: user.id,
      })),
      // Notification for admin
      {
        title: "Task Created",
        message: `You created a new task: ${name}`,
        type: "TASK",
        userId: session.user.id,
      }
    ];

    await db.notification.createMany({
      data: notifications,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
