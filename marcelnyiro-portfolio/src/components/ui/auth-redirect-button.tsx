"use client";

import React from "react";
import { AuthModal } from "@/components/ui/auth-modal";
import { useAuth } from "@/contexts/AuthContext";

export interface AuthRedirectButtonProps {
  children: React.ReactNode;
  redirectUrl?: string;
  defaultTab?: "signin" | "register";
  onClick?: () => void;
}

export function AuthRedirectButton({ 
  children, 
  redirectUrl, 
  defaultTab = "signin",
  onClick
}: AuthRedirectButtonProps) {
  const { user, token } = useAuth();
  
  const handleClick = () => {
    if (user) {
      // User is logged in, execute custom action or redirect
      if (onClick) {
        onClick();
      } else if (redirectUrl && token) {
        // Append JWT token to the redirect URL as a query parameter
        const url = new URL(redirectUrl);
        url.searchParams.set('token', token);
        window.open(url.toString(), '_blank');
      }
    }
    // If user is not logged in, the AuthModal will handle showing the login form
  };
  
  if (user) {
    // User is logged in, return a clickable element that redirects
    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    );
  }
  
  // User is not logged in, return AuthModal
  return (
    <AuthModal defaultTab={defaultTab} redirectUrl={redirectUrl}>
      {children}
    </AuthModal>
  );
}