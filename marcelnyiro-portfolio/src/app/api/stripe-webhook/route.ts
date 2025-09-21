import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Pool } from 'pg';

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
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    // In production, you should set STRIPE_WEBHOOK_SECRET
    // For development, we'll skip signature verification
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // Parse without verification for development
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription' && session.status === 'complete') {
          // Get customer email from session
          const customerEmail = session.customer_email || session.customer_details?.email;
          
          if (customerEmail) {
            console.log('Setting premium status for:', customerEmail);
            
            const client = await pool.connect();
            try {
              // Update user to premium
              const result = await client.query(
                'UPDATE users SET user_premium = true, updated_at = CURRENT_TIMESTAMP WHERE email = $1 RETURNING email, user_premium',
                [customerEmail]
              );
              
              if (result.rows.length > 0) {
                console.log('Successfully updated user to premium:', result.rows[0]);
              } else {
                console.log('No user found with email:', customerEmail);
              }
            } finally {
              client.release();
            }
          }
        }
        break;

      case 'customer.subscription.canceled':
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && customer.email) {
          const client = await pool.connect();
          try {
            await client.query(
              'UPDATE users SET user_premium = false, updated_at = CURRENT_TIMESTAMP WHERE email = $1',
              [customer.email]
            );
            console.log('Removed premium status for:', customer.email);
          } finally {
            client.release();
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}