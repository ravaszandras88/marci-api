import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Add success and cancel URLs for the API
    const requestBody = {
      ...body,
      successUrl: `${request.nextUrl.origin}/mentoring/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${request.nextUrl.origin}/#services`
    };

    // Forward the request to the API
    const response = await fetch(`${API_URL}/api/mentoring/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create mentoring session');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating mentoring session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}