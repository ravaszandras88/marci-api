import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, customerName } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // One-time payment instead of subscription
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'huf',
            product_data: {
              name: '1-on-1 Mentoring Session with Marcel Nyirő',
              description: '2-hour deep-dive session with personalized business strategy, AI implementation roadmap, and investor pitch feedback',
              images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop'],
            },
            unit_amount: 1600000, // 16000 HUF in smallest currency unit (fillér)
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/mentoring/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/#services`,
      metadata: {
        service_type: 'mentoring',
        customer_email: customerEmail || '',
        customer_name: customerName || '',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating mentoring session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}