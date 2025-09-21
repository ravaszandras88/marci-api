import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Send email to Marcel
    const mailOptions = {
      from: '"Marcel Nyirő Website" <business@marcelnyiro.com>',
      to: 'business@marcelnyiro.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><em>This message was sent through the contact form on marcelnyiro.com</em></p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
        
        This message was sent through the contact form on marcelnyiro.com
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}