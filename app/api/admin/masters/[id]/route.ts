import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const master = await prisma.master.findUnique({
      where: { id },
      include: {
        references: true,
        salesExecutive: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!master) {
      return NextResponse.json(
        { error: "Master not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(master);
  } catch (error) {
    console.error("Error fetching master:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // Update master
    const master = await prisma.master.update({
      where: { id },
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
      },
    });

    // Update references
    if (data.referenceType === 'REFERENCE') {
      // Delete existing references
      await prisma.reference.deleteMany({
        where: { masterId: id },
      });

      // Create new references
      await prisma.reference.createMany({
        data: data.references
          .filter((ref: any) => ref.companyName && ref.contactPerson && ref.contactNo)
          .map((ref: any) => ({
            masterId: id,
            companyName: ref.companyName,
            contactPerson: ref.contactPerson,
            contactNo: ref.contactNo,
          })),
      });
    }

    return NextResponse.json({
      message: "Master updated successfully",
      master,
    });
  } catch (error) {
    console.error("Error updating master:", error);
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
  const { id } = await params;
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

    // Delete references first
    await prisma.reference.deleteMany({
      where: { masterId: id },
    });

    // Delete master
    await prisma.master.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Master deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting master:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}






