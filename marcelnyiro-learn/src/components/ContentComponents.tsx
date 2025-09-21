"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Award,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableField } from "@/components/EditableField";
import { useCourseChanges } from "@/contexts/CourseChangesContext";

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
  }>;
}

// Courses Overview Content
export const CoursesOverviewContent: React.FC<{
  courses: Course[];
  setSelected: (selected: string) => void;
}> = ({ courses, setSelected }) => {
  const { updateCourseField } = useCourseChanges();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          <EditableField
            value="All Courses"
            onChange={() => {}} // Static for now, can be made dynamic later
            className="text-2xl font-bold text-white"
            placeholder="Page Title"
          />
        </h2>
        <p className="text-gray-400 mb-8">
          <EditableField
            value="Master AI entrepreneurship with Marcel's comprehensive course collection"
            onChange={() => {}} // Static for now, can be made dynamic later
            className="text-gray-400"
            placeholder="Page description"
          />
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">
                <EditableField
                  value={course.thumbnail}
                  onChange={(value) => updateCourseField(course.id, 'thumbnail', value)}
                  placeholder="📚"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  <EditableField
                    value={course.title}
                    onChange={(value) => updateCourseField(course.id, 'title', value)}
                    className="text-lg font-bold text-white"
                    placeholder="Course Title"
                  />
                </h3>
                <p className="text-sm text-gray-400">
                  <EditableField
                    value={course.level}
                    onChange={(value) => updateCourseField(course.id, 'level', value)}
                    className="text-sm text-gray-400"
                    placeholder="Level"
                  />
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              <EditableField
                value={course.description}
                onChange={(value) => updateCourseField(course.id, 'description', value)}
                className="text-gray-400 text-sm"
                multiline={true}
                placeholder="Course description..."
              />
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <EditableField
                  value={course.lessons.toString()}
                  onChange={(value) => updateCourseField(course.id, 'lessons', parseInt(value) || 0)}
                  className="text-gray-400"
                  placeholder="0"
                /> episodes
              </span>
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
  );
};

// Progress Content
export const ProgressContent: React.FC<{
  courses: Course[];
  setSelected: (selected: string) => void;
}> = ({ courses, setSelected }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        <EditableField
          value="My Progress"
          onChange={() => {}} // Static for now
          className="text-2xl font-bold text-white"
          placeholder="Page Title"
        />
      </h2>
      <p className="text-gray-400 mb-8">
        <EditableField
          value="Track your learning journey and achievements"
          onChange={() => {}} // Static for now
          className="text-gray-400"
          placeholder="Page description"
        />
      </p>
    </div>

    {/* Overall Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-900/20 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        <h3 className="font-medium text-gray-400 mb-1">
          <EditableField
            value="Completed Courses"
            onChange={() => {}} // Static label
            className="font-medium text-gray-400"
            placeholder="Stat Label"
          />
        </h3>
        <p className="text-2xl font-bold text-white">{courses.filter(c => c.progress === 100).length}</p>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
        </div>
        <h3 className="font-medium text-gray-400 mb-1">
          <EditableField
            value="Episodes Completed"
            onChange={() => {}} // Static label
            className="font-medium text-gray-400"
            placeholder="Stat Label"
          />
        </h3>
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
        <h3 className="font-medium text-gray-400 mb-1">
          <EditableField
            value="Avg Progress"
            onChange={() => {}} // Static label
            className="font-medium text-gray-400"
            placeholder="Stat Label"
          />
        </h3>
        <p className="text-2xl font-bold text-white">{Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%</p>
      </div>

    </div>

    {/* Course Progress Details */}
    <div>
      <h3 className="text-xl font-bold text-white mb-6">
        <EditableField
          value="Course Progress"
          onChange={() => {}} // Static section title
          className="text-xl font-bold text-white"
          placeholder="Section Title"
        />
      </h3>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-xl">{course.thumbnail}</div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                  <p className="text-sm text-gray-400">{course.modules.length} 
                    <EditableField
                      value=" episodes"
                      onChange={() => {}} // Static label suffix
                      className="text-sm text-gray-400"
                      placeholder="Unit"
                    />
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{course.progress}%</p>
                <p className="text-sm text-gray-400">
                  <EditableField
                    value="Complete"
                    onChange={() => {}} // Static label
                    className="text-sm text-gray-400"
                    placeholder="Status Label"
                  />
                </p>
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
                {course.modules.filter(m => m.completed).length} of {course.modules.length} 
                <EditableField
                  value=" episodes completed"
                  onChange={() => {}} // Static text
                  className="text-gray-400"
                  placeholder="Progress text"
                />
              </span>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setSelected(course.id)}
              >
                <EditableField
                  value="Continue"
                  onChange={() => {}} // Static button text
                  className="text-white"
                  placeholder="Button Text"
                />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Billing Content
