import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import { generateMentoringConfirmationEmail } from '@/lib/email-templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Create email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.me.com',
  port: 587,
  secure: false,
  auth: {
    user: 'csabanyiro@icloud.com',
    pass: 'cduj-smsh-iivi-wqym',
  },
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe to get customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const customerEmail = session.customer_email || session.customer_details?.email;
    const customerName = session.metadata?.customer_name || 'Valued Customer';

    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }

    // Generate email content
    const emailContent = generateMentoringConfirmationEmail({
      customerName,
      customerEmail,
      paymentAmount: '16,000 HUF',
      sessionId: sessionId
    });

    // Send confirmation email
    const mailOptions = {
      from: '"Marcel Nyirő" <business@marcelnyiro.com>',
      to: customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    await transporter.sendMail(mailOptions);

    // Optionally send notification to Marcel as well
    if (process.env.MARCEL_EMAIL) {
      const notificationOptions = {
        from: '"Mentoring System" <business@marcelnyiro.com>',
        to: process.env.MARCEL_EMAIL,
        subject: `New Mentoring Session Booked - ${customerName}`,
        html: `
          <h2>New Mentoring Session Booking</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Amount:</strong> 16,000 HUF</p>
          <p><strong>Payment ID:</strong> ${sessionId}</p>
          <p><strong>Next Steps:</strong> Customer will book a time slot on your Calendly.</p>
          <p><a href="https://calendly.com/marcelnyiro">View Your Calendar</a></p>
        `,
      };

      await transporter.sendMail(notificationOptions);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Confirmation email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}