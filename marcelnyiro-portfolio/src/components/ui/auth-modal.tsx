"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";

interface AuthModalProps {
  children: React.ReactNode;
  defaultTab?: "signin" | "register";
  redirectUrl?: string;
}

export function AuthModal({ children, defaultTab = "signin", redirectUrl }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  
  const { login, register, token } = useAuth();
  const { showToast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const success = await login(email, password);
    
    if (success) {
      setOpen(false);
      showToast("Welcome back! Successfully signed in.", "success");
      if (redirectUrl && token) {
        // Append JWT token to the redirect URL as a query parameter
        const url = new URL(redirectUrl);
        url.searchParams.set('token', token);
        window.open(url.toString(), '_blank');
      }
    } else {
      setError("Invalid email or password");
      showToast("Sign in failed. Please check your credentials.", "error");
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }
    
    const success = await register(name, email, password);
    
    if (success) {
      setOpen(false);
      showToast("Account created successfully! Welcome to Marcel's platform.", "success");
      if (redirectUrl && token) {
        // Append JWT token to the redirect URL as a query parameter
        const url = new URL(redirectUrl);
        url.searchParams.set('token', token);
        window.open(url.toString(), '_blank');
      }
    } else {
      setError("Registration failed. Please try again.");
      showToast("Registration failed. Please try again.", "error");
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Access your courses and continue learning
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger 
              value="signin" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4 mt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="signin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="register-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              
              <div className="text-center text-xs text-gray-400">
                By registering, you agree to our{" "}
                <button className="text-blue-400 hover:text-blue-300 underline">
                  Terms of Service
                </button>
                {" "}and{" "}
                <button className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}