export const BillingContent: React.FC<{ user: UserData }> = ({ user }) => {
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

  // Fetch subscription status on component mount
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(
          process.env.NODE_ENV === 'production' 
            ? 'https://api.marcelnyiro.com/api/subscription/status'
            : 'http://localhost:3002/api/subscription/status',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSubscriptionInfo(data.subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        process.env.NODE_ENV === 'production' 
          ? 'https://api.marcelnyiro.com/api/subscription/cancel'
          : 'http://localhost:3002/api/subscription/cancel',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Subscription cancelled successfully. You will continue to have access until the end of your current billing period.');
        setShowCancelConfirm(false);
        
        // Refresh subscription info
        const statusResponse = await fetch(
          process.env.NODE_ENV === 'production' 
            ? 'https://api.marcelnyiro.com/api/subscription/status'
            : 'http://localhost:3002/api/subscription/status',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setSubscriptionInfo(statusData.subscription);
        }
      } else {
        setError(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        <EditableField
          value="Billing & Subscription"
          onChange={() => {}} // Static for now
          className="text-2xl font-bold text-white"
          placeholder="Page Title"
        />
      </h2>
      <p className="text-gray-400 mb-8">
        <EditableField
          value="Manage your subscription and billing information"
          onChange={() => {}} // Static for now
          className="text-gray-400"
          placeholder="Page description"
        />
      </p>
    </div>

    {/* Membership Status */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          <EditableField
            value="Membership Status"
            onChange={() => {}} // Static section title
            className="text-lg font-bold text-white"
            placeholder="Section Title"
          />
        </h3>
        <span className={`px-3 py-1 text-white text-sm rounded-full ${
          subscriptionInfo?.status === 'cancelled' ? 'bg-orange-600' : 'bg-green-600'
        }`}>
          <EditableField
            value={subscriptionInfo?.status === 'cancelled' ? 'Cancelled' : 'Active'}
            onChange={() => {}} // Static status
            className="text-white text-sm"
            placeholder="Status"
          />
        </span>
      </div>
      <p className="text-gray-400 mb-4">
        <EditableField
          value={subscriptionInfo?.status === 'cancelled' 
            ? `Access until ${subscriptionInfo?.endDate ? new Date(subscriptionInfo.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'end of billing period'}`
            : "Full access to all courses and content"
          }
          onChange={() => {}} // Static description
          className="text-gray-400"
          placeholder="Description"
        />
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>
          <EditableField
            value="Member since: "
            onChange={() => {}} // Static label
            className="text-gray-400"
            placeholder="Label"
          />
          {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently joined'}
        </span>
        {subscriptionInfo?.endDate && (
          <span>
            • Subscription ends: {new Date(subscriptionInfo.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>
    </div>

    {/* Payment Method */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        <EditableField
          value="Payment Method"
          onChange={() => {}} // Static section title
          className="text-lg font-bold text-white"
          placeholder="Section Title"
        />
      </h3>
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
        <CreditCard className="h-8 w-8 text-blue-400" />
        <div>
          <p className="text-white font-medium">•••• •••• •••• 4242</p>
          <p className="text-gray-400 text-sm">Expires 12/27</p>
        </div>
      </div>
    </div>

    {/* Subscription Management */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        <EditableField
          value="Subscription Management"
          onChange={() => {}} // Static section title
          className="text-lg font-bold text-white"
          placeholder="Section Title"
        />
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Pro Plan</h4>
            <p className="text-gray-400 text-sm">4,000 HUF per month</p>
            <p className="text-gray-400 text-xs">Full access to all courses and content</p>
          </div>
          <div className="text-right">
            {subscriptionInfo?.status === 'cancelled' ? (
              <div className="text-orange-400 text-sm">
                <p>Subscription cancelled</p>
                <p className="text-xs text-gray-500">Access until {subscriptionInfo?.endDate ? new Date(subscriptionInfo.endDate).toLocaleDateString() : 'end of period'}</p>
              </div>
            ) : !showCancelConfirm ? (
              <Button 
                onClick={() => setShowCancelConfirm(true)}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600/10"
              >
                Cancel Subscription
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-red-400 text-sm mb-2">Are you sure?</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCancelSubscription}
                    disabled={cancelLoading}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
                  </Button>
                  <Button 
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={cancelLoading}
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Keep Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>• Cancelling your subscription will stop future billing</p>
          <p>• You'll keep access until the end of your current billing period</p>
          <p>• You can resubscribe at any time</p>
        </div>
      </div>
    </div>
  </div>
  );
};

// Settings Content
export const SettingsContent: React.FC<{ 
  user: UserData; 
  onUserUpdate?: (updatedUser: UserData) => void; 
}> = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    emailNotifications: false
  });

  // Update form data when user changes
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email
    });
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        process.env.NODE_ENV === 'production' 
          ? 'https://api.marcelnyiro.com/api/auth/update'
          : 'http://localhost:3002/api/auth/update',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        if (onUserUpdate) {
          onUserUpdate(data.user);
        }
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Notification toggle handlers
  const handleNotificationToggle = async (type: 'courseUpdates' | 'emailNotifications') => {
    const newValue = !notifications[type];
    
    // Update local state immediately for responsive UI
    setNotifications(prev => ({
      ...prev,
      [type]: newValue
    }));

    // TODO: Implement API call to save notification preferences to database
    // TODO: Add user_notifications table with columns: user_id, course_updates, email_notifications
    // TODO: Create PUT /api/auth/notifications endpoint
    
    try {
      // API call would go here
      console.log(`Updated ${type} to ${newValue} for user ${user.id}`);
      
      // TODO: If courseUpdates is enabled and course content is updated, send email notification
      // TODO: If emailNotifications is enabled, send welcome email and periodic updates
      // TODO: Implement email service using nodemailer or similar
      // TODO: Create email templates for course updates and general notifications
      
    } catch (error) {
      // Revert state on error
      setNotifications(prev => ({
        ...prev,
        [type]: !newValue
      }));
      console.error('Failed to update notification setting:', error);
    }
  };

  return (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        <EditableField
          value="Settings"
          onChange={() => {}} // Static for now
          className="text-2xl font-bold text-white"
          placeholder="Page Title"
        />
      </h2>
      <p className="text-gray-400 mb-8">
        <EditableField
          value="Manage your account preferences"
          onChange={() => {}} // Static for now
          className="text-gray-400"
          placeholder="Page description"
        />
      </p>
    </div>

    {/* Profile Settings */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          <EditableField
            value="Profile Information"
            onChange={() => {}} // Static section title
            className="text-lg font-bold text-white"
            placeholder="Section Title"
          />
        </h3>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              onClick={handleCancel}
              disabled={isLoading}
              variant="outline" 
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            <EditableField
              value="Name"
              onChange={() => {}} // Static label
              className="text-sm font-medium text-gray-400"
              placeholder="Field Label"
            />
          </label>
          <input 
            type="text" 
            value={isEditing ? formData.name : user.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg text-white transition-colors ${
              isEditing 
                ? 'bg-gray-800 border-gray-600 focus:border-blue-500 focus:outline-none' 
                : 'bg-gray-800 border-gray-700'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            <EditableField
              value="Email"
              onChange={() => {}} // Static label
              className="text-sm font-medium text-gray-400"
              placeholder="Field Label"
            />
          </label>
          <input 
            type="email" 
            value={isEditing ? formData.email : user.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg text-white transition-colors ${
              isEditing 
                ? 'bg-gray-800 border-gray-600 focus:border-blue-500 focus:outline-none' 
                : 'bg-gray-800 border-gray-700'
            }`}
          />
        </div>
      </div>
    </div>

    {/* Notifications */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        <EditableField
          value="Notifications"
          onChange={() => {}} // Static section title
          className="text-lg font-bold text-white"
          placeholder="Section Title"
        />
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white">
            <EditableField
              value="Course Updates"
              onChange={() => {}} // Static setting label
              className="text-white"
              placeholder="Setting Label"
            />
          </span>
          <button 
            onClick={() => handleNotificationToggle('courseUpdates')}
            className={`w-12 h-6 rounded-full relative transition-colors ${
              notifications.courseUpdates ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <div 
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                notifications.courseUpdates ? 'right-0.5' : 'left-0.5'
              }`}
            ></div>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white">
            <EditableField
              value="Email Notifications"
              onChange={() => {}} // Static setting label
              className="text-white"
              placeholder="Setting Label"
            />
          </span>
          <button 
            onClick={() => handleNotificationToggle('emailNotifications')}
            className={`w-12 h-6 rounded-full relative transition-colors ${
              notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <div 
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                notifications.emailNotifications ? 'right-0.5' : 'left-0.5'
              }`}
            ></div>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};