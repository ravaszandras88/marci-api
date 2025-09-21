"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Card, Header as CardHeader, Plan, PlanName, Badge, Price, MainPrice, Period, Body, List, ListItem } from "@/components/ui/pricing-card";
import { Button } from "@/components/ui/button";
import { AuthRedirectButton } from "@/components/ui/auth-redirect-button";
import { StripePaymentModal } from "@/components/ui/stripe-payment-modal";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CheckCircle, 
  Star, 
  GraduationCap,
  Building2,
  ExternalLink
} from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-black">
      <CoursesLanding />
    </div>
  );
}

const CoursesLanding = () => {
  const { user, token, isLoading: authLoading } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userPremium, setUserPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check premium status when user is loaded
  React.useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user?.email) {
        setUserPremium(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/check-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email
          }),
        });

        const data = await response.json();
        setUserPremium(data.isPremium || false);
      } catch (error) {
        console.error('Error checking premium status:', error);
        setUserPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      checkPremiumStatus();
    }
  }, [user, authLoading]);

  const handleStartLearning = () => {
    if (!user) {
      // User not logged in - they need to sign in first
      alert('Please sign in first to access courses');
      return;
    }

    if (userPremium) {
      // Redirect to learning platform with auth token
      const redirectUrl = process.env.NODE_ENV === 'production' ? 'https://learn.marcelnyiro.com' : 'http://localhost:3001';
      
      if (token) {
        const url = new URL(redirectUrl);
        url.searchParams.set('token', token);
        window.location.href = url.toString();
      } else {
        window.location.href = redirectUrl;
      }
    } else {
      // Show payment modal
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Access Your Learning Dashboard
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Your courses have been moved to a dedicated learning platform. 
          Continue your AI entrepreneurship journey with enhanced features and better experience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleStartLearning}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            {userPremium ? 'Go to Learning Platform' : 'Subscribe to Access'}
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
        </motion.div>

      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-8">What You'll Get in the Learning Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <GraduationCap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Enhanced Video Player</h3>
            <p className="text-gray-400">Professional video player with progress tracking, speed control, and note-taking capabilities.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Better Progress Tracking</h3>
            <p className="text-gray-400">Detailed analytics on your learning progress, completion rates, and achievements.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <Building2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Dedicated Learning Environment</h3>
            <p className="text-gray-400">Distraction-free environment focused solely on your learning experience.</p>
          </div>
        </div>
        </motion.div>

      {!userPremium && (
        <>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Course Plan Available</h2>
          
          <div className="flex justify-center mb-16">
            {/* Pro Tier - Only Option */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="max-w-md w-full"
            >
              <Card className="max-w-none border-2 border-blue-500">
              <CardHeader>
                <Plan>
                  <PlanName>
                    <Star className="text-black" />
                    Pro
                  </PlanName>
                  <Badge className="bg-blue-600 text-white border-blue-600">Only Plan</Badge>
                </Plan>
                <Price>
                  <MainPrice className="text-white">4000 Ft</MainPrice>
                  <Period className="text-gray-300">/month</Period>
                </Price>
                <div className="text-xs text-gray-400">Approximately €10/month</div>
              </CardHeader>
              <Body>
                <List>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">AI entrepreneurship course (6 modules)</span>
                  </ListItem>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">Exclusive Outfino case study series</span>
                  </ListItem>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">Real pitch decks & investment materials</span>
                  </ListItem>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">Monthly live Q&A with Marcel</span>
                  </ListItem>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">Direct messaging with Marcel</span>
                  </ListItem>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">VC introduction opportunities</span>
                  </ListItem>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">Course completion certificates</span>
                  </ListItem>
                  <ListItem>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-white">Mobile app access</span>
                  </ListItem>
                </List>
                <Button 
                  onClick={handleStartLearning}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  {userPremium ? 'Access Learning Platform' : 'Start Learning'}
                </Button>
              </Body>
            </Card>
              </motion.div>
          </div>
        </>
      )}
      
    <div className="text-center mt-12">
      <p className="text-gray-400 text-sm mb-4">
        Learn from real success: 73M HUF OUVC investment • Portfolio.hu featured • 300+ users
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
        <span>✓ 30-day money-back guarantee</span>
        <span>✓ Cancel anytime</span>
        <span>✓ Instant access</span>
      </div>
    </div>

    {user && (
      <StripePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userEmail={user.email}
        onSuccess={() => {
          setIsPaymentModalOpen(false);
          setUserPremium(true);
        }}
      />
    )}
    </div>
  );
}
