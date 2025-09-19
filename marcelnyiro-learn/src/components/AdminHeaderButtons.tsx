"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Save, Edit3 } from "lucide-react";
import { useAdmin } from '@/contexts/AdminContext';
import { useCourseChanges } from '@/contexts/CourseChangesContext';

interface AdminHeaderButtonsProps {
  onSaveSuccess?: () => void;
}

export const AdminHeaderButtons: React.FC<AdminHeaderButtonsProps> = ({ onSaveSuccess }) => {
  const { isAdmin, isEditMode, setIsEditMode } = useAdmin();
  const { hasUnsavedChanges, saveChangesToServer } = useCourseChanges();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await saveChangesToServer();
      if (success) {
        console.log('Changes saved successfully');
        // Refresh courses data after successful save
        onSaveSuccess?.();
      } else {
        console.error('Failed to save changes');
        // Optionally show an error message
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isAdmin && isEditMode && hasUnsavedChanges && (
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      )}
      
      {isAdmin && (
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          variant={isEditMode ? "default" : "outline"}
          className={isEditMode 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }
        >
          {isEditMode ? (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Exit Edit
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </>
          )}
        </Button>
      )}
    </div>
  );
};