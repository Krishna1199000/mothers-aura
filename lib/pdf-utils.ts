import puppeteer, { type Browser } from 'puppeteer';
import fs from 'fs';
import path from 'path';

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

export interface InvoiceData {
  id: string;
  invoiceNo: string;
  date: Date;
  dueDate: Date;
  paymentTerms: number;
  companyName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  description: string | null;
  amountInWords: string;
  subtotal: number;
  discount: number;
  crPayment: number;
  shipmentCost: number;
  totalAmount: number;
  items: InvoiceItem[];
}

interface MemoItem {
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

export interface MemoData {
  id: string;
  memoNo: string;
  date: Date;
  dueDate: Date;
  paymentTerms: number;
  companyName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  description: string | null;
  amountInWords: string;
  subtotal: number;
  discount: number;
  crPayment: number;
  shipmentCost: number;
  totalAmount: number;
  items: MemoItem[];
}

const formatCurrencyUSD = (value: number): string => {
  return `$${Number(value || 0).toFixed(2)}`;
};

const calculateTotal = (carat: number, pricePerCarat: number): number => {
  return (Number(carat) || 0) * (Number(pricePerCarat) || 0);
};

const convertNumberToWords = (num: number): string => {
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

export function generateInvoiceHTML(invoice: InvoiceData): string {
  const subtotal = invoice.items.reduce((total, item) => total + calculateTotal(Number(item.carat) || 0, Number(item.pricePerCarat) || 0), 0);
  const totalAmount = subtotal - (Number(invoice.discount) || 0) - (Number(invoice.crPayment) || 0) + (Number(invoice.shipmentCost) || 0);
  
  // Generate amount in words if not provided
  const amountInWords = invoice.amountInWords || convertNumberToWords(totalAmount);

  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

  // Use public URL for logo - works in both dev and production
  // Use logoWithDescbg.png which is the actual hosted logo asset
  const logoUrl = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/logoWithDescbg.png`
    : 'https://mothersauradiamonds.com/logoWithDescbg.png';
  
  let logoElement = '';
  try {
    // Try filesystem first (works in dev)
    const logoPath = path.join(process.cwd(), 'public', 'logoWithDescbg.png');
    if (typeof fs.existsSync === 'function' && fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      logoElement = `<img src="${logoBase64}" alt="Logo" class="logo-img">`;
    } else {
      // Use URL in production/serverless environments
      logoElement = `<img src="${logoUrl}" alt="Logo" class="logo-img">`;
    }
  } catch {
    // Fallback to URL if filesystem access fails
    logoElement = `<img src="${logoUrl}" alt="Logo" class="logo-img">`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${invoice.invoiceNo}.pdf</title>
      <style>
        @page { 
          size: A4; 
          margin: 12mm 15mm 12mm 15mm;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          box-sizing: border-box;
        }
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif; 
          font-size: 11px; 
          line-height: 1.35; 
          color: #333; 
          background: white; 
        }
        .invoice-content {
          max-width: 100%;
          margin: 0 auto;
          background-color: white;
          padding: 0;
        }
        
        /* Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 8px;
        }
        .logo-container {
          background-color: white;
          padding: 4px;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 4px;
        }
        .logo-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          border-radius: 8px;
        }
        .logo-placeholder {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 8px;
          font-weight: bold;
          font-size: 9px;
          text-align: center;
        }
        .company-info {
          font-size: 10px;
          color: #666;
          line-height: 1.4;
          margin: 1px 0;
        }
        .company-info a {
          color: #0077b6;
          text-decoration: underline;
          font-weight: 600;
        }
        
        /* Invoice Details Section */
        .invoice-details {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }
        .invoice-number {
          font-weight: bold;
          font-size: 13px;
        }
        .date-section {
          text-align: right;
          font-size: 11px;
          line-height: 1.4;
        }
        
        /* To Address Section */
        .to-address {
          margin-bottom: 10px;
        }
        .to-address h3 {
          font-weight: bold;
          margin: 0 0 4px 0;
          font-size: 12px;
        }
        .to-address p {
          margin: 0;
          line-height: 1.4;
          font-size: 11px;
        }
        
        /* Annexure Section */
        .annexure-header {
          text-align: center;
          margin-bottom: 8px;
        }
        .annexure-header h3 {
          font-size: 14px;
          font-weight: bold;
          margin: 0;
        }
        .annexure-divider {
          width: 80px;
          height: 2px;
          background-color: #d1d5db;
          margin: 5px auto 0;
        }
        
        /* Table Styles */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
        }
        th, td {
          border: 1px solid #d1d5db;
          padding: 5px 6px;
          text-align: left;
          font-size: 10px;
          line-height: 1.3;
        }
        th {
          background-color: #e6f3ff !important;
          font-weight: 600;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        /* Financial Summary */
        .financial-summary {
          margin-bottom: 12px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 12px;
        }
        .total-due-row {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #d1d5db;
          padding-top: 6px;
          margin-top: 6px;
          font-weight: bold;
          font-size: 13px;
        }
        .amount-words {
          margin-top: 6px;
          font-size: 10px;
          line-height: 1.4;
        }
        .amount-words strong {
          display: block;
          margin-bottom: 3px;
        }
        .amount-words em {
          font-style: italic;
        }
        
        /* Account Details */
        .account-details {
          border: 1px solid #d1d5db;
          padding: 10px 12px;
          margin-bottom: 12px;
        }
        .account-details h4 {
          font-weight: bold;
          margin: 0 0 6px 0;
          font-size: 12px;
        }
        .account-details p {
          margin: 3px 0;
          font-size: 11px;
          line-height: 1.4;
        }
        .account-details .indent {
          margin-left: 4rem;
        }
        
        /* Disclaimer */
        .disclaimer {
          margin-bottom: 12px;
        }
        .disclaimer h4 {
          font-weight: bold;
          margin: 0 0 5px 0;
          font-size: 12px;
        }
        .disclaimer p {
          margin: 3px 0;
          font-size: 9px;
          line-height: 1.4;
        }
        
        /* Signature Section */
        .signature-section {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin: 14px 0 10px 0;
        }
        .signature-box {
          flex: 1;
          max-width: 48%;
        }
        .signature-box:first-child {
          margin-right: 1rem;
        }
        .signature-box:last-child {
          margin-left: 1rem;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          height: 28px;
          margin-bottom: 5px;
        }
        .signature-text {
          font-size: 11px;
          font-weight: 600;
        }
        .signature-subtext {
          font-size: 9px;
          color: #666;
        }
        
        /* Footer Text */
        .footer-text {
          font-size: 9px;
          color: #666;
          line-height: 1.4;
        }
        .footer-text p {
          margin: 3px 0;
        }
      </style>
    </head>
    <body>
      <div class="invoice-content">
        <!-- Header -->
        <div class="header-section">
          <div class="logo-container">
            ${logoElement}
          </div>
          <p class="company-info">
            <a href="https://www.mothersauradiamonds.com">www.mothersauradiamonds.com</a>
          </p>
          <p class="company-info">
            203-Bhav resiedency, Thane 421304 India
          </p>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details">
          <div>
            <h2 class="invoice-number">Invoice No: ${invoice.invoiceNo}</h2>
          </div>
          <div class="date-section">
            <p>Date: ${formatDate(invoice.date)}</p>
            <p>Due Date: ${formatDate(invoice.dueDate)}</p>
            <p>Payment Terms: ${invoice.paymentTerms} days</p>
          </div>
        </div>

        <!-- To Address -->
        <div class="to-address">
          <h3>To:</h3>
          <p>${invoice.companyName}</p>
          <p>${invoice.addressLine1}</p>
          ${invoice.addressLine2 ? `<p>${invoice.addressLine2}</p>` : ''}
          <p>${invoice.city}, ${invoice.state} ${invoice.postalCode}</p>
          <p>${invoice.country}</p>
        </div>

        <!-- Annexure Table -->
        <div class="annexure-header">
          <h3>Annexure</h3>
          <div class="annexure-divider"></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center">Carat</th>
              <th>Color & Clarity</th>
              <th class="text-center">Lab</th>
              <th class="text-center">Report No.</th>
              <th class="text-right">Price/ct (USD)</th>
              <th class="text-right">Total (USD)</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item) => {
              const itemTotal = calculateTotal(Number(item.carat) || 0, Number(item.pricePerCarat) || 0);
              return `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-center">${(Number(item.carat) || 0).toFixed(2)}</td>
                  <td>${item.color} ${item.clarity}</td>
                  <td class="text-center">${item.lab}</td>
                  <td class="text-center">${item.reportNo}</td>
                  <td class="text-right">${formatCurrencyUSD(Number(item.pricePerCarat) || 0)}</td>
                  <td class="text-right">${formatCurrencyUSD(itemTotal)}</td>
                </tr>
              `;
            }).join('')}
            <tr>
              <td colspan="6" class="text-right font-bold">Grand Total:</td>
              <td class="text-right font-bold">${formatCurrencyUSD(subtotal)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Financial Summary -->
        <div class="financial-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${formatCurrencyUSD(subtotal)}</span>
          </div>
          ${invoice.discount > 0 ? `
          <div class="summary-row">
            <span>Discount:</span>
            <span>${formatCurrencyUSD(invoice.discount)}</span>
          </div>
          ` : ''}
          ${invoice.crPayment > 0 ? `
          <div class="summary-row">
            <span>CR Payment:</span>
            <span>${formatCurrencyUSD(invoice.crPayment)}</span>
          </div>
          ` : ''}
          ${invoice.shipmentCost > 0 ? `
          <div class="summary-row">
            <span>Shipping:</span>
            <span>${formatCurrencyUSD(invoice.shipmentCost)}</span>
          </div>
          ` : ''}
          <div class="total-due-row">
            <span>Total Due:</span>
            <span>${formatCurrencyUSD(totalAmount)}</span>
          </div>
          <div class="amount-words">
            <strong>Amount in words:</strong>
            <em>${amountInWords}</em>
          </div>
        </div>

        <!-- Account Details -->
        <div class="account-details">
          <h4>ACCOUNT DETAILS</h4>
          <p><strong>BENEFICIARY NAME</strong> - MOTHERS AURA</p>
          <p><strong>BANK NAME</strong> - CITIBANK</p>
          <p><strong>ADDRESS</strong> - 111 WALL STREET,</p>
          <p class="indent">NEW YORK, NY 10043 USA</p>
          <p><strong>SWIFT</strong> - CITIUS33</p>
          <p><strong>ACCOUNT NUMBER</strong> - 70585610001874252</p>
          <p><strong>ACCOUNT TYPE</strong> - CHECKING</p>
        </div>

        <!-- Disclaimer -->
        <div class="disclaimer">
          <h4>DISCLAIMER:</h4>
          <p>1. The goods invoiced herein above are LABORATORY GROWN DIAMONDS. These laboratory grown diamonds are optically, chemically physically identical to mined diamonds.</p>
          <p>2. All subsequent future sale of these diamonds must be accompanies by disclosure of their origin as LABORATORY GROWN DIAMONDS.</p>
          <p>3. These goods remain the property of the seller until full payment is received. Full payment only transfers the ownership, regardless the conditions of this invoice. In case the purchaser takes delivery of goods prior to full payment he will be considered, not as owner, whilst purchaser remains fully liable for any loss or damage.</p>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-text">For Mothers Aura Diamonds</p>
            <p class="signature-subtext">Authorized Signatory</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-text">For ${invoice.companyName}</p>
            <p class="signature-subtext">Customer Signatory</p>
          </div>
        </div>

        <!-- Footer Text -->
        <div class="footer-text">
          <p>The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and are compliance with United Nations Resolutions. I hereby guarantee that these diamonds are conflict free, based on personal knowledge and/ or written guarantees provided by the supplier of these diamonds. Mothers aura diamonds deals only in Lab Grown Diamonds. All diamonds invoiced are Lab Grown Diamonds immaterial if its certified or non-certified.</p>
          <br>
          <p>Received the above goods on the terms and conditions set out</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function generateInvoicePDFBuffer(invoice: InvoiceData): Promise<Buffer> {
  let browser: Browser | undefined;
  try {
    const html = generateInvoiceHTML(invoice);
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-dev-shm-usage'
      ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: ['networkidle0', 'domcontentloaded', 'load'], timeout: 60000 });
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const images = Array.from(document.querySelectorAll('img'));
        if (images.length === 0) return resolve();
        let loaded = 0; const total = images.length;
        const check = () => { if (loaded === total) resolve(); };
        images.forEach((img) => {
          if ((img as HTMLImageElement).complete) { loaded++; check(); }
          else {
            (img as HTMLImageElement).onload = () => { loaded++; check(); };
            (img as HTMLImageElement).onerror = () => { loaded++; check(); };
          }
        });
        setTimeout(resolve, 5000);
      });
    });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '12mm', right: '15mm', bottom: '12mm', left: '15mm' },
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1.0,
      displayHeaderFooter: false,
      timeout: 60000
    });
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) await browser.close();
  }
}

export function generateMemoHTML(memo: MemoData): string {
  const subtotal = memo.items.reduce((total, item) => total + calculateTotal(Number(item.carat) || 0, Number(item.pricePerCarat) || 0), 0);
  const totalAmount = subtotal - (Number(memo.discount) || 0) - (Number(memo.crPayment) || 0) + (Number(memo.shipmentCost) || 0);
  
  // Generate amount in words if not provided
  const amountInWords = memo.amountInWords || convertNumberToWords(totalAmount);

  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

  // Use public URL for logo - works in both dev and production
  // Use logoWithDescbg.png which is the actual hosted logo asset
  const logoUrl = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/logoWithDescbg.png`
    : 'https://mothersauradiamonds.com/logoWithDescbg.png';
  
  let logoElement = '';
  try {
    // Try filesystem first (works in dev)
    const logoPath = path.join(process.cwd(), 'public', 'logoWithDescbg.png');
    if (typeof fs.existsSync === 'function' && fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      logoElement = `<img src="${logoBase64}" alt="Logo" class="logo-img">`;
    } else {
      // Use URL in production/serverless environments
      logoElement = `<img src="${logoUrl}" alt="Logo" class="logo-img">`;
    }
  } catch {
    // Fallback to URL if filesystem access fails
    logoElement = `<img src="${logoUrl}" alt="Logo" class="logo-img">`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${memo.memoNo}.pdf</title>
      <style>
        @page { 
          size: A4; 
          margin: 12mm 15mm 12mm 15mm;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          box-sizing: border-box;
        }
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif; 
          font-size: 11px; 
          line-height: 1.35; 
          color: #333; 
          background: white; 
        }
        .memo-content {
          max-width: 100%;
          margin: 0 auto;
          background-color: white;
          padding: 0;
        }
        
        /* Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 8px;
        }
        .logo-container {
          background-color: white;
          padding: 4px;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 4px;
        }
        .logo-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          border-radius: 8px;
        }
        .logo-placeholder {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 8px;
          font-weight: bold;
          font-size: 9px;
          text-align: center;
        }
        .company-info {
          font-size: 10px;
          color: #666;
          line-height: 1.4;
          margin: 1px 0;
        }
        .company-info a {
          color: #0077b6;
          text-decoration: underline;
          font-weight: 600;
        }
        
        /* Memo Details Section */
        .memo-details {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }
        .memo-number {
          font-weight: bold;
          font-size: 13px;
        }
        .date-section {
          text-align: right;
          font-size: 11px;
          line-height: 1.4;
        }
        
        /* To Address Section */
        .to-address {
          margin-bottom: 10px;
        }
        .to-address h3 {
          font-weight: bold;
          margin: 0 0 4px 0;
          font-size: 12px;
        }
        .to-address p {
          margin: 0;
          line-height: 1.4;
          font-size: 11px;
        }
        
        /* Memorandum Section */
        .memorandum-header {
          text-align: center;
          margin-bottom: 8px;
        }
        .memorandum-header h3 {
          font-size: 14px;
          font-weight: bold;
          margin: 0;
        }
        .memorandum-divider {
          width: 80px;
          height: 2px;
          background-color: #d1d5db;
          margin: 5px auto 0;
        }
        
        /* Table Styles */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
        }
        th, td {
          border: 1px solid #d1d5db;
          padding: 5px 6px;
          text-align: left;
          font-size: 10px;
          line-height: 1.3;
        }
        th {
          background-color: #e6f3ff !important;
          font-weight: 600;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        /* Financial Summary */
        .financial-summary {
          margin-bottom: 12px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 12px;
        }
        .total-due-row {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #d1d5db;
          padding-top: 6px;
          margin-top: 6px;
          font-weight: bold;
          font-size: 13px;
        }
        .amount-words {
          margin-top: 6px;
          font-size: 10px;
          line-height: 1.4;
        }
        .amount-words strong {
          display: block;
          margin-bottom: 3px;
        }
        .amount-words em {
          font-style: italic;
        }
        
        /* Account Details */
        .account-details {
          border: 1px solid #d1d5db;
          padding: 10px 12px;
          margin-bottom: 12px;
        }
        .account-details h4 {
          font-weight: bold;
          margin: 0 0 6px 0;
          font-size: 12px;
        }
        .account-details p {
          margin: 3px 0;
          font-size: 11px;
          line-height: 1.4;
        }
        .account-details .indent {
          margin-left: 4rem;
        }
        
        /* Disclaimer */
        .disclaimer {
          margin-bottom: 12px;
        }
        .disclaimer h4 {
          font-weight: bold;
          margin: 0 0 5px 0;
          font-size: 12px;
        }
        .disclaimer p {
          margin: 3px 0;
          font-size: 9px;
          line-height: 1.4;
        }
        
        /* Signature Section */
        .signature-section {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin: 14px 0 10px 0;
        }
        .signature-box {
          flex: 1;
          max-width: 48%;
        }
        .signature-box:first-child {
          margin-right: 1rem;
        }
        .signature-box:last-child {
          margin-left: 1rem;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          height: 28px;
          margin-bottom: 5px;
        }
        .signature-text {
          font-size: 11px;
          font-weight: 600;
        }
        .signature-subtext {
          font-size: 9px;
          color: #666;
        }
        
        /* Footer Text */
        .footer-text {
          font-size: 9px;
          color: #666;
          line-height: 1.4;
        }
        .footer-text p {
          margin: 3px 0;
        }
      </style>
    </head>
    <body>
      <div class="memo-content">
        <!-- Header -->
        <div class="header-section">
          <div class="logo-container">
            ${logoElement}
          </div>
          <p class="company-info">
            <a href="https://www.mothersauradiamonds.com">www.mothersauradiamonds.com</a>
          </p>
          <p class="company-info">
            203-Bhav resiedency, Thane 421304 India
          </p>
        </div>

        <!-- Memo Details -->
        <div class="memo-details">
          <div>
            <h2 class="memo-number">Memo No: ${memo.memoNo}</h2>
          </div>
          <div class="date-section">
            <p>Date: ${formatDate(memo.date)}</p>
            <p>Due Date: ${formatDate(memo.dueDate)}</p>
            <p>Payment Terms: ${memo.paymentTerms} days</p>
          </div>
        </div>

        <!-- To Address -->
        <div class="to-address">
          <h3>To:</h3>
          <p>${memo.companyName}</p>
          <p>${memo.addressLine1}</p>
          ${memo.addressLine2 ? `<p>${memo.addressLine2}</p>` : ''}
          <p>${memo.city}, ${memo.state} ${memo.postalCode}</p>
          <p>${memo.country}</p>
        </div>

        <!-- Memorandum Table -->
        <div class="memorandum-header">
          <h3>Memorandum</h3>
          <div class="memorandum-divider"></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center">Carat</th>
              <th>Color & Clarity</th>
              <th class="text-center">Lab</th>
              <th class="text-center">Report No.</th>
              <th class="text-right">Price/ct (USD)</th>
              <th class="text-right">Total (USD)</th>
            </tr>
          </thead>
          <tbody>
            ${memo.items.map((item) => {
              const itemTotal = calculateTotal(Number(item.carat) || 0, Number(item.pricePerCarat) || 0);
              return `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-center">${(Number(item.carat) || 0).toFixed(2)}</td>
                  <td>${item.color} ${item.clarity}</td>
                  <td class="text-center">${item.lab}</td>
                  <td class="text-center">${item.reportNo}</td>
                  <td class="text-right">${formatCurrencyUSD(Number(item.pricePerCarat) || 0)}</td>
                  <td class="text-right">${formatCurrencyUSD(itemTotal)}</td>
                </tr>
              `;
            }).join('')}
            <tr>
              <td colspan="6" class="text-right font-bold">Grand Total:</td>
              <td class="text-right font-bold">${formatCurrencyUSD(subtotal)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Financial Summary -->
        <div class="financial-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${formatCurrencyUSD(subtotal)}</span>
          </div>
          ${memo.discount > 0 ? `
          <div class="summary-row">
            <span>Discount:</span>
            <span>${formatCurrencyUSD(memo.discount)}</span>
          </div>
          ` : ''}
          ${memo.crPayment > 0 ? `
          <div class="summary-row">
            <span>CR Payment:</span>
            <span>${formatCurrencyUSD(memo.crPayment)}</span>
          </div>
          ` : ''}
          ${memo.shipmentCost > 0 ? `
          <div class="summary-row">
            <span>Shipping:</span>
            <span>${formatCurrencyUSD(memo.shipmentCost)}</span>
          </div>
          ` : ''}
          <div class="total-due-row">
            <span>Total Due:</span>
            <span>${formatCurrencyUSD(totalAmount)}</span>
          </div>
          <div class="amount-words">
            <strong>Amount in words:</strong>
            <em>${amountInWords}</em>
          </div>
        </div>

        <!-- Account Details -->
        <div class="account-details">
          <h4>ACCOUNT DETAILS</h4>
          <p><strong>BENEFICIARY NAME</strong> - MOTHERS AURA</p>
          <p><strong>BANK NAME</strong> - CITIBANK</p>
          <p><strong>ADDRESS</strong> - 111 WALL STREET,</p>
          <p class="indent">NEW YORK, NY 10043 USA</p>
          <p><strong>SWIFT</strong> - CITIUS33</p>
          <p><strong>ACCOUNT NUMBER</strong> - 70585610001874252</p>
          <p><strong>ACCOUNT TYPE</strong> - CHECKING</p>
        </div>

        <!-- Disclaimer -->
        <div class="disclaimer">
          <h4>DISCLAIMER:</h4>
          <p>1. The goods invoiced herein above are LABORATORY GROWN DIAMONDS. These laboratory grown diamonds are optically, chemically physically identical to mined diamonds.</p>
          <p>2. All subsequent future sale of these diamonds must be accompanies by disclosure of their origin as LABORATORY GROWN DIAMONDS.</p>
          <p>3. These goods remain the property of the seller until full payment is received. Full payment only transfers the ownership, regardless the conditions of this memo. In case the purchaser takes delivery of goods prior to full payment he will be considered, not as owner, whilst purchaser remains fully liable for any loss or damage.</p>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-text">For Mothers Aura Diamonds</p>
            <p class="signature-subtext">Authorized Signatory</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-text">For ${memo.companyName}</p>
            <p class="signature-subtext">Customer Signatory</p>
          </div>
        </div>

        <!-- Footer Text -->
        <div class="footer-text">
          <p>The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and are compliance with United Nations Resolutions. I hereby guarantee that these diamonds are conflict free, based on personal knowledge and/ or written guarantees provided by the supplier of these diamonds. Mothers aura diamonds deals only in Lab Grown Diamonds. All diamonds invoiced are Lab Grown Diamonds immaterial if its certified or non-certified.</p>
          <br>
          <p>Received the above goods on the terms and conditions set out</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function generateMemoPDFBuffer(memo: MemoData): Promise<Buffer> {
  let browser: Browser | undefined;
  try {
    const html = generateMemoHTML(memo);
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-dev-shm-usage'
      ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: ['networkidle0', 'domcontentloaded', 'load'], timeout: 60000 });
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const images = Array.from(document.querySelectorAll('img'));
        if (images.length === 0) return resolve();
        let loaded = 0; const total = images.length;
        const check = () => { if (loaded === total) resolve(); };
        images.forEach((img) => {
          if ((img as HTMLImageElement).complete) { loaded++; check(); }
          else {
            (img as HTMLImageElement).onload = () => { loaded++; check(); };
            (img as HTMLImageElement).onerror = () => { loaded++; check(); };
          }
        });
        setTimeout(resolve, 5000);
      });
    });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '12mm', right: '15mm', bottom: '12mm', left: '15mm' },
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1.0,
      displayHeaderFooter: false,
      timeout: 60000
    });
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) await browser.close();
  }
}