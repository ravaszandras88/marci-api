"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  thumbnail: string;
  category: string;
  level: string;
  modules: Array<{
    id: number;
    title: string;
    videos: number;
      completed: boolean;
    locked: boolean;
    episode_date?: string;
    episode_time?: string;
    videoUrl?: string;
  }>;
}

interface CourseChanges {
  [courseId: string]: {
    title?: string;
    description?: string;
    thumbnail?: string;
    level?: string;
    modules?: {
      [moduleId: number]: {
        title?: string;
            videoUrl?: string;
        videos?: number;
      };
    };
    newModules?: Array<{
      tempId: string;
      title: string;
          videoUrl?: string;
      videos: number;
      order_index: number;
    }>;
    deletedModules?: number[];
  };
}

interface CourseChangesContextType {
  changes: CourseChanges;
  hasUnsavedChanges: boolean;
  updateCourseField: (courseId: string, field: keyof Course, value: any) => void;
  updateModuleField: (courseId: string, moduleId: number, field: string, value: any) => void;
  addModule: (courseId: string, module: { title: string; videoUrl?: string; videos: number }) => void;
  deleteModule: (courseId: string, moduleId: number) => void;
  clearChanges: () => void;
  getChangesForCourse: (courseId: string) => any;
  saveChangesToServer: () => Promise<boolean>;
}

const CourseChangesContext = createContext<CourseChangesContextType | undefined>(undefined);

export const useCourseChanges = () => {
  const context = useContext(CourseChangesContext);
  if (context === undefined) {
    throw new Error('useCourseChanges must be used within a CourseChangesProvider');
  }
  return context;
};

interface CourseChangesProviderProps {
  children: ReactNode;
}

export const CourseChangesProvider: React.FC<CourseChangesProviderProps> = ({ children }) => {
  const [changes, setChanges] = useState<CourseChanges>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load changes from localStorage on mount
  useEffect(() => {
    const savedChanges = localStorage.getItem('courseChanges');
    if (savedChanges) {
      try {
        const parsedChanges = JSON.parse(savedChanges);
        setChanges(parsedChanges);
        setHasUnsavedChanges(Object.keys(parsedChanges).length > 0);
      } catch (error) {
        console.error('Error loading course changes from localStorage:', error);
      }
    }
  }, []);

  // Save changes to localStorage whenever changes update
  useEffect(() => {
    localStorage.setItem('courseChanges', JSON.stringify(changes));
    setHasUnsavedChanges(Object.keys(changes).length > 0);
  }, [changes]);

  const updateCourseField = (courseId: string, field: keyof Course, value: any) => {
    setChanges(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [field]: value
      }
    }));
  };

  const updateModuleField = (courseId: string, moduleId: number, field: string, value: any) => {
    setChanges(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        modules: {
          ...prev[courseId]?.modules,
          [moduleId]: {
            ...prev[courseId]?.modules?.[moduleId],
            [field]: value
          }
        }
      }
    }));
  };

  const addModule = (courseId: string, module: { title: string; videoUrl?: string; videos: number }) => {
    const tempId = `temp_${Date.now()}`;
    setChanges(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        newModules: [
          ...(prev[courseId]?.newModules || []),
          {
            tempId,
            ...module,
            order_index: (prev[courseId]?.newModules?.length || 0) + 1
          }
        ]
      }
    }));
  };

  const deleteModule = (courseId: string, moduleId: number) => {
    setChanges(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        deletedModules: [
          ...(prev[courseId]?.deletedModules || []),
          moduleId
        ]
      }
    }));
  };

  const clearChanges = () => {
    setChanges({});
    localStorage.removeItem('courseChanges');
  };

  const getChangesForCourse = (courseId: string) => {
    return changes[courseId] || {};
  };

  const saveChangesToServer = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Send all changes to the server
      for (const [courseId, courseChanges] of Object.entries(changes)) {
        const response = await fetch(
          process.env.NODE_ENV === 'production'
            ? `https://api.marcelnyiro.com/api/courses/${courseId}`
            : `http://localhost:3002/api/courses/${courseId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseChanges),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Failed to update course ${courseId}:`, errorData);
          throw new Error(`Failed to update course ${courseId}`);
        }
      }

      // Clear changes after successful save
      clearChanges();
      return true;
    } catch (error) {
      console.error('Error saving changes to server:', error);
      return false;
    }
  };

  const value: CourseChangesContextType = {
    changes,
    hasUnsavedChanges,
    updateCourseField,
    updateModuleField,
    addModule,
    deleteModule,
    clearChanges,
    getChangesForCourse,
    saveChangesToServer,
  };

  return (
    <CourseChangesContext.Provider value={value}>
      {children}
    </CourseChangesContext.Provider>
  );
};