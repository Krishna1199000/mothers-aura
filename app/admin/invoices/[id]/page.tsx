"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Printer, Download } from "lucide-react";
import Image from "next/image";

interface InvoiceItem {
  id: string;
  description: string;
  carat: number;
  color: string;
  clarity: string;
  lab: string;
  reportNo: string;
  pricePerCarat: number;
  total: number;
}

interface Master {
  id: string;
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  paymentTerms: number;
  emailPdf: boolean;
  master: Master;
  items: InvoiceItem[];
  description?: string;
  shipmentCost: number;
  discount: number;
  crPayment: number;
  subtotal: number;
  totalDue: number;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/invoices/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
      } else {
        setError("Failed to fetch invoice details");
      }
    } catch (error) {
      setError("Error loading invoice details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchInvoice();
  }, [session, status, router, id, fetchInvoice]);

  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      console.log('Starting PDF download...');
      
      const content = document.getElementById('invoice-content');
      if (!content) {
        throw new Error('Invoice content not found');
      }

      // Import jsPDF and html2canvas
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      console.log('Libraries loaded successfully');

      // Create a clone of the content
      const contentClone = content.cloneNode(true) as HTMLElement;
      
      // Set styles for the clone
      contentClone.style.position = 'absolute';
      contentClone.style.top = '-9999px';
      contentClone.style.left = '-9999px';
      contentClone.style.width = '210mm';
      contentClone.style.minHeight = '297mm';
      contentClone.style.margin = '0';
      contentClone.style.padding = '15mm';
      contentClone.style.boxSizing = 'border-box';
      contentClone.style.backgroundColor = '#ffffff';
      contentClone.style.fontFamily = 'Arial, sans-serif';

      // Add the clone to the document temporarily
      document.body.appendChild(contentClone);

      try {
        console.log('Generating canvas...');
        
        // Create canvas with optimized settings
        const canvas = await html2canvas(contentClone, {
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: contentClone.offsetWidth,
          height: contentClone.offsetHeight,
          scrollX: 0,
          scrollY: 0
        });

        console.log('Canvas generated:', canvas.width, 'x', canvas.height);

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions to fit A4
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        // Calculate scaling to fit content
        const scaleX = contentWidth / canvas.width;
        const scaleY = contentHeight / canvas.height;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;

        // Center the content
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        // Add image to PDF
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

        // Save PDF
        const fileName = `Invoice-${invoice?.invoiceNumber || 'Unknown'}.pdf`;
        pdf.save(fileName);
        
        console.log('PDF saved successfully:', fileName);
        
      } catch (canvasError) {
        console.error('Canvas generation error:', canvasError);
        alert('Error generating PDF canvas. Please try again.');
      } finally {
        // Clean up
        if (contentClone && contentClone.parentNode) {
          contentClone.parentNode.removeChild(contentClone);
        }
        setIsDownloading(false);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    try {
      setIsPrinting(true);
      window.print();
    } catch (error) {
      console.error('Error printing:', error);
      alert('Error printing. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };



  const convertNumberToWords = (num: number): string => {
    // Simple implementation for demo - you might want to use a library like 'number-to-words'
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand', 'million', 'billion'];

    if (num === 0) return 'zero dollars only';
    
    const convert = (n: number): string => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      
      for (let i = 0; i < thousands.length; i++) {
        const unit = Math.pow(1000, i + 1);
        if (n < unit) {
          const quotient = Math.floor(n / Math.pow(1000, i));
          const remainder = n % Math.pow(1000, i);
          return convert(quotient) + ' ' + thousands[i] + (remainder ? ' ' + convert(remainder) : '');
        }
      }
      return '';
    };

    const dollars = Math.floor(num);
    const cents = Math.round((num - dollars) * 100);
    
    let result = convert(dollars) + ' dollar' + (dollars !== 1 ? 's' : '');
    if (cents > 0) {
      result += ' and ' + convert(cents) + ' cent' + (cents !== 1 ? 's' : '');
    }
    return result + ' only';
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Invoice not found"}</AlertDescription>
          </Alert>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header - Hidden in print */}
          <div className="no-print flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/invoices')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Invoice Details</h1>
                <p className="text-muted-foreground">
                  View and print invoice
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handlePrint}
                disabled={isPrinting || isDownloading}
              >
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'Printing...' : 'Print Invoice'}
              </Button>
              <Button 
                onClick={downloadPDF} 
                variant="secondary"
                disabled={isPrinting || isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>

          {/* Print Styles */}
          <style jsx global>{`
            @page {
              size: A4;
              margin: 0 !important;
            }
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                font-size: 12px !important;
              }
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              .print-only { display: block !important; }
              .page-break { page-break-before: always; }
              
              /* Hide print/download buttons and related text */
              .print-download-section,
              .print-download-text,
              button,
              .button-container,
              .action-buttons {
                display: none !important;
              }
              
              /* Hide browser-generated content */
              @page {
                margin: 0 !important;
                size: A4 !important;
              }
              
              /* Remove browser headers and footers */
              html, body {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Hide any browser-generated URL or page info */
              body::before,
              body::after,
              html::before,
              html::after {
                display: none !important;
              }
              
          /* Table styles */
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
            margin-bottom: 1rem;
            table-layout: fixed;
          }
          tr { 
            page-break-inside: avoid; 
            page-break-after: auto; 
          }
          th, td {
            border: 1px solid #000;
            padding: 1px 2px;
            text-align: left;
            font-size: 8px !important;
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.1;
          }
          th { 
            background-color: #e6f3ff !important;
            font-weight: bold;
            font-size: 8px !important;
            white-space: nowrap;
          }
          td:first-child { width: 20%; }  /* Description */
          td:nth-child(2) { width: 7%; } /* Carat */
          td:nth-child(3) { width: 12%; } /* Color & Clarity */
          td:nth-child(4) { width: 7%; } /* Lab */
          td:nth-child(5) { width: 12%; } /* Report No */
          td:nth-child(6) { width: 15%; } /* Price/ct */
          td:nth-child(7) { width: 17%; } /* Total */

          /* Compact text */
          .text-xs { font-size: 8px !important; }
          .text-sm { font-size: 9px !important; }
          p { margin: 0 0 0.3em 0 !important; }
          .mb-8 { margin-bottom: 0.3rem !important; }
          .mb-6 { margin-bottom: 0.2rem !important; }
          .mb-4 { margin-bottom: 0.15rem !important; }
          .mb-2 { margin-bottom: 0.1rem !important; }
          .space-y-1 > * + * { margin-top: 0.1rem !important; }
          
          /* Optimize main container spacing */
          #invoice-content {
            padding: 8mm !important;
            margin: 0 !important;
          }
          
          /* Reduce header spacing */
          .invoice-header {
            margin-bottom: 0.2rem !important;
          }
          
          /* Optimize table spacing */
          table {
            margin-bottom: 0.2rem !important;
          }

              /* Logo */
              img {
                width: 112px !important;
                height: 112px !important;
                object-fit: cover;
                border-radius: 8px;
                background-color: white !important;
              }
              .logo-container {
                background-color: white !important;
                padding: 8px;
                border-radius: 8px;
                display: inline-block;
                margin-bottom: 8px;
              }

              /* Layout */
              #invoice-content {
                max-width: 100%;
                margin: 0 auto;
                background-color: white !important;
              }

              /* Text */
              .text-sm { font-size: 12px; }
              .text-xs { font-size: 10px; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .text-center { text-align: center; }

              /* Spacing */
              .mb-8 { margin-bottom: 2rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-2 { margin-bottom: 0.5rem; }
              .space-y-1 > * + * { margin-top: 0.25rem; }
              .p-8 { padding: 2rem; }

              /* Colors */
              .text-muted-foreground { color: #666 !important; }
              .bg-background { background-color: white !important; }
              .bg-white { background-color: white !important; }
            }
          `}</style>

          {/* Invoice Content */}
          <Card>
            <CardContent className="p-8" id="invoice-content">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="bg-white p-2 rounded-lg inline-block mb-2">
                  <Image 
                    src="/Logo.png" 
                    alt="Logo" 
                    width={96}
                    height={96}
                    className="mx-auto w-24 h-24 object-contain print:w-28 print:h-28"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  203-Bhav resiedency, Thane 421304 India
                </p>
              </div>

              {/* Invoice Details */}
              <div className="flex justify-between items-start mb-8">
                {/* Invoice Number - Left */}
                <div>
                  <h2 className="font-bold">Invoice No: {invoice.invoiceNumber}</h2>
                </div>

                {/* Date Details - Right */}
                <div className="text-right">
                  <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
                  <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                  <p>Payment Terms: {invoice.paymentTerms} days</p>
                </div>
              </div>

              {/* To Address */}
              <div className="mb-8">
                <h3 className="font-bold">To:</h3>
                <div>
                  <p>{invoice.master.companyName}</p>
                  <p>{invoice.master.addressLine1}</p>
                  {invoice.master.addressLine2 && <p>{invoice.master.addressLine2}</p>}
                  <p>{invoice.master.city}, {invoice.master.state} {invoice.master.postalCode}</p>
                  <p>{invoice.master.country}</p>
                </div>
              </div>

          {/* Annexure Table */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Annexure</h3>
              <div className="w-24 h-0.5 bg-gray-300 mx-auto mt-2"></div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#e6f3ff]">
                  <th className="border border-gray-300 p-2 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 p-2 text-center font-semibold">Carat</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Color & Clarity</th>
                  <th className="border border-gray-300 p-2 text-center font-semibold">Lab</th>
                  <th className="border border-gray-300 p-2 text-center font-semibold">Report No.</th>
                  <th className="border border-gray-300 p-2 text-right font-semibold">Price/ct (USD)</th>
                  <th className="border border-gray-300 p-2 text-right font-semibold">Total (USD)</th>
                </tr>
              </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 p-2">{item.description}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.carat}</td>
                        <td className="border border-gray-300 p-2">{item.color} {item.clarity}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.lab}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.reportNo}</td>
                        <td className="border border-gray-300 p-2 text-right">${item.pricePerCarat.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={6} className="border border-gray-300 p-2 text-right font-bold">Grand Total:</td>
                      <td className="border border-gray-300 p-2 text-right font-bold">${invoice.subtotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Summary then Account Details (Account below totals) */}
              <div className="grid grid-cols-1 gap-8 mb-8">
                {/* Financial Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>${invoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.crPayment > 0 && (
                    <div className="flex justify-between">
                      <span>CR Payment:</span>
                      <span>${invoice.crPayment.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.shipmentCost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${invoice.shipmentCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Due:</span>
                      <span>${invoice.totalDue.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs">
                      <strong>Amount in words:</strong><br />
                      <em>{convertNumberToWords(invoice.totalDue)}</em>
                    </p>
                  </div>
                </div>

                {/* Account Details (now below the summary) */}
                <div className="border border-gray-300 p-4">
                  <h4 className="font-bold mb-3">ACCOUNT DETAILS</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>BENEFICIARY NAME</strong> - MOTHERS AURA</p>
                    <p><strong>BANK NAME</strong> - CITIBANK</p>
                    <p><strong>ADDRESS</strong> - 111 WALL STREET,</p>
                    <p className="ml-16">NEW YORK, NY 10043 USA</p>
                    <p><strong>SWIFT</strong> - CITIUS33</p>
                    <p><strong>ACCOUNT NUMBER</strong> - 70585610001874252</p>
                    <p><strong>ACCOUNT TYPE</strong> - CHECKING</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mb-6">
                <h4 className="font-bold mb-2">DISCLAIMER:</h4>
                <div className="text-xs space-y-1">
                  <p>1. The goods invoiced herein above are LABORATORY GROWN DIAMONDS. These laboratory grown diamonds are optically, chemically physically identical to mined diamonds.</p>
                  <p>2. All subsequent future sale of these diamonds must be accompanies by disclosure of their origin as LABORATORY GROWN DIAMONDS.</p>
                  <p>3. These goods remain the property of the seller until full payment is received. Full payment only transfers the ownership, regardless the conditions of this invoice. In case the purchaser takes delivery of goods prior to full payment he will be considered, not as owner, whilst purchaser remains fully liable for any loss or damage.</p>
                </div>
              </div>

               {/* Signature Section */}
               <div className="flex justify-between items-end mb-6 mt-8">
                 <div className="text-left flex-1 mr-8">
                   <div className="border-b border-black w-full mb-4 h-8"></div>
                   <p className="text-sm font-semibold">For Mothers Aura Diamonds</p>
                   <p className="text-xs">Authorized Signatory</p>
                 </div>
                 <div className="text-right flex-1 ml-8">
                   <div className="border-b border-black w-full mb-4 h-8"></div>
                   <p className="text-sm">For {invoice?.master?.companyName}</p>
                   <p className="text-xs">Customer Signatory</p>
                 </div>
               </div>

              {/* Footer Text */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and are compliance with United Nations Resolutions. I hereby guarantee that these diamonds are conflict free, based on personal knowledge and/ or written guarantees provided by the supplier of these diamonds. Mothers aura diamonds deals only in Lab Grown Diamonds. All diamonds invoiced are Lab Grown Diamonds immaterial if its certified or non-certified.</p>
                <br />
                <p>Received the above goods on the terms and conditions set out</p>
              </div>

              {/* Print Button Area - Only show in print */}
              <div className="print-only text-center mt-8" style={{ display: 'none' }}>
                <Button onClick={downloadPDF}>Print & Download</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
