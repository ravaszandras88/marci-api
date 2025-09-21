"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock } from 'lucide-react';
import { Button } from './button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userEmail: string;
}

export function StripePaymentModal({ isOpen, onClose, onSuccess, userEmail }: StripePaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_course_subscription',
          mode: 'subscription',
          customerEmail: userEmail,
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe error:', error);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Subscribe to Pro Course</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Pro Course Access</span>
                  <span className="text-2xl font-bold text-white">4000 Ft</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">Monthly subscription</div>
              </div>

              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>AI entrepreneurship course (6 modules)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Exclusive Outfino case study series</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Direct messaging with Marcel</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>VC introduction opportunities</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mb-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscribe Now
                </div>
              )}
            </Button>

            <div className="flex items-center justify-center text-xs text-gray-400">
              <Lock className="h-3 w-3 mr-1" />
              Secure payment powered by Stripe
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}