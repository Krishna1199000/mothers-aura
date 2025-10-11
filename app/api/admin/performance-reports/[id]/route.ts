import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const report = await prisma.performanceReport.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    // Employees can only view their own reports
    if (
      session.user.role === "EMPLOYEE" &&
      report.createdById !== session.user.id
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json(report);
  } catch (error) {
    console.error("Performance report fetch error:", error);
    return Response.json(
      { error: "Failed to fetch performance report" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.date || !data.totalCalls || !data.totalEmails || !data.requirementReceived) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const report = await prisma.performanceReport.update({
      where: { id },
      data: {
        date: new Date(data.date),
        totalCalls: parseInt(data.totalCalls),
        totalEmails: parseInt(data.totalEmails),
        requirementReceived: parseInt(data.requirementReceived),
        memoNumber: data.memoNumber,
        invoiceNumber: data.invoiceNumber,
        notes: data.notes,
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return Response.json(report);
  } catch (error) {
    console.error("Performance report update error:", error);
    return Response.json(
      { error: "Failed to update performance report" },
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
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.performanceReport.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Performance report deletion error:", error);
    return Response.json(
      { error: "Failed to delete performance report" },
      { status: 500 }
    );
  }
}
