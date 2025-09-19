"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  setIsEditMode: (editMode: boolean) => void;
  checkAdminStatus: (email: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
  userEmail?: string;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children, userEmail }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const checkAdminStatus = (email: string): boolean => {
    return email === 'business@marcelnyiro.com';
  };

  const isAdmin = userEmail ? checkAdminStatus(userEmail) : false;

  // Load edit mode from localStorage
  useEffect(() => {
    if (isAdmin) {
      const savedEditMode = localStorage.getItem('adminEditMode');
      if (savedEditMode === 'true') {
        setIsEditMode(true);
      }
    }
  }, [isAdmin]);

  // Save edit mode to localStorage
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('adminEditMode', isEditMode.toString());
    }
  }, [isEditMode, isAdmin]);

  const value: AdminContextType = {
    isAdmin,
    isEditMode,
    setIsEditMode,
    checkAdminStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};