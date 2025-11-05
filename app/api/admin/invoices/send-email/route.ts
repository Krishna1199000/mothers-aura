import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendInvoiceEmail, sendInvoiceEmailDetailed } from "@/lib/email";
import { jsPDF } from "jspdf";
import { generateInvoicePDFBuffer, InvoiceData } from "@/lib/pdf-utils";

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
    const { invoiceId, pdfData } = body as { invoiceId: string; pdfData?: string };

    // Fetch invoice with all related data
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
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

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (!invoice.master.email) {
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
      // Try Puppeteer HTML->PDF first; fall back to jsPDF on error
      try {
        const invoiceData: InvoiceData = {
          id: invoice.id,
          invoiceNo: invoice.invoiceNumber,
          date: new Date(invoice.date),
          dueDate: new Date(invoice.dueDate),
          paymentTerms: Number(invoice.paymentTerms || 0),
          companyName: invoice.master.companyName,
          addressLine1: invoice.master.addressLine1 || '',
          addressLine2: invoice.master.addressLine2 || null,
          city: invoice.master.city || '',
          state: invoice.master.state || '',
          country: invoice.master.country || '',
          postalCode: invoice.master.postalCode || '',
          description: invoice.description || null,
          amountInWords: '',
          subtotal: Number(invoice.subtotal || 0),
          discount: Number(invoice.discount || 0),
          crPayment: Number(invoice.crPayment || 0),
          shipmentCost: Number(invoice.shipmentCost || 0),
          totalAmount: Number(invoice.totalDue || 0),
          items: invoice.items.map((it: any) => ({
            id: it.id,
            description: it.description || '',
            carat: Number(it.carat || 0),
            color: it.color || '',
            clarity: it.clarity || '',
            lab: it.lab || '',
            reportNo: it.reportNo || '',
            pricePerCarat: Number(it.pricePerCarat || 0),
            total: Number(it.total || 0),
          })),
        };
        pdfBuffer = await generateInvoicePDFBuffer(invoiceData);
      } catch (e) {
        pdfBuffer = await generateInvoicePDF(invoice);
      }
    }

    // Send email with PDF attachment
    // Send detailed branded email with dynamic fields
    await sendInvoiceEmailDetailed({
      to: invoice.master.email,
      customerName: invoice.master.companyName,
      invoiceNo: invoice.invoiceNumber,
      totalAmount: Number(invoice.totalDue || 0),
      pdfBuffer
    });

    // Update invoice emailPdf status
    await db.invoice.update({
      where: { id: invoiceId },
      data: { emailPdf: true },
    });

    return NextResponse.json({
      message: "Invoice email sent successfully",
    });
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateInvoicePDF(invoice: any) {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Invoice header
  doc.setFontSize(20);
  doc.text("INVOICE", 105, 20, { align: "center" });
  
  doc.setFontSize(16);
  doc.text(invoice.invoiceNumber, 105, 30, { align: "center" });
  
  // Invoice details
  doc.setFontSize(12);
  let yPos = 50;
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Company: ${invoice.master.companyName}`, 20, yPos);
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
  invoice.items.forEach((item: any) => {
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
  doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`Shipment Cost: $${invoice.shipmentCost.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`Discount: $${invoice.discount.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`CR Payment: $${invoice.crPayment.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.setFontSize(14);
  doc.text(`Total Due: $${invoice.totalDue.toFixed(2)}`, 150, yPos);
  
  return Buffer.from(doc.output('arraybuffer'));
}


