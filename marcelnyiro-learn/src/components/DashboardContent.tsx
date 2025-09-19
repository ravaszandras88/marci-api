"use client";

import React from "react";
import {
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Video,
  Target,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableField } from "@/components/EditableField";
import { useCourseChanges } from "@/contexts/CourseChangesContext";
import { useAdmin } from "@/contexts/AdminContext";

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
  status?: string;
  modules: Array<{
    id: number;
    title: string;
    videos: number;
      completed: boolean;
    locked: boolean;
  }>;
}

interface DashboardContentProps {
  user: UserData;
  courses: Course[];
  setSelected: (selected: string) => void;
  onRefresh?: () => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  courses,
  setSelected,
  onRefresh
}) => {
  const { updateCourseField } = useCourseChanges();
  const { isAdmin } = useAdmin();
  
  const handleStatusToggle = async (courseId: string, currentStatus?: string) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Extract database ID from courseId (always the last part after final hyphen)
      const databaseId = courseId.split('-').pop();
      console.log('Toggling status for course:', courseId, 'Database ID:', databaseId, 'New status:', newStatus);
      
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://api.marcelnyiro.com/api/courses/${databaseId}/status`
        : `http://localhost:3002/api/courses/${databaseId}/status`;
      
      console.log('Making API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Status update successful:', result);
        // Refresh courses data from server to get updated status
        if (onRefresh) {
          await onRefresh();
        }
        // Also update local state for immediate feedback
        updateCourseField(courseId, 'status', newStatus);
      } else {
        const errorText = await response.text();
        console.error('Failed to update course status:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error updating course status:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white">
        <h1 className="text-3xl font-bold mb-2">
          <EditableField
            value={`Welcome back, ${user.name}!`}
            onChange={() => {}} // Static for now
            className="text-3xl font-bold text-white"
            placeholder="Welcome message"
          />
        </h1>
        <p className="text-blue-100 mb-6">
          <EditableField
            value="Continue your AI entrepreneurship journey with Marcel's proven strategies."
            onChange={() => {}} // Static for now
            className="text-blue-100"
            placeholder="Subtitle"
          />
        </p>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>
              <EditableField
                value="73M HUF Success Story"
                onChange={() => {}} // Static achievement
                className="text-blue-100"
                placeholder="Achievement"
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              <EditableField
                value="300+ Active Users"
                onChange={() => {}} // Static stat
                className="text-blue-100"
                placeholder="User Stat"
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>
              <EditableField
                value="OUVC Backed"
                onChange={() => {}} // Static backing info
                className="text-blue-100"
                placeholder="Backing Info"
              />
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-400 mb-1">
            <EditableField
              value="Enrolled Courses"
              onChange={() => {}} // Static stat label
              className="font-medium text-gray-400"
              placeholder="Stat Label"
            />
          </h3>
          <p className="text-2xl font-bold text-white">{courses.length}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-900/20 rounded-lg">
              <Video className="h-5 w-5 text-green-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-400 mb-1">
            <EditableField
              value="Total Lessons"
              onChange={() => {}} // Static stat label
              className="font-medium text-gray-400"
              placeholder="Stat Label"
            />
          </h3>
          <p className="text-2xl font-bold text-white">{courses.reduce((acc, course) => acc + course.lessons, 0)}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-400 mb-1">
            <EditableField
              value="Avg Progress"
              onChange={() => {}} // Static stat label
              className="font-medium text-gray-400"
              placeholder="Stat Label"
            />
          </h3>
          <p className="text-2xl font-bold text-white">{Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%</p>
        </div>

      </div>
      
      {/* Courses Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            <EditableField
              value="Your Courses"
              onChange={() => {}} // Static section title
              className="text-2xl font-bold text-white"
              placeholder="Section Title"
            />
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex gap-4 mb-4">
                <div className="text-3xl">
                  <EditableField
                    value={course.thumbnail}
                    onChange={(value) => updateCourseField(course.id, 'thumbnail', value)}
                    placeholder="📚"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    <EditableField
                      value={course.title}
                      onChange={(value) => updateCourseField(course.id, 'title', value)}
                      className="text-lg font-bold text-white"
                      placeholder="Course Title"
                    />
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    <EditableField
                      value={course.description}
                      onChange={(value) => updateCourseField(course.id, 'description', value)}
                      className="text-gray-400 text-sm"
                      multiline={true}
                      placeholder="Course description..."
                    />
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <EditableField
                        value={course.lessons.toString()}
                        onChange={(value) => updateCourseField(course.id, 'lessons', parseInt(value) || 0)}
                        className="text-gray-400"
                        placeholder="0"
                      /> lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <EditableField
                        value={course.level}
                        onChange={(value) => updateCourseField(course.id, 'level', value)}
                        className="text-gray-400"
                        placeholder="Level"
                      />
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    <EditableField
                      value="Progress"
                      onChange={() => {}} // Static label
                      className="text-gray-400"
                      placeholder="Label"
                    />
                  </span>
                  <span className="text-white font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Admin Status Toggle */}
              {isAdmin && (
                <div className="mb-4 flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      course.status === 'active' 
                        ? 'bg-green-900 text-green-300 border border-green-700' 
                        : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                    }`}>
                      {course.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => handleStatusToggle(course.id, course.status)}
                  >
                    Make {course.status === 'active' ? 'Draft' : 'Active'}
                  </Button>
                </div>
              )}
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setSelected(course.id)}
              >
                <EditableField
                  value={course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  onChange={() => {}} // Static button text
                  className="text-white"
                  placeholder="Button Text"
                />
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};