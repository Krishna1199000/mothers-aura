import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current user's role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // Fetch all masters with related data
    const masters = await prisma.master.findMany({
      select: {
        id: true,
        companyName: true,
        email: true,
        phoneNo: true,
        salesExecutive: {
          select: {
            name: true,
          },
        },
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(masters);
  } catch (error) {
    console.error("Error fetching masters:", error);
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

    // Get the current user's role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate that all required user IDs exist
    const requiredUserIds = [
      data.authorizedById,
      data.accountManagerId,
      data.salesExecutiveId,
      data.leadSourceId
    ].filter(Boolean);

    if (requiredUserIds.length > 0) {
      const existingUsers = await prisma.user.findMany({
        where: {
          id: { in: requiredUserIds }
        },
        select: { id: true, role: true }
      });

      const existingUserIds = existingUsers.map(user => user.id);
      const missingUserIds = requiredUserIds.filter(id => !existingUserIds.includes(id));

      if (missingUserIds.length > 0) {
        return NextResponse.json(
          { error: `Invalid user IDs: ${missingUserIds.join(', ')}` },
          { status: 400 }
        );
      }

      // Validate roles
      const authorizedByUser = existingUsers.find(u => u.id === data.authorizedById);
      const accountManagerUser = existingUsers.find(u => u.id === data.accountManagerId);
      const salesExecutiveUser = existingUsers.find(u => u.id === data.salesExecutiveId);
      const leadSourceUser = existingUsers.find(u => u.id === data.leadSourceId);

      if (authorizedByUser && authorizedByUser.role !== 'ADMIN') {
        return NextResponse.json(
          { error: "Authorized By must be an Admin user" },
          { status: 400 }
        );
      }

      if (accountManagerUser && accountManagerUser.role !== 'ADMIN') {
        return NextResponse.json(
          { error: "Account Manager must be an Admin user" },
          { status: 400 }
        );
      }

      if (salesExecutiveUser && salesExecutiveUser.role !== 'EMPLOYEE') {
        return NextResponse.json(
          { error: "Sales Executive must be an Employee user" },
          { status: 400 }
        );
      }

      if (leadSourceUser && leadSourceUser.role !== 'ADMIN') {
        return NextResponse.json(
          { error: "Lead Source must be an Admin user" },
          { status: 400 }
        );
      }
    }

    // Create master with references
    const master = await prisma.master.create({
      data: {
        companyName: data.companyName,
        ownerName: data.ownerName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        country: data.country,
        state: data.state,
        city: data.city,
        postalCode: data.postalCode,
        phoneNo: data.phoneNo,
        faxNo: data.faxNo,
        email: data.email,
        website: data.website,
        paymentTerms: data.paymentTerms,
        shippedBy: data.shippedBy,
        organizationType: data.organizationType,
        businessType: data.businessType,
        businessRegNo: data.businessRegNo,
        panNo: data.panNo,
        sellerPermitNo: data.sellerPermitNo,
        cstTinNo: data.cstTinNo,
        tradeBodyMembership: data.tradeBodyMembership,
        referenceType: data.referenceType,
        notes: data.notes,
        authorizedById: data.authorizedById,
        accountManagerId: data.accountManagerId,
        brokerName: data.brokerName,
        partyGroup: data.partyGroup,
        salesExecutiveId: data.salesExecutiveId,
        leadSourceId: data.leadSourceId,
        limit: parseFloat(data.limit),
        references: {
          create: data.referenceType === 'REFERENCE' 
            ? data.references
                .filter((ref: any) => ref.companyName && ref.contactPerson && ref.contactNo)
                .map((ref: any) => ({
                  companyName: ref.companyName,
                  contactPerson: ref.contactPerson,
                  contactNo: ref.contactNo,
                }))
            : []
        }
      },
    });

    return NextResponse.json({
      message: "Master created successfully",
      master,
    });
  } catch (error) {
    console.error("Error creating master:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
