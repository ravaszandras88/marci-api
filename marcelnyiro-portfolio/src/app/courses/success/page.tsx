"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthRedirectButton } from '@/components/ui/auth-redirect-button';

export default function PaymentSuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [premiumUpdated, setPremiumUpdated] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    setSessionId(session);

    // Update premium status when session ID is available
    if (session) {
      updatePremiumStatus(session);
    }
  }, []);

  const updatePremiumStatus = async (sessionId: string) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/update-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPremiumUpdated(true);
        console.log('Premium status updated:', data);
      } else {
        console.error('Failed to update premium status:', data.error);
      }
    } catch (error) {
      console.error('Error updating premium status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          
          {updating && (
            <p className="text-blue-400 mb-4">
              Setting up your premium access...
            </p>
          )}
          
          {premiumUpdated && (
            <p className="text-green-400 mb-4">
              ✅ Premium access activated!
            </p>
          )}
          
          <p className="text-gray-300 mb-6">
            Welcome to Marcel Nyirő's Pro Course! Your subscription is now active and you have full access to all premium content.
          </p>

          <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Access your learning dashboard</li>
              <li>• Start with Module 1: AI Fundamentals</li>
              <li>• Join the exclusive community</li>
              <li>• Schedule your first Q&A with Marcel</li>
            </ul>
          </div>

          <AuthRedirectButton 
            redirectUrl={process.env.NODE_ENV === 'production' ? 'https://learn.marcelnyiro.com' : 'http://localhost:3001'}
            defaultTab="signin"
          >
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4">
              <span>Access Learning Platform</span>
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </AuthRedirectButton>

          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            onClick={() => window.location.href = '/'}
          >
            Back to Homepage
          </Button>

          {sessionId && (
            <p className="text-xs text-gray-500 mt-4">
              Session ID: {sessionId}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}