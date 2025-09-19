"use client";

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
  as?: 'span' | 'div';
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onChange, 
  className = "", 
  multiline = false,
  placeholder = "",
  type = "text",
  as = "span"
}) => {
  const { isEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const Element = as;
  
  if (!isEditMode) {
    return <Element className={className}>{value}</Element>;
  }

  if (isEditing) {
    return (
      <div className="flex items-start gap-2 w-full">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm resize-none"
            placeholder={placeholder}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        )}
        <div className="flex flex-col gap-1">
          <button
            onClick={handleSave}
            className="text-green-400 hover:text-green-300 text-xs p-1"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="text-red-400 hover:text-red-300 text-xs p-1"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <Element 
      className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-gray-800 px-1 rounded border border-transparent hover:border-gray-600' : ''}`}
      onClick={() => isEditMode && setIsEditing(true)}
      title={isEditMode ? "Click to edit" : ""}
    >
      {value || placeholder}
    </Element>
  );
};