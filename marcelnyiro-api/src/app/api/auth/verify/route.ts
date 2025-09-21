import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify JWT token
    const decoded = verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user details including created_at and premium status from database
    const userResult = await query(
      'SELECT id, name, email, created_at, user_premium FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data with created_at and premium status
    return NextResponse.json({
      message: 'Token is valid',
      user: {
        id: userResult[0].id,
        name: userResult[0].name,
        email: userResult[0].email,
        created_at: userResult[0].created_at,
        user_premium: userResult[0].user_premium
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}