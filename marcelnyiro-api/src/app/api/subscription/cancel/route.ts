import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
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
    
    // Get the active subscription with Stripe ID
    const subscriptionResult = await query(
      `SELECT subscription_end_date, stripe_subscription_id 
       FROM user_subscriptions 
       WHERE user_id = $1 AND status = 'active'`,
      [decoded.id]
    );
    
    if (subscriptionResult.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    const { subscription_end_date: endDate, stripe_subscription_id: stripeSubId } = subscriptionResult[0];
    
    // Cancel the Stripe subscription if we have the ID
    let stripeCancellationSuccess = false;
    let stripeSubscriptionDetails = null;
    if (stripeSubId) {
      try {
        // First, let's check the current subscription status
        const currentSubscription = await stripe.subscriptions.retrieve(stripeSubId);
        console.log('Current subscription before cancellation:', JSON.stringify({
          id: currentSubscription.id,
          status: currentSubscription.status,
          cancel_at_period_end: currentSubscription.cancel_at_period_end
        }, null, 2));

        // Cancel immediately without refunding unused time
        const cancelledSubscription = await stripe.subscriptions.cancel(stripeSubId, {
          prorate: false, // Don't refund unused time
        });
        console.log(`Successfully cancelled Stripe subscription: ${stripeSubId}`);
        console.log('Cancelled subscription details:', JSON.stringify({
          id: cancelledSubscription.id,
          status: cancelledSubscription.status,
          canceled_at: cancelledSubscription.canceled_at,
          cancel_at_period_end: cancelledSubscription.cancel_at_period_end,
          current_period_end: cancelledSubscription.current_period_end
        }, null, 2));

        // Double-check by retrieving it again
        const verifySubscription = await stripe.subscriptions.retrieve(stripeSubId);
        console.log('Verification - subscription after cancellation:', JSON.stringify({
          id: verifySubscription.id,
          status: verifySubscription.status,
          canceled_at: verifySubscription.canceled_at
        }, null, 2));
        stripeCancellationSuccess = true;
        stripeSubscriptionDetails = {
          status: cancelledSubscription.status,
          canceled_at: cancelledSubscription.canceled_at,
          cancel_at_period_end: cancelledSubscription.cancel_at_period_end
        };
      } catch (stripeError: any) {
        console.error('Error cancelling Stripe subscription:', stripeError);
        
        // Check if subscription is already cancelled or doesn't exist
        if (stripeError.code === 'resource_missing' || stripeError.message?.includes('already canceled')) {
          console.log('Stripe subscription was already cancelled or missing');
          stripeCancellationSuccess = true; // Consider this a success
        }
        // Continue with local cancellation even if Stripe fails
      }
    } else {
      console.log('No Stripe subscription ID found, skipping Stripe cancellation');
      stripeCancellationSuccess = true; // No Stripe subscription to cancel
    }
    
    // Mark subscription as cancelled in our database
    await query(
      `UPDATE user_subscriptions 
       SET status = 'cancelled', cancelled_at = NOW(), updated_at = NOW()
       WHERE user_id = $1 AND status = 'active'`,
      [decoded.id]
    );
    
    // Log the cancellation for record keeping
    await query(
      `INSERT INTO subscription_events (user_id, event_type, event_data, created_at)
       VALUES ($1, 'cancelled', $2, NOW())`,
      [decoded.id, JSON.stringify({ 
        cancelled_by: 'user',
        reason: 'user_requested',
        cancelled_at: new Date().toISOString()
      })]
    );
    
    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      success: true,
      accessUntil: endDate,
      stripeCancelled: stripeCancellationSuccess,
      stripeSubscriptionId: stripeSubId || null,
      stripeDetails: stripeSubscriptionDetails,
      note: 'You will continue to have access until your current billing period ends'
    });
    
  } catch (error) {
    console.error('Subscription cancellation error:', error);
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}