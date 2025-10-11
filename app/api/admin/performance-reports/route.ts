import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: any = {};
    
    // Date filters
    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    // For employees, only show their own reports
    if (session.user.role === "EMPLOYEE") {
      where.createdById = session.user.id;
    }

    const reports = await prisma.performanceReport.findMany({
      where,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return Response.json(reports);
  } catch (error) {
    console.error("Performance reports fetch error:", error);
    return Response.json(
      { error: "Failed to fetch performance reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
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

    const report = await prisma.performanceReport.create({
      data: {
        date: new Date(data.date),
        totalCalls: parseInt(data.totalCalls),
        totalEmails: parseInt(data.totalEmails),
        requirementReceived: parseInt(data.requirementReceived),
        memoNumber: data.memoNumber,
        invoiceNumber: data.invoiceNumber,
        notes: data.notes,
        createdById: session.user.id,
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
    console.error("Performance report creation error:", error);
    return Response.json(
      { error: "Failed to create performance report" },
      { status: 500 }
    );
  }
}
