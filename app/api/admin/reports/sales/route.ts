import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const customerId = searchParams.get("customerId");

    // Base query conditions
    const dateFilter = {
      ...(startDate && {
        gte: new Date(startDate),
      }),
      ...(endDate && {
        lte: new Date(endDate),
      }),
    };

    // Fetch sales data with filters
    const [invoices, totalStats, dailySales] = await Promise.all([
      // Get all invoices with filters
      prisma.invoice.findMany({
        where: {
          date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
          masterId: customerId || undefined,
        },
        include: {
          master: {
            select: {
              companyName: true,
            },
          },
          items: true,
        },
        orderBy: {
          date: 'desc',
        },
      }),

      // Get total stats
      prisma.invoice.aggregate({
        where: {
          date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
          masterId: customerId || undefined,
        },
        _sum: {
          totalDue: true,
        },
        _count: {
          _all: true,
        },
        _avg: {
          totalDue: true,
        },
      }),

      // Get daily sales for chart
      prisma.invoice.groupBy({
        by: ['date'],
        where: {
          date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
          masterId: customerId || undefined,
        },
        _sum: {
          totalDue: true,
        },
        orderBy: {
          date: 'asc',
        },
      }),
    ]);

    // Get top customers
    const topCustomers = await prisma.invoice.groupBy({
      by: ['masterId'],
      where: {
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        totalDue: true,
      },
      orderBy: {
        _sum: {
          totalDue: 'desc',
        },
      },
      take: 5,
      having: {
        masterId: {
          _count: {
            gt: 0,
          },
        },
      },
    });

    // Get customer details for top customers
    const topCustomersWithDetails = await Promise.all(
      topCustomers.map(async (customer) => {
        const masterDetails = await prisma.master.findUnique({
          where: { id: customer.masterId },
          select: { companyName: true },
        });
        return {
          ...customer,
          companyName: masterDetails?.companyName,
        };
      })
    );

    // Get top salesmen
    const salesByMaster = await prisma.invoice.findMany({
      where: {
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      select: {
        totalDue: true,
        master: {
          select: {
            salesExecutiveId: true,
          },
        },
      },
    });

    // Group by sales executive
    const salesBySalesman = salesByMaster.reduce((acc, invoice) => {
      const salesExecId = invoice.master.salesExecutiveId;
      if (salesExecId) {
        acc[salesExecId] = (acc[salesExecId] || 0) + Number(invoice.totalDue || 0);
      }
      return acc;
    }, {} as Record<string, number>);

    // Get top 5 salesmen
    const topSalesmenIds = Object.entries(salesBySalesman)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Get salesman details
    const topSalesmenWithDetails = await Promise.all(
      topSalesmenIds.map(async ([salesExecId, totalSales]) => {
        const userDetails = await prisma.user.findUnique({
          where: { id: salesExecId },
          select: { name: true, email: true },
        });
        return {
          salesExecutiveId: salesExecId,
          name: userDetails?.name || 'Unknown',
          email: userDetails?.email || '',
          totalSales: Number(totalSales || 0),
        };
      })
    );

    // Calculate category distribution (based on item descriptions)
    const categoryDistribution = invoices.reduce((acc, invoice) => {
      invoice.items.forEach((item) => {
        const category = item.clarity || 'Uncategorized';
        acc[category] = (acc[category] || 0) + item.total;
      });
      return acc;
    }, {} as Record<string, number>);

    // Format the response
    const response = {
      summary: {
        totalSales: totalStats._sum.totalDue || 0,
        totalOrders: totalStats._count._all,
        averageOrderValue: totalStats._avg.totalDue || 0,
        topCustomers: topCustomersWithDetails,
        topSalesmen: topSalesmenWithDetails,
      },
      dailySales: dailySales.map((day) => ({
        date: day.date,
        total: day._sum.totalDue || 0,
      })),
      categoryDistribution,
      recentInvoices: invoices.slice(0, 5).map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        companyName: invoice.master.companyName,
        total: Number(invoice.totalDue || 0),
      })),
    };

    return Response.json(response);
  } catch (error) {
    console.error('Sales report error:', error);
    return Response.json(
      { error: 'Failed to generate sales report' },
      { status: 500 }
    );
  }
}

