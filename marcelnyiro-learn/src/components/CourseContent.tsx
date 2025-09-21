"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Target,
  Award,
  CheckCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  Upload,
  Link,
  X,
  Plus,
  Trash2
} from "lucide-react";
import VideoPlayerPro from "@/components/ui/video-player-pro";
import { EditableField } from "@/components/EditableField";
import { useCourseChanges } from "@/contexts/CourseChangesContext";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  thumbnail: string;
  category: string;
  level: string;
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

interface CourseContentProps {
  courseId: string;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  onRefresh?: () => Promise<void>;
}

export const CourseContent: React.FC<CourseContentProps> = ({
  courseId,
  courses,
  setCourses,
  onRefresh
}) => {
  const course = courses.find(c => c.id === courseId);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // For monthly courses, initialize to the month of the first episode
    if (course?.courseType === 'monthly' && course.modules.length > 0) {
      const firstModule = course.modules[0];
      if (firstModule.episode_date) {
        return new Date(firstModule.episode_date).getMonth();
      }
    }
    return new Date().getMonth();
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    // For monthly courses, initialize to the year of the first episode
    if (course?.courseType === 'monthly' && course.modules.length > 0) {
      const firstModule = course.modules[0];
      if (firstModule.episode_date) {
        return new Date(firstModule.episode_date).getFullYear();
      }
    }
    return new Date().getFullYear();
  });
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [localModules, setLocalModules] = useState(course?.modules || []);
  const { updateCourseField, updateModuleField, getChangesForCourse } = useCourseChanges();
  const { isAdmin, isEditMode } = useAdmin();
  
  // Update localModules when course data changes (e.g., after save)
  useEffect(() => {
    if (course?.modules) {
      console.log('CourseContent: Updating localModules with fresh course data');
      console.log('Fresh course.modules:', course.modules);
      setLocalModules(course.modules);
    }
  }, [course?.modules]);
  
  // Video upload states
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  if (!course) return <div className="text-white">Course not found</div>;


  // Get the current changes for this course and merge with original data
  const courseChanges = getChangesForCourse(course.id);
  const displayCourse = {
    ...course,
    ...courseChanges
  };
  
  // Handle different course types
  const courseType = course.courseType || 'normal';
  
  // Extract year from course for Monthly courses
  const courseYear = courseId.includes('2023') ? 2023 : 
                     courseId.includes('2024') ? 2024 : 
                     courseId.includes('2025') ? 2025 : selectedYear;
  
  // Filter modules based on course type
  let filteredModules;
  if (courseType === 'monthly') {
    // For monthly courses, filter by selected month
    filteredModules = course.modules.filter((module: any) => {
      if (!module.episode_date) return true;
      const moduleDate = new Date(module.episode_date);
      return moduleDate.getMonth() === selectedMonth && 
             moduleDate.getFullYear() === courseYear;
    });
  } else if (courseType === 'yearly') {
    // For yearly courses, don't show modules at all
    filteredModules = [];
  } else {
    // For normal courses, show all modules
    filteredModules = course.modules;
  }
  
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
  const isWeeklyCheckins = courseType === 'monthly';

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
        
        // Trigger a refresh to get the latest data from the database
        if (onRefresh) {
          await onRefresh();
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


  // Video URL validation and processing
  const processVideoUrl = (url: string): string => {
    // YouTube URL processing
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      
      if (videoId) {
        // Return embeddable YouTube URL
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Vimeo URL processing
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    
    // For direct video files, return as-is
    return url;
  };

  const validateVideoUrl = (url: string): boolean => {
    // Check if it's a valid URL
    try {
      new URL(url);
    } catch {
      return false;
    }

    // Check if it's a supported format
    const supportedPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com'];
    const supportedFormats = ['.mp4', '.webm', '.ogg', '.mov'];
    
    const isPlatformSupported = supportedPlatforms.some(platform => url.includes(platform));
    const isDirectVideo = supportedFormats.some(format => url.toLowerCase().includes(format));
    const isLocalVideo = url.startsWith('/videos/');
    
    return isPlatformSupported || isDirectVideo || isLocalVideo;
  };

  // Video upload handlers
  const handleVideoUrlSubmit = async () => {
    if (!videoUrl.trim()) return;
    
    // Validate URL
    if (!validateVideoUrl(videoUrl)) {
      alert('Please enter a valid video URL. Supported: YouTube, Vimeo, or direct video file links (MP4, WebM, OGG)');
      return;
    }
    
    setIsUploading(true);
    try {
      const currentModules = isWeeklyCheckins ? filteredModules : localModules;
      const episodeToUpdate = courseType === 'yearly' ? course.modules[0] : currentModules[currentEpisodeIndex];
      const processedUrl = processVideoUrl(videoUrl);
      
      // Update video URL
      updateModuleField(course.id, episodeToUpdate.id, 'videoUrl', processedUrl);
      
      setShowVideoUpload(false);
      setVideoUrl('');
    } catch (error) {
      console.error('Error updating video URL:', error);
      alert('Failed to save video URL');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, or OGG)');
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', file);
      formData.append('courseId', course.id);
      const currentModules = isWeeklyCheckins ? filteredModules : localModules;
      const episodeToUpdate = courseType === 'yearly' ? course.modules[0] : currentModules[currentEpisodeIndex];
      formData.append('moduleId', episodeToUpdate.id.toString());

      const token = localStorage.getItem('authToken');
      const response = await fetch(
        process.env.NODE_ENV === 'production' 
          ? 'https://api.marcelnyiro.com/api/videos/upload'
          : 'http://localhost:3002/api/videos/upload',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        updateModuleField(course.id, episodeToUpdate.id, 'videoUrl', result.videoUrl);
        
        
        setShowVideoUpload(false);
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        alert('Failed to upload video: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle episode selection
  const handleEpisodeSelect = (index: number, episode: any) => {
    // Remove lock check - all episodes are accessible
    setCurrentEpisodeIndex(index);
  };

  // Handle adding new episode
  const handleAddEpisode = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get the database ID from the course ID
      const databaseId = course.id.split('-').pop();
      
      // Create new episode with appropriate structure based on course type
      const nextEpisodeNumber = course.modules.length + 1;
      
      let newModule;
      if (courseType === 'monthly') {
        // Use the selected month and year for monthly courses
        const episodeYear = selectedYear;
        const episodeMonth = selectedMonth + 1; // selectedMonth is 0-based, so add 1
        
        newModule = {
          title: `Episode ${nextEpisodeNumber}: New Episode`,
          videos: 1,
          episode_date: `${episodeYear}-${String(episodeMonth).padStart(2, '0')}-01`,
          episode_time: "18:00",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        };
      } else if (courseType === 'yearly') {
        newModule = {
          title: `Episode ${nextEpisodeNumber}: New Episode`,
          videos: 1,
          episode_date: null,
          episode_time: null,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        };
      } else {
        // Normal course
        newModule = {
          title: `Episode ${nextEpisodeNumber}: New Episode`,
          videos: 1,
          episode_date: null,
          episode_time: null,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        };
      }

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
        const result = await response.json();
        
        // Create the new episode object with the returned ID
        const newEpisode = {
          id: result.moduleId,
          ...newModule,
          completed: false,
          locked: false
        };
        
        // Update the courses state directly
        const updatedCourses = courses.map(c => {
          if (c.id === course.id) {
            return {
              ...c,
              modules: [...c.modules, newEpisode]
            };
          }
          return c;
        });
        setCourses(updatedCourses);
        
        // Update local modules state
        setLocalModules([...localModules, newEpisode]);
        
      } else {
        const errorData = await response.text();
        console.error('Failed to add episode:', response.status, errorData);
        alert('Failed to add episode. Please try again.');
      }
    } catch (error) {
      console.error('Error adding episode:', error);
      alert('Failed to add episode. Please try again.');
    }
  };

  // Handle deleting episode
  const handleDeleteEpisode = async (episodeId: number) => {
    if (!confirm('Are you sure you want to delete this episode? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? `https://api.marcelnyiro.com/api/episodes/${episodeId}`
          : `http://localhost:3002/api/episodes/${episodeId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Update the courses state directly
        const updatedCourses = courses.map(c => {
          if (c.id === course.id) {
            return {
              ...c,
              modules: c.modules.filter(m => m.id !== episodeId)
            };
          }
          return c;
        });
        setCourses(updatedCourses);
        
        // Update local modules state
        setLocalModules(localModules.filter(m => m.id !== episodeId));
        
        // If we deleted the current episode, select the first available episode
        const remainingModules = localModules.filter(m => m.id !== episodeId);
        if (remainingModules.length > 0 && currentEpisodeIndex >= remainingModules.length) {
          setCurrentEpisodeIndex(0);
        }
      } else {
        const errorData = await response.text();
        console.error('Failed to delete episode:', response.status, errorData);
        alert('Failed to delete episode. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting episode:', error);
      alert('Failed to delete episode. Please try again.');
    }
  };

  const currentModules = isWeeklyCheckins ? filteredModules : localModules;
  const originalCurrentEpisode = currentModules[currentEpisodeIndex];
  
  // Get any changes for this specific module and merge with original data
  const currentCourseChanges = getChangesForCourse(course.id);
  const moduleChanges = currentCourseChanges?.modules?.[originalCurrentEpisode?.id] || {};
  const currentEpisode = originalCurrentEpisode ? {
    ...originalCurrentEpisode,
    ...moduleChanges
  } : null;
  
  // Debug logging
  console.log('CourseContent Debug:');
  console.log('originalCurrentEpisode full object:', JSON.stringify(originalCurrentEpisode, null, 2));
  console.log('moduleChanges:', moduleChanges);
  console.log('currentEpisode:', currentEpisode);
  console.log('currentEpisode.videoUrl:', currentEpisode?.videoUrl);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8 rounded-xl border border-gray-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
          <EditableField
            value={displayCourse.title}
            onChange={(value) => updateCourseField(course.id, 'title', value)}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
            placeholder="Course Title"
          />
        </h1>
        <EditableField
          value={displayCourse.description}
          onChange={(value) => updateCourseField(course.id, 'description', value)}
          className="text-gray-300 mb-4 sm:mb-6 block text-sm sm:text-base"
          multiline={true}
          placeholder="Course description..."
          as="div"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
          {courseType !== 'yearly' && (
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              {course.modules.length} episodes
            </span>
          )}
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <EditableField
              value={course.level}
              onChange={(value) => updateCourseField(course.id, 'level', value)}
              className="text-gray-400"
              placeholder="Level"
            />
          </span>
          <span className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            {course.progress}% Complete
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          {(() => {
            const displayEpisode = courseType === 'yearly' ? course.modules[0] : currentEpisode;
            return displayEpisode ? (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  <EditableField
                    value={courseType === 'yearly' ? course.title : displayEpisode.title}
                    onChange={(value) => courseType === 'yearly' 
                      ? updateCourseField(course.id, 'title', value)
                      : updateModuleField(course.id, displayEpisode.id, 'title', value)
                    }
                    className="text-lg sm:text-xl font-bold text-white"
                    placeholder={courseType === 'yearly' ? "Course Title" : "Episode Title"}
                  />
                </h2>
              {/* Smart Video Player - handles different video types */}
              {(() => {
                const videoUrl = displayEpisode.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";
                const isYouTube = videoUrl.includes('youtube.com/embed') || videoUrl.includes('youtu.be');
                const isVimeo = videoUrl.includes('player.vimeo.com') || videoUrl.includes('vimeo.com');
                const isEmbed = isYouTube || isVimeo;

                if (isEmbed) {
                  return (
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        src={videoUrl}
                        title="Video Player"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => {
                          // For embedded videos, we can't detect completion easily
                          // You might want to add a manual "Mark as Complete" button
                        }}
                      />
                      {/* Manual completion button for embedded videos - only for non-yearly courses */}
                      {courseType !== 'yearly' && (
                        <button
                          onClick={() => handleVideoComplete(displayEpisode.id)}
                          className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <VideoPlayerPro 
                      src={videoUrl}
                      onVideoComplete={courseType !== 'yearly' ? () => handleVideoComplete(displayEpisode.id) : undefined}
                    />
                  );
                }
              })()}
              
              {/* Admin Video Upload Section */}
              {isAdmin && isEditMode && (
                <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white">Video Management</h3>
                    {!showVideoUpload && (
                      <Button
                        onClick={() => setShowVideoUpload(true)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Video
                      </Button>
                    )}
                  </div>
                  
                  {showVideoUpload && (
                    <div className="space-y-4">
                      {/* Upload Type Selection */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setUploadType('url')}
                          variant={uploadType === 'url' ? 'default' : 'outline'}
                          size="sm"
                          className={uploadType === 'url' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                        >
                          <Link className="h-4 w-4 mr-1" />
                          URL
                        </Button>
                        <Button
                          onClick={() => setUploadType('file')}
                          variant={uploadType === 'file' ? 'default' : 'outline'}
                          size="sm"
                          className={uploadType === 'file' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          File
                        </Button>
                        <Button
                          onClick={() => {
                            setShowVideoUpload(false);
                            setVideoUrl('');
                          }}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 ml-auto"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {uploadType === 'url' && (
                        <div className="space-y-2">
                          <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="Enter video URL (YouTube, Vimeo, or direct video file link)"
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                          />
                          <Button
                            onClick={handleVideoUrlSubmit}
                            disabled={!videoUrl.trim() || isUploading}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isUploading ? 'Saving...' : 'Save URL'}
                          </Button>
                        </div>
                      )}
                      
                      {uploadType === 'file' && (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                          />
                          <p className="text-xs text-gray-400">
                            Supported formats: MP4, WebM, OGG (max 100MB)
                          </p>
                          {isUploading && (
                            <div className="flex items-center gap-2 text-sm text-blue-400">
                              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                              Uploading video...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {displayEpisode.videoUrl && (
                    <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-400">
                      Current: {displayEpisode.videoUrl.length > 50 
                        ? displayEpisode.videoUrl.substring(0, 50) + '...' 
                        : displayEpisode.videoUrl}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Fallback for when there are no modules
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">No Content Available</h2>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                This course doesn't have any content yet. Please contact the administrator to add course materials.
              </p>
              {isAdmin && isEditMode && (
                <p className="text-blue-400 text-sm">
                  As an admin, you can add modules to this course from the dashboard.
                </p>
              )}
            </div>
          );
          })()}
        </div>
        
        <div className="space-y-4">
          {courseType !== 'yearly' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Course Episodes</h3>
              {courseType === 'monthly' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 rounded transition-colors group"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                  </button>
                  <span className="text-xs sm:text-sm font-medium text-gray-300 min-w-[100px] sm:min-w-[120px] text-center">
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
                <span className="text-xs sm:text-sm text-gray-400">
                  {localModules.filter(m => m.completed).length} of {localModules.length} completed
                </span>
              )}
            </div>
          )}
            
            {(() => {
              // For yearly courses, show only the first module; for others, show current modules
              const modulesToShow = courseType === 'yearly' ? [course.modules[0]].filter(Boolean) : currentModules;
              
              return modulesToShow.map((episode, index) => {
                const isCurrentEpisode = courseType === 'yearly' ? true : index === currentEpisodeIndex;
                const displayIndex = courseType === 'yearly' ? 1 : index + 1;
                
                return (
                  <div 
                    key={episode.id} 
                    onClick={() => courseType !== 'yearly' && handleEpisodeSelect(index, episode)}
                    className={`p-3 sm:p-4 rounded-xl border transition-colors group ${
                      courseType === 'yearly' 
                        ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/50'
                        : isCurrentEpisode
                          ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/50'
                          : episode.completed 
                            ? 'bg-green-900/20 border-green-700' 
                            : 'bg-gray-900 border-gray-700 hover:border-blue-500'
                    } ${courseType !== 'yearly' ? 'cursor-pointer' : ''}`}
                  >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 text-gray-300 text-xs sm:text-sm font-medium">
                      {displayIndex}
                    </div>
                  
                  {episode.completed ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                  )}
                  
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      <EditableField
                        value={episode.title}
                        onChange={(value) => updateModuleField(course.id, episode.id, 'title', value)}
                        className="text-sm sm:text-base font-semibold text-white"
                        placeholder="Episode Title"
                      />
                    </h4>
                  </div>
                  
                  {episode.completed && (
                    <div className="text-xs text-green-400 font-medium">Completed</div>
                  )}
                  {(isCurrentEpisode || courseType === 'yearly') && !episode.completed && (
                    <div className="text-xs text-blue-400 font-medium">Now Playing</div>
                  )}
                  
                  {/* Admin delete button */}
                  {isAdmin && isEditMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEpisode(episode.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity ml-2"
                      title="Delete Episode"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              );
            });
          })()}
          
          {/* Admin Add Episode button */}
          {isAdmin && isEditMode && (
            <button
              onClick={handleAddEpisode}
              className="flex h-10 w-full items-center rounded-xl border border-dashed border-gray-600 text-gray-500 hover:border-blue-500 hover:text-blue-400 transition-all duration-200 p-3 sm:p-4"
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 text-gray-300 text-xs sm:text-sm font-medium mr-2 sm:mr-3">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">
                Add Episode
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};