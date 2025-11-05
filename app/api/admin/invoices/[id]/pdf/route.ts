import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateInvoicePDFBuffer, InvoiceData } from "@/lib/pdf-utils";

const db = prisma as any;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { items: true, master: true },
    });

    if (!invoice) {
      return new Response(JSON.stringify({ error: "Invoice not found" }), { status: 404 });
    }

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

    const pdfBuffer = await generateInvoicePDFBuffer(invoiceData);
    const safeNo = String(invoice.invoiceNumber || '').replace(/[\/?]/g, '-');

    // Convert Node Buffer to a Blob/Uint8Array to satisfy BodyInit typing
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice-${safeNo}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), { status: 500 });
  }
}



