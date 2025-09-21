import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT user_premium FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ isPremium: false, userExists: false });
      }

      const user = result.rows[0];
      return NextResponse.json({ 
        isPremium: user.user_premium || false,
        userExists: true 
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error checking premium status:', error);
    return NextResponse.json(
      { error: 'Error checking premium status' },
      { status: 500 }
    );
  }
}