"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Users, Clock, Calendar } from 'lucide-react';
import { Button } from './button';
import { useAuth } from '@/contexts/AuthContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface MentoringPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MentoringPaymentModal({ isOpen, onClose, onSuccess }: MentoringPaymentModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      alert('Please sign in to book a mentoring session');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/create-mentoring-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: user.email,
          customerName: user.name,
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
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
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
              <h2 className="text-2xl font-bold text-white">Book 1-on-1 Mentoring</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">1-on-1 Mentoring Session</span>
                  <span className="text-2xl font-bold text-white">16,000 Ft</span>
                </div>
                <div className="text-sm text-gray-400">One-time payment</div>
              </div>

              <div className="space-y-3 text-sm text-gray-300 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-purple-400 mr-3" />
                  <span>1-hour deep-dive session</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-purple-400 mr-3" />
                  <span>Personalized business strategy review</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-purple-400 mr-3" />
                  <span>AI implementation roadmap</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span>Investor pitch feedback & optimization</span>
                </div>
              </div>

              {user && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-medium mb-2">Booking for:</h4>
                  <div className="text-sm text-gray-300">
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                  </div>
                </div>
              )}

              {!user && (
                <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4 mb-6">
                  <p className="text-orange-400 text-sm">
                    Please sign in to your account to book a mentoring session.
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={handlePayment}
              disabled={isLoading || !user}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : user ? (
                <div className="flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay 16,000 HUF
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In Required
                </div>
              )}
            </Button>

            <div className="flex items-center justify-center text-xs text-gray-400">
              <Lock className="h-3 w-3 mr-1" />
              Secure payment powered by Stripe
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              After payment, you'll receive an email to schedule your session.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}