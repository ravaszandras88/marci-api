import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Forward the request to the API
    const response = await fetch(`${API_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'stripe-signature': signature || '',
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to process webhook');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}