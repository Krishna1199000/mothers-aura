import * as nodemailer from 'nodemailer';
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

// Create Nodemailer transporter for GoDaddy email
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net", // GoDaddy SMTP server
  port: 465, // SSL port
  secure: true, // Use SSL
  auth: {
    user: "admintejas@mothersauradiamonds.com",
    pass: "ILoveMothersauraDiamonds",
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in database with expiry
export const storeOTP = async (email: string, otp: string, type: 'signup' | 'password-reset' | 'password-change') => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  await prisma.verificationToken.create({
    data: {
      identifier: `${type}:${email}`,
      token: otp,
      expires: expiresAt,
    },
  });
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string, type: 'signup' | 'password-reset' | 'password-change') => {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: `${type}:${email}`,
      token: otp,
      expires: {
        gt: new Date(),
      },
    },
  });

  if (verificationToken) {
    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    });
    return true;
  }

  return false;
};

// Email Templates
// Helper to provide company logo for emails (prefer hosted URL for email client reliability)
const getLogoForEmail = (): string => {
  return 'https://mothersauradiamonds.com/logobg.png';
};

// Professional, reusable email shell matching the reference design (header/logo, styled content, footer)
const createEmailTemplate = ({
  logoUrl,
  title,
  content,
  footerContent = ''
}: {
  logoUrl: string;
  title: string;
  content: string;
  footerContent?: string;
}): string => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              line-height: 1.6; 
              color: #333333; 
              background-color: #f8f9fa;
          }
          .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
              background: #ffffff; 
              color: #333333; 
              padding: 40px 30px; 
              text-align: center; 
              border-bottom: 2px solid #e2e8f0;
          }
          .logo { 
              max-width: 180px; 
              height: auto; 
              margin-bottom: 20px; 
              display: block;
              margin-left: auto;
              margin-right: auto;
          }
          .header h1 { font-size: 28px; font-weight: 600; margin-bottom: 8px; color: #1a1a1a; }
          .header p { font-size: 16px; color: #4a5568; }
          .content { padding: 40px 30px; color: #333333; }
          .content h2, .content h3 { color: #1a1a1a; margin-bottom: 16px; }
          .content p { color: #4a5568; margin-bottom: 16px; font-size: 16px; }
          .content ul, .content ol { padding-left: 20px; margin-bottom: 16px; }
          .content li { color: #4a5568; margin-bottom: 8px; }
          .highlight { 
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); 
              padding: 24px; 
              border-radius: 12px; 
              margin: 24px 0; 
              border-left: 4px solid #764ba2; 
          }
          .highlight h3 { color: #1a202c; margin-bottom: 12px; }
          .highlight p { color: #2d3748; margin-bottom: 8px; }
          .amount { font-size: 32px; font-weight: 700; color: #38a169; display: inline-block; }
          .otp-code {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              margin: 24px 0;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: 4px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .footer { 
              background: white; 
              color: #333333; 
              padding: 30px; 
              text-align: center; 
              border-top: 2px solid #e2e8f0;
          }
          .footer-logo { max-width: 140px; height: auto; margin-bottom: 16px; filter: brightness(1.1); display: block; margin-left: auto; margin-right: auto; }
          .footer p { color: #4a5568; margin-bottom: 8px; font-size: 14px; }
          .footer a { color: #764ba2; text-decoration: none; }
          .footer a:hover { text-decoration: underline; color: #5b3f86; }
          .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 16px 0; font-weight: 600; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              ${logoUrl ? `<img src="${logoUrl}" alt="Mothers Aura Logo" class="logo">` : ''}
              <h1>${title}</h1>
              <p>Premium Diamond Jewellery</p>
          </div>
          <div class="content">
              ${content}
          </div>
          <div class="footer">
              ${logoUrl ? `<img src="${logoUrl}" alt="Mothers Aura Logo" class="footer-logo">` : ''}
              <p><strong style="color: #1a1a1a;">Mothers Aura Diamonds</strong></p>
              <p>Email: <a href="mailto:admintejas@mothersauradiamonds.com">admintejas@mothersauradiamonds.com</a></p>
              <p>Website: <a href="https://mothersauradiamonds.com" target="_blank">mothersauradiamonds.com</a></p>
              ${footerContent}
          </div>
      </div>
  </body>
  </html>
`;

const otpEmailTemplate = (otp: string, type: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0; font-size: 28px;">Mothers Aura</h1>
        <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Premium Diamond Jewellery</p>
      </div>
      
      <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Your Verification Code</h2>
      
      <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Use the following code to ${type}:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 40px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          ${otp}
        </div>
      </div>
      
      <p style="color: #999; font-size: 14px; text-align: center; margin: 30px 0;">
        This code will expire in 10 minutes.
      </p>
      
      <p style="color: #999; font-size: 14px; text-align: center; margin: 20px 0;">
        If you didn't request this code, please ignore this email.
      </p>
      
      <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © 2024 Mothers Aura. All rights reserved.
        </p>
      </div>
    </div>
  </div>
`;

const invoiceEmailTemplate = (invoiceNumber: string) => {
  const logoUrl = getLogoForEmail();
  const content = `
    <p>Dear <strong>Customer</strong>,</p>
    <p>Thank you for choosing Mothers Aura Diamonds. Your invoice has been generated and is attached for your records.</p>
    <div class="highlight">
      <h3>Invoice Details</h3>
      <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <h3>What's Next?</h3>
    <ul>
      <li>Your invoice is attached to this email as a PDF</li>
      <li>Our team will process your order and arrange shipping</li>
      <li>We’re available for any questions you may have</li>
    </ul>
    <h3>Need Assistance?</h3>
    <p>If you have any questions about your purchase or need additional support, please contact us.</p>
  `;
  return createEmailTemplate({ logoUrl, title: 'Invoice Generated', content });
};

// Exact-format invoice email (reference-style) with dynamic fields
export async function sendInvoiceEmailDetailed({
  to,
  customerName,
  invoiceNo,
  totalAmount,
  pdfBuffer
}: {
  to: string;
  customerName: string;
  invoiceNo: string;
  totalAmount: number;
  pdfBuffer: Buffer;
}): Promise<void> {
  const logoUrl = getLogoForEmail();
  const title = 'Thank You for Your Purchase!';
  const content = `
    <p>Dear <strong>${customerName}</strong>,</p>
    <p>Thank you for choosing Mothers Aura Diamonds. We are delighted to confirm your recent purchase and have attached your invoice for your records.</p>
    <div class="highlight">
      <h3>Invoice Details</h3>
      <p><strong>Invoice Number:</strong> ${invoiceNo}</p>
      <p><strong>Total Amount:</strong> <span class="amount">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <h3>What's Next?</h3>
    <ul>
      <li>Your invoice is attached to this email as a PDF</li>
      <li>Our team will process your order and arrange shipping</li>
      <li>Our customer service team is available for any questions</li>
    </ul>
    <h3>Need Assistance?</h3>
    <p>If you have any questions about your purchase or need additional support, please don't hesitate to contact us:</p>
    <ul>
      <li><strong>Email:</strong> <a href="mailto:admintejas@mothersauradiamonds.com">admintejas@mothersauradiamonds.com</a></li>
      <li><strong>Website:</strong> <a href="https://mothersauradiamonds.com" target="_blank">mothersauradiamonds.com</a></li>
      <li><strong>Address:</strong> 203-Bhav resiedency, Thane 421304, Maharastra, India.</li>
    </ul>
    <p style="color:#333;margin-top:24px;">We truly appreciate your business and look forward to serving you again. Thank you for trusting Mothers Aura Diamonds with your diamond needs.</p>
    <p style="margin: 32px 0 8px 0; color:#333;">Warm regards,<br><strong>The Mothers Aura Diamond Team</strong></p>
  `;

  const html = createEmailTemplate({
    logoUrl,
    title,
    content,
    footerContent: '<p>203-Bhav resiedency, Thane 421304, Maharastra, India.</p>'
  });

  const safeInvoiceNo = invoiceNo.replace(/\/?/g, '-');

  // Basic validation to ensure the PDF buffer is not empty and starts with PDF magic number
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error('PDF buffer is empty or invalid');
  }
  const pdfHeader = pdfBuffer.slice(0, 4).toString('hex');
  if (pdfHeader !== '25504446') {
    throw new Error('Generated buffer is not a valid PDF file');
  }

  await transporter.sendMail({
    from: '"Mothers Aura" <admintejas@mothersauradiamonds.com>',
    to,
    subject: `Invoice ${invoiceNo} - Thank you for your purchase from Mothers Aura Diamonds`,
    html,
    attachments: [{ filename: `Invoice-${safeInvoiceNo}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
  });
}

// Exact-format memo email (same as invoice email) with dynamic fields
export async function sendMemoEmailDetailed({
  to,
  customerName,
  memoNo,
  totalAmount,
  pdfBuffer
}: {
  to: string;
  customerName: string;
  memoNo: string;
  totalAmount: number;
  pdfBuffer: Buffer;
}): Promise<void> {
  const logoUrl = getLogoForEmail();
  const title = 'Your Memo from Mothers Aura Diamonds';
  const content = `
    <p>Dear <strong>${customerName}</strong>,</p>
    <p>Thank you for choosing Mothers Aura Diamonds. We are pleased to provide your memo and have attached it for your records.</p>
    <div class="highlight">
      <h3>Memo Details</h3>
      <p><strong>Memo Number:</strong> ${memoNo}</p>
      <p><strong>Total Amount:</strong> <span class="amount">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <h3>What's Next?</h3>
    <ul>
      <li>Your memo is attached to this email as a PDF</li>
      <li>Our team will process your order and arrange shipping</li>
      <li>Our customer service team is available for any questions</li>
    </ul>
    <h3>Need Assistance?</h3>
    <p>If you have any questions about your memo or need additional support, please don't hesitate to contact us:</p>
    <ul>
      <li><strong>Email:</strong> <a href="mailto:admintejas@mothersauradiamonds.com">admintejas@mothersauradiamonds.com</a></li>
      <li><strong>Website:</strong> <a href="https://mothersauradiamonds.com" target="_blank">mothersauradiamonds.com</a></li>
      <li><strong>Address:</strong> 203-Bhav resiedency, Thane 421304, Maharastra, India.</li>
    </ul>
    <p style="color:#333;margin-top:24px;">We truly appreciate your business and look forward to serving you again. Thank you for trusting Mothers Aura Diamonds with your diamond needs.</p>
    <p style="margin: 32px 0 8px 0; color:#333;">Warm regards,<br><strong>The Mothers Aura Diamond Team</strong></p>
  `;

  const html = createEmailTemplate({
    logoUrl,
    title,
    content,
    footerContent: '<p>203-Bhav resiedency, Thane 421304, Maharastra, India.</p>'
  });

  const safeMemoNo = memoNo.replace(/\/?/g, '-');

  // Basic validation to ensure the PDF buffer is not empty and starts with PDF magic number
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error('PDF buffer is empty or invalid');
  }
  const pdfHeader = pdfBuffer.slice(0, 4).toString('hex');
  if (pdfHeader !== '25504446') {
    throw new Error('Generated buffer is not a valid PDF file');
  }

  await transporter.sendMail({
    from: '"Mothers Aura" <admintejas@mothersauradiamonds.com>',
    to,
    subject: `Memo ${memoNo} - From Mothers Aura Diamonds`,
    html,
    attachments: [{ filename: `Memo-${safeMemoNo}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
  });
}

const chatNotificationTemplate = (name: string, email: string, message: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0; font-size: 28px;">Mothers Aura</h1>
        <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Premium Diamond Jewellery</p>
      </div>
      
      <h2 style="color: #333; margin-bottom: 20px;">New Chat Message</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #333; font-size: 16px; margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
        <p style="color: #333; font-size: 16px; margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
        <p style="color: #333; font-size: 16px; margin: 0 0 10px 0;"><strong>Message:</strong></p>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">${message}</p>
      </div>
      
      <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © 2024 Mothers Aura. All rights reserved.
        </p>
      </div>
    </div>
  </div>
`;

// Send OTP Email
export const sendOTPEmail = async (email: string, otp: string, type: 'signup' | 'password-reset' | 'password-change') => {
  try {
    const typeText = type === 'signup' ? 'complete your signup' 
      : type === 'password-reset' ? 'reset your password' 
      : 'change your password';

    console.log(`Sending OTP email to ${email} with OTP: ${otp}`);

    await transporter.sendMail({
      from: '"Mothers Aura" <admintejas@mothersauradiamonds.com>',
      to: email,
      subject: `Your Verification Code for ${typeText}`,
      html: otpEmailTemplate(otp, typeText),
    });

    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Send Invoice Email
export const sendInvoiceEmail = async (email: string, invoiceNumber: string, attachmentBuffer: Buffer) => {
  await transporter.sendMail({
    from: '"Mothers Aura" <admintejas@mothersauradiamonds.com>',
    to: email,
    subject: `Invoice #${invoiceNumber} - Thank you for your purchase from Mothers Aura Diamonds`,
    html: invoiceEmailTemplate(invoiceNumber),
    attachments: [{ filename: `invoice-${invoiceNumber}.pdf`, content: attachmentBuffer }],
  });
};

// Send Chat Notification
export const sendChatNotification = async (name: string, email: string, message: string) => {
  await transporter.sendMail({
    from: '"Mothers Aura Chat" <admintejas@mothersauradiamonds.com>',
    to: "admintejas@mothersauradiamonds.com",
    subject: "New Chat Message",
    html: chatNotificationTemplate(name, email, message),
  });
};

const appointmentEmailTemplate = (formData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
}) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; padding: 20px 0;">
      <tr>
        <td style="padding: 20px 0;">
          <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="background: #ffffff; padding: 40px 30px; text-align: center; border-bottom: 1px solid #e9ecef;">
                <img src="https://mothersauradiamonds.com/logobg.png" alt="Mothers Aura Logo" style="height:90px; width:auto; display:block; margin:0 auto 0 auto;" />
                <p style="color: #333333; margin: 8px 0 0 0; font-size: 16px;">Premium Diamond Jewellery</p>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px; background-color:#ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #ffffff; font-size: 28px; font-weight: bold;">📅</span>
                  </div>
                  <h2 style="color: #333333; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">New Appointment Booking Request</h2>
                  <p style="color: #666666; margin: 0; font-size: 14px;">Please review the details below</p>
                </div>
                
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                  <tr>
                    <td style="padding: 25px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                  <span style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</span>
                                </td>
                                <td style="color: #333333; font-size: 15px; font-weight: 500;">${formData.name}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                  <span style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                                </td>
                                <td style="color: #333333; font-size: 15px; font-weight: 500;">${formData.email}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                  <span style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
                                </td>
                                <td style="color: #333333; font-size: 15px; font-weight: 500;">${formData.phone}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                  <span style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Date</span>
                                </td>
                                <td style="color: #333333; font-size: 15px; font-weight: 500;">${formData.date}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                  <span style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Time</span>
                                </td>
                                <td style="color: #333333; font-size: 15px; font-weight: 500;">${formData.time}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                ${formData.message ? `
                <div style="background: #e9ecef; padding: 2px; border-radius: 8px; margin-bottom: 30px;">
                  <div style="background-color: #ffffff; border-radius: 6px; padding: 25px;">
                    <p style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Additional Message</p>
                    <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0;">${formData.message}</p>
                  </div>
                </div>
                ` : ''}
                
                <div style="background-color: #fff4e6; border-left: 4px solid #667eea; padding: 15px 20px; border-radius: 6px; margin-bottom: 30px;">
                  <p style="color: #333333; font-size: 13px; margin: 0; line-height: 1.6;">
                    <strong style="color: #667eea;">Note:</strong> Please contact the customer to confirm the appointment time and availability.
                  </p>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999999; font-size: 12px; margin: 0 0 8px 0;">
                  © 2024 Mothers Aura Diamonds. All rights reserved.
                </p>
                <p style="color: #cccccc; font-size: 11px; margin: 0;">
                  This is an automated notification email. Please do not reply directly to this message.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

// Customer-facing appointment confirmation (thank-you tone) with white background
const appointmentCustomerEmailTemplate = (formData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
}) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;background-color:#ffffff;">
    <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#ffffff;padding:20px 0;">
      <tr>
        <td>
          <table role="presentation" style="width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;border:1px solid #e9ecef;overflow:hidden;">
            <tr>
              <td style="background:#ffffff;padding:40px 30px;text-align:center;border-bottom:1px solid #e9ecef;">
                <img src="https://mothersauradiamonds.com/logobg.png" alt="Mothers Aura Logo" style="height:90px;width:auto;display:block;margin:0 auto;" />
                <p style="color:#333333;margin:8px 0 0 0;font-size:16px;">Premium Diamond Jewellery</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 30px;background:#ffffff;">
                <h2 style="margin:0 0 8px 0;color:#1a1a1a;font-weight:700;font-size:22px;text-align:center;">Thank you! We received your appointment request.</h2>
                <p style="margin:0 0 20px 0;color:#4a5568;font-size:15px;text-align:center;">Our team will review your request and book the appointment. We’ll get back to you shortly with confirmation.</p>

                <div style="background:#f8f9fa;border-radius:8px;border:1px solid #e9ecef;padding:20px;margin-bottom:24px;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e9ecef;">
                        <strong style="display:inline-block;width:120px;color:#667eea;text-transform:uppercase;letter-spacing:.5px;font-size:12px;">Name</strong>
                        <span style="color:#333333;font-size:15px;font-weight:500;">${formData.name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e9ecef;">
                        <strong style="display:inline-block;width:120px;color:#667eea;text-transform:uppercase;letter-spacing:.5px;font-size:12px;">Email</strong>
                        <span style="color:#333333;font-size:15px;font-weight:500;">${formData.email}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e9ecef;">
                        <strong style="display:inline-block;width:120px;color:#667eea;text-transform:uppercase;letter-spacing:.5px;font-size:12px;">Phone</strong>
                        <span style="color:#333333;font-size:15px;font-weight:500;">${formData.phone}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e9ecef;">
                        <strong style="display:inline-block;width:120px;color:#667eea;text-transform:uppercase;letter-spacing:.5px;font-size:12px;">Date</strong>
                        <span style="color:#333333;font-size:15px;font-weight:500;">${formData.date}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;">
                        <strong style="display:inline-block;width:120px;color:#667eea;text-transform:uppercase;letter-spacing:.5px;font-size:12px;">Time</strong>
                        <span style="color:#333333;font-size:15px;font-weight:500;">${formData.time}</span>
                      </td>
                    </tr>
                  </table>
                </div>

                ${formData.message ? `
                <div style="background:#ffffff;border:1px solid #e9ecef;border-radius:8px;padding:16px;margin-bottom:20px;">
                  <p style="color:#667eea;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin:0 0 8px 0;">Additional Message</p>
                  <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0;">${formData.message}</p>
                </div>
                ` : ''}

                <p style="color:#4a5568;font-size:14px;margin-top:16px;text-align:center;">If any detail needs changes, just reply to this email and we’ll update your booking.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;padding:24px;text-align:center;border-top:1px solid #e9ecef;">
                <p style="color:#999999;font-size:12px;margin:0 0 6px 0;">© 2024 Mothers Aura Diamonds. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

// Send Appointment Email
export const sendAppointmentEmail = async (formData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
}) => {
  try {
    console.log(`Sending appointment email to ${formData.email}`);
    const htmlCustomer = appointmentCustomerEmailTemplate(formData);
    const htmlAdmin = appointmentEmailTemplate(formData);

    // 1) Send confirmation to customer
    await transporter.sendMail({
      from: '"Mothers Aura" <admintejas@mothersauradiamonds.com>',
      to: formData.email,
      subject: "Thanks! We received your appointment request",
      html: htmlCustomer,
    });

    // 2) Notify admin with customer's request as well
    await transporter.sendMail({
      from: '"Mothers Aura" <admintejas@mothersauradiamonds.com>',
      to: 'admintejas@mothersauradiamonds.com',
      subject: `Appointment Request: ${formData.name} (${formData.email})`,
      html: htmlAdmin,
      replyTo: formData.email,
    });

    console.log(`Appointment email sent successfully to ${formData.email}`);
  } catch (error) {
    console.error('Error sending appointment email:', error);
    throw error;
  }
};

// Send Email for general inquiries
export const sendGeneralInquiryEmail = async (name: string, email: string, subject: string, message: string) => {
  try {
    console.log(`Sending general inquiry email to admin from ${email}`);

    const logoUrl = getLogoForEmail();
    const content = `
      <p>Dear <strong>Admin</strong>,</p>
      <p>You have received a new general inquiry from ${name} (${email}):</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">${message}</p>
    `;

    const html = createEmailTemplate({
      logoUrl,
      title: "New General Inquiry",
      content,
      footerContent: '<p>203-Bhav resiedency, Thane 421304, Maharastra, India.</p>'
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "admintejas@mothersauradiamonds.com",
      subject: `New General Inquiry: ${subject}`,
      html,
    });

    console.log(`General inquiry email sent successfully to admin`);
  } catch (error) {
    console.error('Error sending general inquiry email:', error);
    throw error;
  }
};

// Send Email for diamond inquiries
export const sendDiamondInquiryEmail = async (name: string, email: string, subject: string, message: string) => {
  try {
    console.log(`Sending diamond inquiry email to admin from ${email}`);

    const logoUrl = getLogoForEmail();
    const content = `
      <p>Dear <strong>Admin</strong>,</p>
      <p>You have received a new diamond inquiry from ${name} (${email}):</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">${message}</p>
    `;

    const html = createEmailTemplate({
      logoUrl,
      title: "New Diamond Inquiry",
      content,
      footerContent: '<p>203-Bhav resiedency, Thane 421304, Maharastra, India.</p>'
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "admintejas@mothersauradiamonds.com",
      subject: `New Diamond Inquiry: ${subject}`,
      html,
    });

    console.log(`Diamond inquiry email sent successfully to admin`);
  } catch (error) {
    console.error('Error sending diamond inquiry email:', error);
    throw error;
  }
};

// Generic sendEmail function for backward compatibility
export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  try {
    await transporter.sendMail({
      from: '"Mothers Aura" <admintejas@mothersauradiamonds.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};