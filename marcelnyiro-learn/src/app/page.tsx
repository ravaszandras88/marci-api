"use client";

import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { AdminProvider } from "@/contexts/AdminContext";
import { CourseChangesProvider } from "@/contexts/CourseChangesContext";
import { Sidebar } from "@/components/Sidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { CourseContent } from "@/components/CourseContent";
import { AdminHeaderButtons } from "@/components/AdminHeaderButtons";
import { EditableField } from "@/components/EditableField";
import { CourseTypeDialog } from "@/components/CourseTypeDialog";
import {
  CoursesOverviewContent,
  ProgressContent,
  BillingContent,
  SettingsContent
} from "@/components/ContentComponents";

interface UserData {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  user_premium?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  thumbnail: string;
  category: string;
  level: string;
  status?: string;
  courseType?: 'normal' | 'monthly' | 'yearly';
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

const LearnedDashboard = ({ onUserLoad }: { onUserLoad?: (user: UserData | null) => void }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [coursesExpanded, setCoursesExpanded] = useState(true);
  const [weeklyCheckinsExpanded, setWeeklyCheckinsExpanded] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showCourseTypeDialog, setShowCourseTypeDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Debug logging for dialog state
  useEffect(() => {
    console.log('showCourseTypeDialog changed:', showCourseTypeDialog);
  }, [showCourseTypeDialog]);

  // Fetch courses from database - public for all authenticated users
  const fetchCourses = async () => {
    console.log('fetchCourses called - fetching fresh course data...');
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        process.env.NODE_ENV === 'production' 
          ? 'https://api.marcelnyiro.com/api/courses'
          : 'http://localhost:3002/api/courses',
        {
          headers,
        }
      );
      
      if (response.ok) {
        const coursesData = await response.json();
        console.log('fetchCourses received data:', coursesData);
        const course72 = coursesData.find((c: Course) => c.id === 'new-course-72');
        const module509 = course72?.modules?.find((m: Course['modules'][0]) => m.id === 509);
        console.log('Full Module 509 data:', JSON.stringify(module509, null, 2));
        setCourses(coursesData);
        console.log('setCourses called with fresh data');
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for JWT token in URL parameters first (from redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      
      if (tokenFromUrl) {
        // Verify token with API
        try {
          const apiUrl = process.env.NODE_ENV === 'production' 
            ? 'https://api.marcelnyiro.com/api/auth/verify'
            : 'http://localhost:3002/api/auth/verify';
          
          console.log('Verifying token with API:', apiUrl);
          console.log('Token from URL:', tokenFromUrl);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: tokenFromUrl }),
          });
          
          console.log('API Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Token verification successful:', data);
            setUser(data.user);
            onUserLoad?.(data.user);
            // Store token in localStorage for future use
            localStorage.setItem('authToken', tokenFromUrl);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            const errorData = await response.text();
            console.error('Token verification failed:', response.status, errorData);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
        setAuthChecked(true);
        setIsLoading(false);
      } else {
        // Check for existing token in localStorage
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          console.log('Found stored token, verifying...');
          // Verify the stored token is still valid
          try {
            const apiUrl = process.env.NODE_ENV === 'production' 
              ? 'https://api.marcelnyiro.com/api/auth/verify'
              : 'http://localhost:3002/api/auth/verify';
              
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: storedToken }),
            });
            
            console.log('Stored token verification response:', response.status);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Stored token verification successful:', data);
              setUser(data.user);
              onUserLoad?.(data.user);
            } else {
              console.log('Stored token invalid, clearing storage');
              // Token invalid, clear storage
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
            }
          } catch (error) {
            console.error('Error verifying stored token:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
        setAuthChecked(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://marcelnyiro.com' 
      : 'http://localhost:3000';
  };

  // User update handler
  const handleUserUpdate = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  // Course management functions
  const handleAddCourse = () => {
    console.log('handleAddCourse called, showing course type dialog');
    setShowCourseTypeDialog(true);
  };

  const handleCourseTypeSelect = async (courseType: 'normal' | 'monthly' | 'yearly') => {
    setShowCourseTypeDialog(false);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let newCourse;
      
      // Create course based on selected type
      if (courseType === 'normal') {
        newCourse = {
          title: "New Course",
          description: "A comprehensive course on AI entrepreneurship and business strategy",
          thumbnail: "🤖",
          category: "business",
          level: "intermediate",
          courseType: 'normal',
          modules: [
            {
              title: "Introduction to Course",
              videos: 4,
              episode_date: null,
              episode_time: null
            }
          ]
        };
      } else if (courseType === 'monthly') {
        const currentYear = new Date().getFullYear();
        newCourse = {
          title: `Monthly Course ${currentYear}`,
          description: `Monthly content series for ${currentYear} with episode-based structure`,
          thumbnail: "📅",
          category: "monthly-series",
          level: currentYear.toString(),
          courseType: 'monthly',
          modules: [
            {
              title: "Episode 1: Getting Started",
              videos: 1,
              episode_date: `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
              episode_time: "18:00"
            }
          ]
        };
      } else if (courseType === 'yearly') {
        const currentYear = new Date().getFullYear();
        newCourse = {
          title: `Yearly Program ${currentYear}`,
          description: `Annual program for ${currentYear} - comprehensive year-long learning`,
          thumbnail: "🎯",
          category: "yearly-program", 
          level: "advanced",
          courseType: 'yearly',
          modules: [
            {
              title: "Annual Program Content",
              videos: 1,
              episode_date: null,
              episode_time: null
            }
          ]
        };
      }

      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? 'https://api.marcelnyiro.com/api/courses'
          : 'http://localhost:3002/api/courses',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCourse),
        }
      );

      if (response.ok) {
        await fetchCourses();
        setSelected("courses");
      } else {
        const errorData = await response.text();
        console.error('Failed to create course:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleAddItem = async (category?: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // For weekly-checkins, add a new episode to existing course
      if (category === 'weekly-checkins') {
        // Find the existing weekly-checkins course for the current year
        const currentYear = new Date().getFullYear();
        const existingCourse = courses.find(course => 
          course.category === 'weekly-checkins' && course.level === currentYear.toString()
        );

        if (existingCourse) {
          // Add new episode to existing course
          const nextEpisodeNumber = existingCourse.modules.length + 1;
          const newModule = {
            title: `Episode ${nextEpisodeNumber}: New Episode`,
            videos: 1,
            episode_date: `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
            episode_time: "18:00",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
          };

          // Get the database ID from the course ID
          const databaseId = existingCourse.id.split('-').pop();
          
          const response = await fetch(
            process.env.NODE_ENV === 'production'
              ? `https://api.marcelnyiro.com/api/courses/${databaseId}/modules`
              : `http://localhost:3002/api/courses/${databaseId}/modules`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newModule),
            }
          );

          if (response.ok) {
            await fetchCourses();
            setSelected(existingCourse.id);
          } else {
            const errorData = await response.text();
            console.error('Failed to add module:', response.status, errorData);
          }
          return;
        } else {
          // If no existing weekly-checkins course, create a new one
          const newCourse = {
            title: `Weekly Check-ins ${currentYear}`,
            description: `Weekly content series for ${currentYear} with episode-based structure`,
              thumbnail: "📅",
            category: "weekly-checkins",
            level: currentYear.toString(),
            courseType: 'monthly',
            modules: [
              {
                title: "Episode 1: Getting Started",
                videos: 1,
                  episode_date: `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
                episode_time: "18:00",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
              }
            ]
          };

          const response = await fetch(
            process.env.NODE_ENV === 'production'
              ? 'https://api.marcelnyiro.com/api/courses'
              : 'http://localhost:3002/api/courses',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newCourse),
            }
          );

          if (response.ok) {
            await fetchCourses();
            setSelected("courses");
          } else {
            const errorData = await response.text();
            console.error('Failed to create course:', response.status, errorData);
          }
          return;
        }
      }

      // For monthly-series, create a new course with next available year
      if (category === 'monthly-series') {
        // Find all existing monthly-series courses to get the next year
        const existingMonthlyCourses = courses.filter(course => 
          course.category === 'monthly-series'
        );
        
        // Get the highest year and add 1
        const currentYear = new Date().getFullYear();
        const existingYears = existingMonthlyCourses.map(course => parseInt(course.level)).filter(year => !isNaN(year));
        const nextYear = existingYears.length > 0 ? Math.max(...existingYears) + 1 : currentYear;

        const newCourse = {
          title: `Monthly Course ${nextYear}`,
          description: `Monthly content series for ${nextYear} with episode-based structure`,
          thumbnail: "📅",
          category: "monthly-series",
          level: nextYear.toString(),
          courseType: 'monthly',
          modules: [
            {
              title: "Episode 1: Getting Started",
              videos: 1,
              episode_date: `${nextYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
              episode_time: "18:00",
              videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
          ]
        };

        const response = await fetch(
          process.env.NODE_ENV === 'production'
            ? 'https://api.marcelnyiro.com/api/courses'
            : 'http://localhost:3002/api/courses',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCourse),
          }
        );

        if (response.ok) {
          await fetchCourses();
          setSelected("courses");
        } else {
          const errorData = await response.text();
          console.error('Failed to create course:', response.status, errorData);
        }
        return;
      }

      // For other course types, create new courses
      let courseType: 'normal' | 'monthly' | 'yearly' = 'normal';
      let newCourse;

      if (category?.includes('yearly') || category === 'yearly-program') {
        courseType = 'yearly';
        const currentYear = new Date().getFullYear();
        newCourse = {
          title: `Yearly Program ${currentYear}`,
          description: `Annual program for ${currentYear} - comprehensive year-long learning`,
          thumbnail: "🎯",
          category: "yearly-program", 
          level: "advanced",
          courseType: 'yearly',
          modules: [
            {
              title: "Annual Program Content",
              videos: 1,
              episode_date: null,
              episode_time: null
            }
          ]
        };
      } else {
        // Default to normal course
        courseType = 'normal';
        newCourse = {
          title: "New Course",
          description: "A comprehensive course on AI entrepreneurship and business strategy",
          thumbnail: "🤖",
          category: category || "business",
          level: "intermediate",
          courseType: 'normal',
          modules: [
            {
              title: "Introduction to Course",
              videos: 4,
              episode_date: null,
              episode_time: null
            }
          ]
        };
      }

      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? 'https://api.marcelnyiro.com/api/courses'
          : 'http://localhost:3002/api/courses',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCourse),
        }
      );

      if (response.ok) {
        await fetchCourses();
        setSelected("courses");
      } else {
        const errorData = await response.text();
        console.error('Failed to create course:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create a new category with a unique name
      const existingCategories = [...new Set(courses.map(course => course.category))];
      const categoryNumber = existingCategories.filter(cat => cat.startsWith('business')).length + 1;
      
      const newCourse = {
        id: `business-course-${Date.now()}`,
        title: `AI Entrepreneurship Masterclass ${categoryNumber}`,
        description: "Learn how to build and scale AI-powered businesses from ideation to 73M HUF funding like Outfino.",
        progress: 0,
        lessons: 24,
        thumbnail: "🤖",
        category: `business-${categoryNumber}`,
        level: "intermediate",
        modules: [
          {
            id: 1,
            title: "AI Business Model Validation",
            videos: 4,
            duration: "90 min",
            completed: false,
            locked: false,
            videoUrl: ""
          },
          {
            id: 2,
            title: "Building AI-Powered MVPs",
            videos: 5,
            completed: false,
            locked: false,
            videoUrl: ""
          },
          {
            id: 3,
            title: "Fashion Tech & Industry Applications",
            videos: 4,
            completed: false,
            locked: true,
            videoUrl: ""
          },
          {
            id: 4,
            title: "Securing VC Investment (OUVC Case Study)",
            videos: 4,
            completed: false,
            locked: true,
            videoUrl: ""
          },
          {
            id: 5,
            title: "Scaling AI Products to 5K Users",
            videos: 4,
            completed: false,
            locked: true,
            videoUrl: ""
          },
          {
            id: 6,
            title: "Exit Strategies for AI Startups",
            videos: 4,
            completed: false,
            locked: true,
            videoUrl: ""
          }
        ]
      };

      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? 'https://api.marcelnyiro.com/api/courses'
          : 'http://localhost:3002/api/courses',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCourse),
        }
      );

      if (response.ok) {
        // Refresh courses after successful creation
        await fetchCourses();
        setSelected("courses");
      } else {
        const errorData = await response.text();
        console.error('Failed to create course:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? `https://api.marcelnyiro.com/api/courses/${courseId}`
          : `http://localhost:3002/api/courses/${courseId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Refresh courses after successful deletion
        await fetchCourses();
        // If we're currently viewing the deleted course, go to dashboard
        if (selected === courseId) {
          setSelected('Dashboard');
        }
      } else {
        console.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    const coursesInCategory = courses.filter(course => course.category === category);
    
    if (!confirm(`Are you sure you want to delete the entire "${category}" category and all ${coursesInCategory.length} courses in it? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Delete all courses in the category
      for (const course of coursesInCategory) {
        const response = await fetch(
          process.env.NODE_ENV === 'production'
            ? `https://api.marcelnyiro.com/api/courses/${course.id}`
            : `http://localhost:3002/api/courses/${course.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error(`Failed to delete course ${course.id}`);
        }
      }

      // Refresh courses after deletion
      await fetchCourses();
      // If we're currently viewing a course in the deleted category, go to courses overview
      const currentCourse = courses.find(c => c.id === selected);
      if (currentCourse && currentCourse.category === category) {
        setSelected('courses');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdateCourseTitle = async (courseId: string, newTitle: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

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
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (response.ok) {
        // Update the local courses state immediately for responsive UI
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === courseId 
              ? { ...course, title: newTitle }
              : course
          )
        );
      } else {
        console.error('Failed to update course title');
      }
    } catch (error) {
      console.error('Error updating course title:', error);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user?.name || 'Marcel Nyirő Learning'}</h1>
            <p className="text-gray-400 mb-8">Loading...</p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show access required only after auth check is complete and no user found
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Marcel Nyirő Learning</h1>
            <p className="text-gray-400 mb-8">Access Required</p>
          </div>
          <p className="text-gray-400 mb-6">Please sign in to access your courses and continue your AI entrepreneurship journey.</p>
          <a 
            href={process.env.NODE_ENV === 'production' ? 'https://marcelnyiro.com' : 'http://localhost:3000'}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Go to Main Site
          </a>
        </div>
      </div>
    );
  }

  // Show premium required if user is logged in but not premium
  if (user && user.user_premium === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Premium Access Required</h1>
            <p className="text-gray-400 mb-8">Welcome, {user.name}!</p>
          </div>
          <p className="text-sm sm:text-base text-gray-400 mb-6">
            You need to purchase the course to access the learning platform. 
            Get unlimited access to Marcel's AI entrepreneurship content for just 4000 HUF/month.
          </p>
          <div className="space-y-4">
            <a 
              href={`${process.env.NODE_ENV === 'production' ? 'https://marcelnyiro.com' : 'http://localhost:3000'}/courses`}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium w-full justify-center"
            >
              Purchase Course (4000 HUF/month)
            </a>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium w-full justify-center"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Check if selected is a course ID
    const selectedCourse = courses.find(course => course.id === selected);
    
    switch (selected) {
      case "Dashboard":
        return <DashboardContent user={user} courses={courses} setSelected={setSelected} onRefresh={fetchCourses} />;
      case "courses":
        return <CoursesOverviewContent courses={courses} setSelected={setSelected} />;
      case "progress":
        return <ProgressContent courses={courses} setSelected={setSelected} />;
      case "billing":
        return <BillingContent user={user} />;
      case "settings":
        return <SettingsContent user={user} onUserUpdate={handleUserUpdate} />;
      default:
        // If it's a course ID, show course content, otherwise show dashboard
        if (selectedCourse) {
          return <CourseContent courseId={selected} courses={courses} setCourses={setCourses} onRefresh={fetchCourses} />;
        }
        return <DashboardContent user={user} courses={courses} setSelected={setSelected} onRefresh={fetchCourses} />;
    }
  };

  const getPageTitle = () => {
    const sidebarItems = [
      { id: "Dashboard", label: "Dashboard" },
      { id: "courses", label: "Courses" },
      { id: "progress", label: "My Progress" },
      { id: "billing", label: "Billing & Subscription" },
      { id: "settings", label: "Settings" }
    ];

    // Check if selected is a course ID
    const selectedCourse = courses.find(course => course.id === selected);
    if (selectedCourse) {
      return selectedCourse.title;
    }

    // Find direct match in sidebar items
    const item = sidebarItems.find(item => item.id === selected);
    return item ? item.label : selected;
  };

  const getPageDescription = () => {
    // Check if selected is a course ID
    const selectedCourse = courses.find(course => course.id === selected);
    if (selectedCourse) {
      return selectedCourse.description;
    }

    switch(selected) {
      case "Dashboard":
        return "Welcome back to your learning journey";
      case "courses":
        return "Master AI entrepreneurship with Marcel's comprehensive course collection";
      case "progress":
        return "Track your learning journey and achievements";
      case "billing":
        return "Manage your subscription and billing information";
      case "settings":
        return "Manage your account preferences";
      default:
        return "Continue your learning journey";
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white relative">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 z-50 transition-transform duration-300 h-full lg:h-auto`}>
        <Sidebar
        user={user}
        selected={selected}
        setSelected={setSelected}
        coursesExpanded={coursesExpanded}
        setCoursesExpanded={setCoursesExpanded}
        weeklyCheckinsExpanded={weeklyCheckinsExpanded}
        setWeeklyCheckinsExpanded={setWeeklyCheckinsExpanded}
        userDropdownOpen={userDropdownOpen}
        setUserDropdownOpen={setUserDropdownOpen}
        handleLogout={handleLogout}
        courses={courses}
        onAddCourse={handleAddCourse}
        onAddCategory={handleAddCategory}
        onAddItem={handleAddItem}
        onDeleteCourse={handleDeleteCourse}
        onDeleteCategory={handleDeleteCategory}
        onUpdateCourseTitle={handleUpdateCourseTitle}
        onClose={() => setSidebarOpen(false)}
      />
      </div>
      
      <div className="flex-1 bg-black p-4 sm:p-6 overflow-auto lg:ml-0">
        {/* Mobile Header with Hamburger */}
        <div className="flex lg:hidden items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
          <div className="w-10" />
        </div>
        
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              <EditableField
                value={getPageTitle()}
                onChange={() => {}} // Static for now, can be made dynamic later
                className="text-2xl sm:text-3xl font-bold text-white"
                placeholder="Page Title"
              />
            </h1>
            <p className="text-gray-400 mt-1">
              <EditableField
                value={getPageDescription()}
                onChange={() => {}} // Static for now, can be made dynamic later
                className="text-gray-400"
                placeholder="Page Description"
              />
            </p>
          </div>
          <AdminHeaderButtons onSaveSuccess={fetchCourses} />
        </div>
        
        {renderContent()}
      </div>
      
      {/* Course Type Selection Dialog */}
      <CourseTypeDialog
        isOpen={showCourseTypeDialog}
        onClose={() => setShowCourseTypeDialog(false)}
        onSelectType={handleCourseTypeSelect}
      />
    </div>
  );
};

// Wrapper component with contexts
function LearnedDashboardWithContexts() {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <AdminProvider userEmail={user?.email}>
      <CourseChangesProvider>
        <LearnedDashboard onUserLoad={setUser} />
      </CourseChangesProvider>
    </AdminProvider>
  );
}

export default LearnedDashboardWithContexts;