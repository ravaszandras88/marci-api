import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the API
    const response = await fetch(`${API_URL}/api/user/check-premium`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to check premium status');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking premium status:', error);
    return NextResponse.json(
      { error: 'Error checking premium status' },
      { status: 500 }
    );
  }
}