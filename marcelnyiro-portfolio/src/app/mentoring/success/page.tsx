"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MentoringSuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    setSessionId(session);

    // Send confirmation email when page loads
    if (session && !emailSent) {
      sendConfirmationEmail(session);
    }
  }, [emailSent]);

  const sendConfirmationEmail = async (sessionId: string) => {
    setEmailSending(true);
    try {
      const response = await fetch('/api/send-mentoring-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        setEmailSent(true);
        console.log('Confirmation email sent successfully');
      } else {
        console.error('Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    } finally {
      setEmailSending(false);
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
            className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Mentoring Session Booked!
          </h1>
          
          <p className="text-gray-300 mb-6">
            Thank you for booking a 1-on-1 mentoring session with Marcel Nyirő. 
            Your payment has been processed successfully.
          </p>

          <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-3">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                <span>
                  {emailSending && "Sending confirmation email..."}
                  {emailSent && !emailSending && "✅ Confirmation email sent with Calendly link"}
                  {!emailSent && !emailSending && "You'll receive a confirmation email within 5 minutes"}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                <span>Use the Calendly link in your email to schedule your session</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                <span>Session duration: 1 hour (flexible timing)</span>
              </div>
            </div>
          </div>

          {emailSent && (
            <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4 mb-6 text-center">
              <p className="text-green-400 font-medium">
                📧 Confirmation email sent! Check your inbox for the Calendly booking link.
              </p>
            </div>
          )}

          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-2">Session includes:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Personalized business strategy review</li>
              <li>• AI implementation roadmap</li>
              <li>• Investor pitch feedback & optimization</li>
              <li>• Access to exclusive network introductions</li>
              <li>• Follow-up email with key takeaways</li>
            </ul>
          </div>

          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-4"
            onClick={() => window.location.href = '/'}
          >
            Back to Homepage
          </Button>

          {sessionId && (
            <p className="text-xs text-gray-500">
              Payment ID: {sessionId}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}