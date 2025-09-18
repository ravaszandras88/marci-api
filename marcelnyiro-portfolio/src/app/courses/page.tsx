"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, Header as CardHeader, Plan, PlanName, Badge, Price, MainPrice, Period, Body, List, ListItem } from "@/components/ui/pricing-card";
import { Button } from "@/components/ui/button";
import { AuthRedirectButton } from "@/components/ui/auth-redirect-button";
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
          <AuthRedirectButton 
            redirectUrl={process.env.NODE_ENV === 'production' ? 'https://learn.marcelnyiro.com' : 'http://localhost:3001'}
            defaultTab="signin"
          >
            <Button className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              Go to Learning Platform
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </AuthRedirectButton>
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

      <h2 className="text-3xl font-bold text-white mb-8 text-center">Course Plans Available</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Starter Tier */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="max-w-none">
            <CardHeader>
              <Plan>
                <PlanName>
                  <GraduationCap className="text-black" />
                  Starter
                </PlanName>
              </Plan>
              <Price>
                <MainPrice className="text-white">€29</MainPrice>
                <Period className="text-gray-300">/month</Period>
              </Price>
              <div className="text-xs text-gray-400">€299/year (save 15%)</div>
            </CardHeader>
            <Body>
            <List>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">AI entrepreneurship course (6 modules)</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">Monthly live Q&A with Marcel</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">Course completion certificates</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">Mobile app access</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">Basic community access</span>
              </ListItem>
            </List>
            <AuthRedirectButton 
              redirectUrl={process.env.NODE_ENV === 'production' ? 'https://learn.marcelnyiro.com' : 'http://localhost:3001'}
              defaultTab="signin"
            >
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                Start Learning
              </Button>
            </AuthRedirectButton>
          </Body>
        </Card>
          </motion.div>

        {/* Pro Tier */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="max-w-none border-2 border-blue-500">
          <CardHeader>
            <Plan>
              <PlanName>
                <Star className="text-black" />
                Pro
              </PlanName>
              <Badge className="bg-blue-600 text-white border-blue-600">Most Popular</Badge>
            </Plan>
            <Price>
              <MainPrice className="text-white">€49</MainPrice>
              <Period className="text-gray-300">/month</Period>
            </Price>
            <div className="text-xs text-gray-400">€499/year (save 15%)</div>
          </CardHeader>
          <Body>
            <List>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">All Starter features</span>
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
                <span className="text-white">Direct messaging with Marcel</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">VC introduction opportunities</span>
              </ListItem>
            </List>
            <AuthRedirectButton 
              redirectUrl={process.env.NODE_ENV === 'production' ? 'https://learn.marcelnyiro.com' : 'http://localhost:3001'}
              defaultTab="signin"
            >
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                Go Pro
              </Button>
            </AuthRedirectButton>
          </Body>
        </Card>
          </motion.div>

        {/* Enterprise Tier */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="max-w-none">
          <CardHeader>
            <Plan>
              <PlanName>
                <Building2 className="text-black" />
                Enterprise
              </PlanName>
              <Badge>Premium</Badge>
            </Plan>
            <Price>
              <MainPrice className="text-white">€199</MainPrice>
              <Period className="text-gray-300">/month</Period>
            </Price>
            <div className="text-xs text-gray-400">€1,999/year (save 17%)</div>
          </CardHeader>
          <Body>
            <List>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">All Pro features</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">Team access (up to 10 users)</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">Custom workshops & sessions</span>
              </ListItem>
              <ListItem>
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <span className="text-white">Quarterly strategy sessions</span>
              </ListItem>
            </List>
            <AuthRedirectButton 
              defaultTab="signin"
              onClick={() => {
                window.location.href = "/#contact";
              }}
            >
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                Contact Sales
              </Button>
            </AuthRedirectButton>
          </Body>
        </Card>
          </motion.div>
      </div>
      
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
    </div>
  );
}
