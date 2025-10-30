import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to admin
    await sendAppointmentEmail({
      name,
      email,
      phone,
      date,
      time,
      message: message || undefined,
    });

    return NextResponse.json(
      { message: 'Appointment request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing appointment request:', error);
    return NextResponse.json(
      { error: 'Failed to process appointment request' },
      { status: 500 }
    );
  }
}

