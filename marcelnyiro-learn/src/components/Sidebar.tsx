"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditableField } from "./EditableField";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Home,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  ChevronDown,
  Lightbulb,
  Target,
  BarChart3,
  CreditCard,
  Calendar,
  CalendarDays,
  Award,
  TrendingUp,
  Plus,
  Trash2
} from "lucide-react";

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

interface SidebarProps {
  user: UserData;
  selected: string;
  setSelected: (selected: string) => void;
  coursesExpanded: boolean;
  setCoursesExpanded: (expanded: boolean) => void;
  weeklyCheckinsExpanded: boolean;
  setWeeklyCheckinsExpanded: (expanded: boolean) => void;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
  handleLogout: () => void;
  courses: Course[];
  onAddCourse: () => void;
  onAddCategory: () => void;
  onAddItem: (category?: string) => void;
  onDeleteCourse: (courseId: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateCourseTitle: (courseId: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  selected,
  setSelected,
  coursesExpanded,
  setCoursesExpanded,
  weeklyCheckinsExpanded,
  setWeeklyCheckinsExpanded,
  userDropdownOpen,
  setUserDropdownOpen,
  handleLogout,
  courses,
  onAddCourse,
  onAddCategory,
  onAddItem,
  onDeleteCourse,
  onDeleteCategory,
  onUpdateCourseTitle
}) => {
  const sidebarOpen = true;
  const { isAdmin } = useAdmin();
  
  // Dynamic category expansion state
  const [categoryExpansions, setCategoryExpansions] = React.useState<Record<string, boolean>>({});

  // Group courses by category dynamically
  const coursesByCategory = courses.reduce((acc, course) => {
    const category = course.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {} as Record<string, typeof courses>);

  // Create dynamic category submenus
  const createCategorySubmenu = (categoryName: string, coursesInCategory: typeof courses) => {
    // Get category display name and icon
    const getCategoryInfo = (cat: string) => {
      switch (cat) {
        case 'weekly-checkins':
          return { label: 'Weekly Check-ins', icon: Lightbulb, addType: 'weekly-checkin-year' as const };
        case 'business':
          return { label: 'Business Courses', icon: TrendingUp, addType: 'course' as const };
        case 'case-study':
          return { label: 'Case Studies', icon: Award, addType: 'course' as const };
        default:
          return { label: cat.charAt(0).toUpperCase() + cat.slice(1), icon: BookOpen, addType: 'course' as const };
      }
    };

    const categoryInfo = getCategoryInfo(categoryName);
    
    // Create submenu items for courses in this category
    const courseSubmenu = coursesInCategory.map(course => ({
      id: course.id,
      label: categoryName === 'weekly-checkins' 
        ? course.title.replace('Weekly Check-ins ', '') 
        : course.title,
      icon: CalendarDays,
      onClick: () => setSelected(course.id),
      courseId: course.id
    }));

    return {
      id: categoryName,
      label: categoryInfo.label,
      icon: categoryInfo.icon,
      onClick: () => setSelected(categoryName),
      hasSubmenu: true,
      submenu: courseSubmenu,
      addType: categoryInfo.addType
    };
  };

  // Build dynamic submenu from all categories
  const dynamicSubmenu = Object.entries(coursesByCategory).map(([category, coursesInCategory]) => 
    createCategorySubmenu(category, coursesInCategory)
  );

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
      submenu: dynamicSubmenu
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
              <div
                onClick={() => {
                  if (item.hasSubmenu) {
                    setCoursesExpanded(!coursesExpanded);
                    if (item.onClick) item.onClick();
                  } else {
                    item.onClick();
                  }
                }}
                className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 cursor-pointer ${
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
              </div>

              {/* Submenu */}
              {item.hasSubmenu && isExpanded && sidebarOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.submenu?.map((subItem) => {
                    const isSubSelected = selected === subItem.id;
                    const isCategoryExpanded = categoryExpansions[subItem.id] || false;
                    return (
                      <div key={subItem.id} className="group relative">
                        <div
                          className={`relative flex h-10 w-full items-center rounded-md transition-all duration-200 cursor-pointer ${
                            isSubSelected 
                              ? "bg-blue-500 text-white shadow-sm" 
                              : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                          }`}
                        >
                          <div 
                            className="flex items-center flex-1"
                            onClick={() => {
                              if (subItem.hasSubmenu) {
                                setCategoryExpansions(prev => ({
                                  ...prev,
                                  [subItem.id]: !prev[subItem.id]
                                }));
                              } else if (subItem.onClick) {
                                subItem.onClick();
                              }
                            }}
                          >
                            <div className="grid h-full w-8 place-content-center">
                              {subItem.icon && <subItem.icon className="h-3 w-3" />}
                            </div>
                            
                            <div className="flex-1 text-left">
                              {subItem.hasSubmenu ? (
                                <span className="text-sm font-medium">
                                  {subItem.label}
                                </span>
                              ) : (
                                <EditableField
                                  value={subItem.label}
                                  onChange={(value) => {
                                    onUpdateCourseTitle((subItem as any).courseId, value);
                                  }}
                                  className="text-sm font-medium"
                                  placeholder="Course name..."
                                />
                              )}
                            </div>

                            {subItem.hasSubmenu && (
                              <ChevronDown 
                                className={`h-3 w-3 text-gray-400 mr-2 transition-transform duration-200 ${
                                  isCategoryExpanded ? 'rotate-180' : ''
                                }`} 
                              />
                            )}

                            {(subItem as any).badge && (
                              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium mr-2">
                                {(subItem as any).badge}
                              </span>
                            )}
                          </div>

                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (subItem.hasSubmenu) {
                                  // Delete entire category
                                  onDeleteCategory(subItem.id);
                                } else if ((subItem as any).courseId) {
                                  // Delete individual course
                                  onDeleteCourse((subItem as any).courseId);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity mr-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        
                        {/* Nested submenu for categories */}
                        {subItem.hasSubmenu && isCategoryExpanded && (
                          <div className="ml-3 mt-0.5 space-y-0.5">
                            {subItem.submenu?.map((seasonItem: any) => {
                              const isSeasonSelected = selected === seasonItem.id;
                              const course = courses.find(c => c.id === seasonItem.courseId);
                              return (
                                <div key={seasonItem.id} className="group relative">
                                  <div
                                    className={`relative flex h-8 w-full items-center rounded-md transition-all duration-200 cursor-pointer ${
                                      isSeasonSelected 
                                        ? "bg-blue-500 text-white shadow-sm" 
                                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                    }`}
                                  >
                                    <div 
                                      className="flex items-center flex-1"
                                      onClick={seasonItem.onClick}
                                    >
                                      <div className="grid h-full w-8 place-content-center">
                                        {seasonItem.icon && <seasonItem.icon className="h-3 w-3" />}
                                      </div>
                                      <div className="flex-1 text-left">
                                        <EditableField
                                          value={seasonItem.label}
                                          onChange={(value) => {
                                            // For weekly checkins, we need to update the full title
                                            const newTitle = `Weekly Check-ins ${value}`;
                                            onUpdateCourseTitle(seasonItem.courseId, newTitle);
                                          }}
                                          className="text-sm font-medium"
                                          placeholder="Year..."
                                        />
                                      </div>
                                    </div>
                                    {isAdmin && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteCourse(seasonItem.courseId);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity mr-1"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {/* Add new item button */}
                            {isAdmin && (
                              <button
                                onClick={() => onAddItem(subItem.id)}
                                className="flex h-8 w-full items-center rounded-md text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-all duration-200"
                              >
                                <div className="grid h-full w-8 place-content-center">
                                  <Plus className="h-3 w-3" />
                                </div>
                                <span className="text-sm font-medium flex-1 text-left">
                                  Add Item
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Add new course button */}
                  {isAdmin && (
                    <button
                      onClick={() => onAddCourse()}
                      className="flex h-10 w-full items-center rounded-md text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-all duration-200"
                    >
                      <div className="grid h-full w-8 place-content-center">
                        <Plus className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium flex-1 text-left">
                        Add Course
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};