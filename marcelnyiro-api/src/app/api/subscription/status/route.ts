import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check for active subscription
    const subscriptionResult = await query(
      `SELECT 
        id,
        subscription_start_date,
        subscription_end_date,
        status,
        cancelled_at,
        CASE 
          WHEN subscription_end_date > NOW() THEN true 
          ELSE false 
        END as is_active
       FROM user_subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [decoded.id]
    );
    
    let hasAccess = false;
    let subscriptionInfo = null;
    
    if (subscriptionResult.length > 0) {
      const subscription = subscriptionResult[0];
      hasAccess = subscription.is_active;
      subscriptionInfo = {
        startDate: subscription.subscription_start_date,
        endDate: subscription.subscription_end_date,
        status: subscription.status,
        cancelledAt: subscription.cancelled_at,
        isActive: subscription.is_active
      };
    }
    
    // Also update user_premium field based on subscription status
    await query(
      `UPDATE users 
       SET user_premium = $2, updated_at = NOW() 
       WHERE id = $1`,
      [decoded.id, hasAccess]
    );
    
    return NextResponse.json({
      hasAccess,
      subscription: subscriptionInfo
    });
    
  } catch (error) {
    console.error('Subscription status check error:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}