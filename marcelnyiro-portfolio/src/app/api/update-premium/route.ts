import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const pool = new Pool({
  user: 'marci_user',
  host: 'localhost',
  database: 'marci_portfolio_db',
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.mode === 'subscription') {
      const customerEmail = session.customer_email || session.customer_details?.email;
      
      if (customerEmail) {
        const client = await pool.connect();
        try {
          // Get user ID
          const userResult = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [customerEmail]
          );
          
          if (userResult.rows.length === 0) {
            return NextResponse.json({ 
              error: 'User not found with that email' 
            }, { status: 404 });
          }
          
          const userId = userResult.rows[0].id;
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
          
          // Get Stripe subscription ID from the session
          const stripeSubscriptionId = session.subscription;
          
          // Create subscription record
          await client.query(
            `INSERT INTO user_subscriptions 
             (user_id, subscription_start_date, subscription_end_date, status, stripe_subscription_id)
             VALUES ($1, $2, $3, 'active', $4)`,
            [userId, startDate, endDate, stripeSubscriptionId]
          );
          
          // Update user to premium
          const result = await client.query(
            'UPDATE users SET user_premium = true, updated_at = CURRENT_TIMESTAMP WHERE email = $1 RETURNING email, user_premium',
            [customerEmail]
          );
          
          return NextResponse.json({ 
            success: true, 
            message: 'Premium status updated and subscription created',
            user: result.rows[0],
            subscriptionEndDate: endDate
          });
        } finally {
          client.release();
        }
      } else {
        return NextResponse.json({ 
          error: 'No customer email found in session' 
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({ 
        error: 'Payment not completed or not a subscription' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating premium status:', error);
    return NextResponse.json(
      { error: 'Error updating premium status' },
      { status: 500 }
    );
  }
}