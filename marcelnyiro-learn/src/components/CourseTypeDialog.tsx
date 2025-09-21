"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, BookOpen, Calendar, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CourseTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'normal' | 'monthly' | 'yearly') => void;
}

export const CourseTypeDialog: React.FC<CourseTypeDialogProps> = ({
  isOpen,
  onClose,
  onSelectType
}) => {
  console.log('CourseTypeDialog render - isOpen:', isOpen);
  const courseTypes = [
    {
      type: 'normal' as const,
      title: 'Normal Course',
      description: 'Traditional course structure with modules and lessons',
      icon: BookOpen,
      example: 'AI Entrepreneurship, Business Strategy'
    },
    {
      type: 'monthly' as const,
      title: 'Monthly Course',
      description: 'Episode-based content organized by months with date navigation',
      icon: Calendar,
      example: 'Weekly Check-ins style with monthly episodes'
    },
    {
      type: 'yearly' as const,
      title: 'Yearly Course',
      description: 'Simple course structure without episodes or date navigation',
      icon: CalendarDays,
      example: 'Annual programs, certification courses'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            className="relative bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 w-full max-w-2xl mx-4 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Select Course Type</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Course Type Options */}
            <div className="space-y-4">
              {courseTypes.map((courseType) => (
                <motion.button
                  key={courseType.type}
                  onClick={() => onSelectType(courseType.type)}
                  className="w-full p-3 sm:p-4 border border-gray-700 rounded-lg hover:border-blue-600 hover:bg-gray-800/50 transition-all duration-200 text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <courseType.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                        {courseType.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-2">
                        {courseType.description}
                      </p>
                      <p className="text-blue-400 text-[10px] sm:text-xs">
                        Example: {courseType.example}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-500 text-center">
                You can change the course type later in course settings
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};