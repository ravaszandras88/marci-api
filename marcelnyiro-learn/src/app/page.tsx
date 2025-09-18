"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Users,
  Play,
  Clock,
  CheckCircle,
  Lock,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Video,
  Lightbulb,
  Target,
  ChevronRight,
  BarChart3,
  CreditCard,
  Calendar,
  CalendarDays,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayerPro from "@/components/ui/video-player-pro";

interface UserData {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  lessons: number;
  thumbnail: string;
  category: string;
  level: string;
  modules: Array<{
    id: number;
    title: string;
    videos: number;
    duration: string;
    completed: boolean;
    locked: boolean;
  }>;
}

const LearnedDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const sidebarOpen = true;
  const [selected, setSelected] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [coursesExpanded, setCoursesExpanded] = useState(true);
  const [weeklyCheckinsExpanded, setWeeklyCheckinsExpanded] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for JWT token in URL parameters first (from redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      
      if (tokenFromUrl) {
        // Verify token with API
        try {
          const response = await fetch(
            process.env.NODE_ENV === 'production' 
              ? 'https://api.marcelnyiro.com/api/auth/verify'
              : 'http://localhost:3002/api/auth/verify',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: tokenFromUrl }),
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            // Store token in localStorage for future use
            localStorage.setItem('authToken', tokenFromUrl);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('Token verification failed');
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
          // Verify the stored token is still valid
          try {
            const response = await fetch(
              process.env.NODE_ENV === 'production' 
                ? 'https://api.marcelnyiro.com/api/auth/verify'
                : 'http://localhost:3002/api/auth/verify',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: storedToken }),
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            } else {
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


    // Fetch courses from database
    const fetchCourses = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await fetch(
            process.env.NODE_ENV === 'production' 
              ? 'https://api.marcelnyiro.com/api/courses'
              : 'http://localhost:3002/api/courses',
            {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (response.ok) {
            const coursesData = await response.json();
            setCourses(coursesData);
          } else {
            console.error('Failed to fetch courses');
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://marcelnyiro.com' 
      : 'http://localhost:3000';
  };

  // Show loading screen while checking authentication
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Username</h1>
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Username</h1>
            <p className="text-gray-400 mb-8">Access Required</p>
          </div>
          <p className="text-gray-400 mb-6">Please sign in to access your courses and continue your AI entrepreneurship journey.</p>
          <a 
            href={process.env.NODE_ENV === 'production' ? 'https://marcelnyiro.com' : 'http://localhost:3000'}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Go to Main Site
            <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    );
  }

  // Sidebar Component
  const Sidebar = () => {
    const sidebarItems = [
      { 
        id: "Dashboard", 
        label: "Dashboard", 
        icon: Home,
        onClick: () => setSelected("Dashboard")
      },
      { 
        id: "courses", 
        label: "Courses", 
        icon: BookOpen,
        onClick: () => setSelected("courses"),
        hasSubmenu: true,
        submenu: [
          {
            id: "weekly-checkins",
            label: "Weekly Check-ins",
            icon: Lightbulb,
            onClick: () => setSelected("weekly-checkins"),
            hasSubmenu: true,
            submenu: [
              {
                id: "weekly-checkins-2023",
                label: "2023",
                icon: CalendarDays,
                onClick: () => setSelected("weekly-checkins-2023")
              },
              {
                id: "weekly-checkins-2024", 
                label: "2024",
                icon: CalendarDays,
                onClick: () => setSelected("weekly-checkins-2024")
              },
              {
                id: "weekly-checkins-2025",
                label: "2025",
                icon: CalendarDays,
                onClick: () => setSelected("weekly-checkins-2025")
              }
            ]
          },
          {
            id: "outfino-case-study",
            label: "Outfino Case Study",
            icon: Award,
            onClick: () => setSelected("outfino-case-study")
          },
          {
            id: "startup-scaling",
            label: "Startup Scaling",
            icon: TrendingUp,
            onClick: () => setSelected("startup-scaling")
          }
        ]
      },
      { 
        id: "progress", 
        label: "My Progress", 
        icon: BarChart3,
        onClick: () => setSelected("progress")
      }
    ];

    return (
      <nav
        className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-16'
        } border-gray-800 bg-gray-900 p-2 shadow-sm`}
      >
        {/* Title Section with User Dropdown */}
        <div className={`border-b border-gray-800 transition-all duration-200 ${userDropdownOpen ? 'mb-0 pb-2' : 'mb-6 pb-4'}`}>
          <div className={`bg-gray-800 rounded-md border border-gray-700 overflow-hidden transition-all duration-200 ${userDropdownOpen ? 'shadow-lg' : ''}`}>
            {/* User Button */}
            <motion.div 
              className="flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-gray-700"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              animate={{ 
                borderRadius: userDropdownOpen ? "6px 6px 0 0" : "6px",
                backgroundColor: userDropdownOpen ? "rgb(55, 65, 81)" : "rgb(31, 41, 55)"
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && (
                <div className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="block text-sm font-semibold text-white">
                        {user.name}
                      </span>
                      <span className="block text-xs text-gray-400">
                        Member since {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            )}
            </motion.div>
            
            {/* Dropdown Menu - Same Container */}
            <AnimatePresence mode="wait">
              {userDropdownOpen && sidebarOpen && (
                <motion.div 
                  className="border-t border-gray-600 bg-gray-800"
                  initial={{ 
                    height: 0, 
                    opacity: 0,
                    overflow: "hidden"
                  }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1,
                    overflow: "hidden",
                    transition: {
                      height: {
                        duration: 0.3,
                        ease: "easeOut"
                      },
                      opacity: {
                        duration: 0.2,
                        ease: "easeOut"
                      }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    overflow: "hidden",
                    transition: {
                      height: {
                        duration: 0.2,
                        ease: "easeIn"
                      },
                      opacity: {
                        duration: 0.15,
                        ease: "easeIn"
                      }
                    }
                  }}
                >
                <div className="pt-1 pb-3">
                <button
                  onClick={() => {
                    setSelected("billing");
                    setUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </button>
                <button
                  onClick={() => {
                    window.open('https://calendly.com/marcel-nyiro', '_blank');
                    setUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Book a Meeting
                </button>
                <button
                  onClick={() => {
                    setSelected("settings");
                    setUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Items */}
        <div className={`space-y-1 transition-all duration-300 ${userDropdownOpen ? 'mt-6' : 'mt-0'}`}>
          {sidebarItems.map((item) => {
            const isSelected = selected === item.id;
            const isExpanded = item.id === 'courses' ? coursesExpanded : false;
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setCoursesExpanded(!coursesExpanded);
                      if (item.onClick) item.onClick();
                    } else {
                      item.onClick();
                    }
                  }}
                  className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
                    isSelected 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : (item as any).className || "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }`}
                >
                  <div className="grid h-full w-12 place-content-center">
                    <item.icon className="h-4 w-4" />
                  </div>
                  
                  {sidebarOpen && (
                    <span
                      className={`text-sm font-medium transition-opacity duration-200 flex-1 text-left ${
                        sidebarOpen ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}

                  {(item as any).badge && sidebarOpen && (
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium mr-2">
                      {(item as any).badge}
                    </span>
                  )}

                  {item.hasSubmenu && sidebarOpen && (
                    <ChevronDown 
                      className={`h-4 w-4 text-gray-400 mr-2 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>

                {/* Submenu */}
                {item.hasSubmenu && isExpanded && sidebarOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu?.map((subItem) => {
                      const isSubSelected = selected === subItem.id;
                      const isWeeklyCheckinsExpanded = subItem.id === 'weekly-checkins' ? weeklyCheckinsExpanded : false;
                      return (
                        <div key={subItem.id}>
                          <button
                            onClick={() => {
                              if (subItem.hasSubmenu) {
                                if (subItem.id === 'weekly-checkins') {
                                  setWeeklyCheckinsExpanded(!weeklyCheckinsExpanded);
                                }
                              } else if (subItem.onClick) {
                                subItem.onClick();
                              }
                            }}
                            className={`relative flex h-10 w-full items-center rounded-md transition-all duration-200 ${
                              isSubSelected 
                                ? "bg-blue-500 text-white shadow-sm" 
                                : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                            }`}
                          >
                            <div className="grid h-full w-8 place-content-center">
                              {subItem.icon && <subItem.icon className="h-3 w-3" />}
                            </div>
                            
                            <span className="text-sm font-medium flex-1 text-left">
                              {subItem.label}
                            </span>

                            {subItem.hasSubmenu && (
                              <ChevronDown 
                                className={`h-3 w-3 text-gray-400 mr-2 transition-transform duration-200 ${
                                  isWeeklyCheckinsExpanded ? 'rotate-180' : ''
                                }`} 
                              />
                            )}

                            {subItem.badge && (
                              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium mr-2">
                                {subItem.badge}
                              </span>
                            )}
                          </button>
                          
                          {/* Nested submenu for seasons */}
                          {subItem.hasSubmenu && isWeeklyCheckinsExpanded && (
                            <div className="ml-3 mt-0.5 space-y-0.5">
                              {subItem.submenu?.map((seasonItem) => {
                                const isSeasonSelected = selected === seasonItem.id;
                                return (
                                  <button
                                    key={seasonItem.id}
                                    onClick={seasonItem.onClick}
                                    className={`relative flex h-8 w-full items-center rounded-md transition-all duration-200 ${
                                      isSeasonSelected 
                                        ? "bg-blue-500 text-white shadow-sm" 
                                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                    }`}
                                  >
                                    <div className="grid h-full w-8 place-content-center">
                                      {seasonItem.icon && <seasonItem.icon className="h-3 w-3" />}
                                    </div>
                                    <span className="text-sm font-medium flex-1 text-left">
                                      {seasonItem.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>


      </nav>
    );
  };

  // Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-blue-100 mb-6">Continue your AI entrepreneurship journey with Marcel's proven strategies.</p>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>73M HUF Success Story</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>300+ Active Users</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>OUVC Backed</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Enrolled Courses</h3>
          <p className="text-2xl font-bold text-white">{courses.length}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-900/20 rounded-lg">
              <Video className="h-5 w-5 text-green-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Total Lessons</h3>
          <p className="text-2xl font-bold text-white">{courses.reduce((acc, course) => acc + course.lessons, 0)}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Avg Progress</h3>
          <p className="text-2xl font-bold text-white">{Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Total Hours</h3>
          <p className="text-2xl font-bold text-white">
            {courses.reduce((total, course) => {
              const hours = parseInt(course.duration.split(' ')[0]) || 0;
              return total + hours;
            }, 0)}
          </p>
        </div>
      </div>
      
      {/* Courses Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Courses</h2>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex gap-4 mb-4">
                <div className="text-3xl">{course.thumbnail}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setSelected(course.id)}
              >
                {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Course Content
  const CourseContent = ({ courseId }: { courseId: string }) => {
    const course = courses.find(c => c.id === courseId);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [localModules, setLocalModules] = useState(course?.modules || []);
    
    if (!course) return <div className="text-white">Course not found</div>;
    
    // Extract year from course for Weekly Check-ins
    const courseYear = courseId.includes('2023') ? 2023 : 
                       courseId.includes('2024') ? 2024 : 
                       courseId.includes('2025') ? 2025 : selectedYear;
    
    // Filter modules by selected month (assuming modules have episode_date)
    const filteredModules = course.modules.filter((module: any) => {
      if (!module.episode_date) return true; // Show all if no date
      const moduleDate = new Date(module.episode_date);
      return moduleDate.getMonth() === selectedMonth && 
             moduleDate.getFullYear() === courseYear;
    });
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    
    const handlePrevMonth = () => {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        if (courseYear === selectedYear) setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    };
    
    const handleNextMonth = () => {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        if (courseYear === selectedYear) setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    };
    
    // Check if it's a weekly check-ins course
    const isWeeklyCheckins = course.category === 'weekly-checkins';

    // Handle video completion
    const handleVideoComplete = async (episodeId: number) => {
      console.log('Video completed! Episode ID:', episodeId, 'Course ID:', course.id);
      
      // Update local state
      const updatedModules = localModules.map(module => 
        module.id === episodeId ? { ...module, completed: true } : module
      );
      setLocalModules(updatedModules);

      // Update database
      try {
        const token = localStorage.getItem('authToken');
        console.log('Sending completion request with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch(
          process.env.NODE_ENV === 'production' 
            ? 'https://api.marcelnyiro.com/api/episodes/complete'
            : 'http://localhost:3002/api/episodes/complete',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              courseId: course.id,
              episodeId: episodeId 
            }),
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
        } else {
          const data = await response.json();
          console.log('Progress updated successfully:', data);
          
          // Update the course progress in the local state
          // Also update the modules to reflect completion
          const updatedCourse = {
            ...course,
            progress: data.progress,
            modules: updatedModules
          };
          
          // Update the parent courses array
          const allCourses = [...courses];
          const courseIndex = allCourses.findIndex(c => c.id === course.id);
          if (courseIndex !== -1) {
            allCourses[courseIndex] = updatedCourse;
            setCourses(allCourses);
          }
        }
      } catch (error) {
        console.error('Failed to update completion status:', error);
      }

      // Auto-advance to next episode
      const currentModules = isWeeklyCheckins ? filteredModules : localModules;
      const nextIndex = currentEpisodeIndex + 1;
      if (nextIndex < currentModules.length) {
        setCurrentEpisodeIndex(nextIndex);
      }
    };

    // Handle episode selection
    const handleEpisodeSelect = (index: number, episode: any) => {
      // Remove lock check - all episodes are accessible
      setCurrentEpisodeIndex(index);
    };

    const currentModules = isWeeklyCheckins ? filteredModules : localModules;
    const currentEpisode = currentModules[currentEpisodeIndex];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
          <p className="text-gray-300 mb-6">{course.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              {course.modules.length} episodes
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {course.level}
            </span>
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              {course.progress}% Complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentEpisode && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">{currentEpisode.title}</h2>
                <VideoPlayerPro 
                  src={currentEpisode.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
                  onVideoComplete={() => handleVideoComplete(currentEpisode.id)}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Course Episodes</h3>
              {isWeeklyCheckins ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 rounded transition-colors group"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                  </button>
                  <span className="text-sm font-medium text-gray-300 min-w-[120px] text-center">
                    {monthNames[selectedMonth]} {courseYear}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 rounded transition-colors group"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-400">
                  {course.modules.filter(m => m.completed).length} of {course.modules.length} completed
                </span>
              )}
            </div>
            
            {currentModules.map((episode, index) => {
              const isCurrentEpisode = index === currentEpisodeIndex;
              return (
                <div 
                  key={episode.id} 
                  onClick={() => handleEpisodeSelect(index, episode)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                    isCurrentEpisode
                      ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/50'
                      : episode.completed 
                        ? 'bg-green-900/20 border-green-700' 
                        : 'bg-gray-900 border-gray-700 hover:border-blue-500'
                  }`}
                >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-300 text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  {episode.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <Play className="h-5 w-5 text-blue-400" />
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{episode.title}</h4>
                    <p className="text-sm text-gray-400">{episode.duration}</p>
                  </div>
                  
                  {episode.completed && (
                    <div className="text-xs text-green-400 font-medium">Completed</div>
                  )}
                  {isCurrentEpisode && !episode.completed && (
                    <div className="text-xs text-blue-400 font-medium">Now Playing</div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Courses Overview Content
  const CoursesOverviewContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">All Courses</h2>
        <p className="text-gray-400 mb-8">Master AI entrepreneurship with Marcel's comprehensive course collection</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{course.thumbnail}</div>
              <div>
                <h3 className="text-lg font-bold text-white">{course.title}</h3>
                <p className="text-sm text-gray-400">{course.level}</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{course.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                {course.lessons} episodes
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setSelected(course.id)}
            >
              {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  // Progress Content
  const ProgressContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">My Progress</h2>
        <p className="text-gray-400 mb-8">Track your learning journey and achievements</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Completed Courses</h3>
          <p className="text-2xl font-bold text-white">{courses.filter(c => c.progress === 100).length}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Episodes Completed</h3>
          <p className="text-2xl font-bold text-white">
            {courses.reduce((acc, course) => acc + course.modules.filter(m => m.completed).length, 0)}
          </p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Avg Progress</h3>
          <p className="text-2xl font-bold text-white">{Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-400" />
            </div>
          </div>
          <h3 className="font-medium text-gray-400 mb-1">Learning Hours</h3>
          <p className="text-2xl font-bold text-white">
            {courses.reduce((total, course) => {
              const hours = parseInt(course.duration.split(' ')[0]) || 0;
              return total + hours;
            }, 0)}
          </p>
        </div>
      </div>

      {/* Course Progress Details */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">Course Progress</h3>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{course.thumbnail}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                    <p className="text-sm text-gray-400">{course.modules.length} episodes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{course.progress}%</p>
                  <p className="text-sm text-gray-400">Complete</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {course.modules.filter(m => m.completed).length} of {course.modules.length} episodes completed
                </span>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setSelected(course.id)}
                >
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Billing Content
  const BillingContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>
        <p className="text-gray-400 mb-8">Manage your subscription and billing information</p>
      </div>

      {/* Membership Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Membership Status</h3>
          <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Active</span>
        </div>
        <p className="text-gray-400 mb-4">Full access to all courses and content</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently joined'}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <CreditCard className="h-8 w-8 text-blue-400" />
          <div>
            <p className="text-white font-medium">•••• •••• •••• 4242</p>
            <p className="text-gray-400 text-sm">Expires 12/27</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Content
  const SettingsContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
        <p className="text-gray-400 mb-8">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
            <input 
              type="text" 
              value={user.name} 
              disabled
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input 
              type="email" 
              value={user.email} 
              disabled
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Course Updates</span>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Email Notifications</span>
            <button className="w-12 h-6 bg-gray-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selected) {
      case "Dashboard":
        return <DashboardContent />;
      case "courses":
        return <CoursesOverviewContent />;
      case "weekly-checkins-2023":
      case "weekly-checkins-2024":
      case "weekly-checkins-2025":
      case "outfino-case-study":
      case "startup-scaling":
        return <CourseContent courseId={selected} />;
      case "progress":
        return <ProgressContent />;
      case "billing":
        return <BillingContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      <Sidebar />
      <div className="flex-1 bg-black p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {(() => {
                // Find the selected item in the sidebar structure
                const sidebarItems = [
                  { 
                    id: "Dashboard", 
                    label: "Dashboard", 
                    icon: Home,
                  },
                  { 
                    id: "courses", 
                    label: "Courses", 
                    icon: BookOpen,
                    submenu: [
                      {
                        id: "weekly-checkins",
                        label: "Weekly Check-ins",
                        icon: Lightbulb,
                        submenu: [
                          { id: "weekly-checkins-2023", label: "2023" },
                          { id: "weekly-checkins-2024", label: "2024" },
                          { id: "weekly-checkins-2025", label: "2025" }
                        ]
                      },
                      { id: "outfino-case-study", label: "Outfino Case Study" },
                      { id: "startup-scaling", label: "Startup Scaling" }
                    ]
                  },
                  { id: "progress", label: "My Progress" },
                  { id: "billing", label: "Billing & Subscription" },
                  { id: "settings", label: "Settings" }
                ];

                // Check if selected is a year under weekly-checkins
                if (selected.startsWith("weekly-checkins-")) {
                  return "Weekly Check-ins";
                }

                // Find direct match
                for (const item of sidebarItems) {
                  if (item.id === selected) return item.label;
                  if (item.submenu) {
                    for (const subItem of item.submenu) {
                      if (subItem.id === selected) return subItem.label;
                    }
                  }
                }

                return selected;
              })()}
            </h1>
            <p className="text-gray-400 mt-1">
              {(() => {
                switch(selected) {
                  case "Dashboard":
                    return "Welcome back to your learning journey";
                  case "courses":
                    return "Master AI entrepreneurship with Marcel's comprehensive course collection";
                  case "weekly-checkins-2023":
                  case "weekly-checkins-2024":
                  case "weekly-checkins-2025":
                    return "Continue learning weekly-checkins";
                  case "outfino-case-study":
                    return "Learn from the 73M HUF success story";
                  case "startup-scaling":
                    return "Scale your startup with proven strategies";
                  case "progress":
                    return "Track your learning journey and achievements";
                  case "billing":
                    return "Manage your subscription and billing information";
                  case "settings":
                    return "Manage your account preferences";
                  default:
                    return "Continue your learning journey";
                }
              })()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default LearnedDashboard;