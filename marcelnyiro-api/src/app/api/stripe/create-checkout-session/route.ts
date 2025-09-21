import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { priceId, mode = 'subscription', customerEmail, successUrl, cancelUrl } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: mode,
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'huf',
            product_data: {
              name: 'Marcel Nyirő Pro Course',
              description: 'AI entrepreneurship course with exclusive Outfino case studies and direct access to Marcel',
            },
            unit_amount: 400000, // 4000 HUF in smallest currency unit (fillér)
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${request.headers.get('origin')}/courses/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.headers.get('origin')}/courses`,
      metadata: {
        userEmail: customerEmail,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}