import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendMemoEmailDetailed } from "@/lib/email";
import { jsPDF } from "jspdf";

const db = prisma as any;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { memoId, pdfData } = body as { memoId: string; pdfData?: string };

    // Fetch memo with all related data
    const memo = await db.memo.findUnique({
      where: { id: memoId },
      include: {
        items: true,
        master: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!memo) {
      return NextResponse.json(
        { error: "Memo not found" },
        { status: 404 }
      );
    }

    if (!memo.master.email) {
      return NextResponse.json(
        { error: "Master email not found" },
        { status: 400 }
      );
    }

    // Prefer client-generated preview PDF if provided; else generate server-side
    let pdfBuffer: Buffer;
    if (pdfData && typeof pdfData === 'string') {
      // Accept either data URL (data:application/pdf;base64,...) or raw base64
      const base64 = pdfData.includes(',') ? pdfData.split(',')[1] : pdfData;
      pdfBuffer = Buffer.from(base64, 'base64');
    } else {
      // Generate PDF from memo data (server-side fallback)
      pdfBuffer = await generateMemoPDF(memo);
    }

    // Send email with PDF attachment
    await sendMemoEmailDetailed({
      to: memo.master.email,
      customerName: memo.master.companyName,
      memoNo: memo.memoNumber,
      totalAmount: Number(memo.totalDue || 0),
      pdfBuffer
    });

    // Update memo emailPdf status
    await db.memo.update({
      where: { id: memoId },
      data: { emailPdf: true },
    });

    return NextResponse.json({
      message: "Memo email sent successfully",
    });
  } catch (error) {
    console.error("Error sending memo email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateMemoPDF(memo: any) {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Memo header
  doc.setFontSize(20);
  doc.text("MEMO", 105, 20, { align: "center" });
  
  doc.setFontSize(16);
  doc.text(memo.memoNumber, 105, 30, { align: "center" });
  
  // Memo details
  doc.setFontSize(12);
  let yPos = 50;
  doc.text(`Date: ${new Date(memo.date).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Due Date: ${new Date(memo.dueDate).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Company: ${memo.master.companyName}`, 20, yPos);
  yPos += 20;
  
  // Table headers
  doc.setFontSize(10);
  const tableHeaders = ["Description", "Carat", "Color", "Clarity", "Lab", "Report No", "Price/Ct", "Total"];
  const colWidths = [40, 15, 15, 15, 15, 20, 20, 20];
  let xPos = 20;
  
  tableHeaders.forEach((header, index) => {
    doc.text(header, xPos, yPos);
    xPos += colWidths[index];
  });
  
  yPos += 10;
  
  // Draw line under headers
  doc.line(20, yPos - 5, 190, yPos - 5);
  
  // Table data
  memo.items.forEach((item: any) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    xPos = 20;
    const rowData = [
      item.description,
      item.carat.toString(),
      item.color || '-',
      item.clarity || '-',
      item.lab || '-',
      item.reportNo || '-',
      `$${item.pricePerCarat.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ];
    
    rowData.forEach((data, index) => {
      doc.text(data, xPos, yPos);
      xPos += colWidths[index];
    });
    
    yPos += 8;
  });
  
  // Totals section
  yPos += 10;
  doc.setFontSize(12);
  doc.text(`Subtotal: $${memo.subtotal.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`Shipment Cost: $${memo.shipmentCost.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`Discount: $${memo.discount.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`CR Payment: $${memo.crPayment.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Due: $${memo.totalDue.toFixed(2)}`, 150, yPos);
  
  return Buffer.from(doc.output('arraybuffer'));
}

