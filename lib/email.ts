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

const invoiceEmailTemplate = (invoiceNumber: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0; font-size: 28px;">Mothers Aura</h1>
        <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Premium Diamond Jewellery</p>
      </div>
      
      <h2 style="color: #333; margin-bottom: 20px;">Invoice Generated</h2>
      
      <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Your invoice <strong>#${invoiceNumber}</strong> has been generated.
      </p>
      
      <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Please find the attached invoice document.
      </p>
      
      <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © 2024 Mothers Aura. All rights reserved.
        </p>
      </div>
    </div>
  </div>
`;

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
    subject: `Invoice #${invoiceNumber} Generated`,
    html: invoiceEmailTemplate(invoiceNumber),
    attachments: [{
      filename: `invoice-${invoiceNumber}.pdf`,
      content: attachmentBuffer,
    }],
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