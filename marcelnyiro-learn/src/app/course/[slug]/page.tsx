"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import VideoPlayerPro from "@/components/ui/video-player-pro";
import { ArrowLeft, Clock, Users, Star, CheckCircle, Lock, Play } from "lucide-react";
import { motion } from "framer-motion";

interface Module {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  modules: Module[];
  image: string;
}

const courses: { [key: string]: Course } = {
  "ai-entrepreneurship": {
    id: "ai-entrepreneurship",
    title: "AI-Driven Entrepreneurship",
    description: "Learn how to build and scale AI-powered startups from my experience founding Outfino and securing 73M HUF investment.",
    instructor: "Marcel Nyirő",
    duration: "4 hours",
    students: 156,
    rating: 4.9,
    image: "/api/placeholder/600/300",
    modules: [
      {
        id: "intro",
        title: "Introduction to AI Entrepreneurship",
        duration: "15 min",
        videoUrl: "/videos/intro-ai-entrepreneurship.mp4",
        content: "Understanding the AI landscape and identifying opportunities in the market.",
        isCompleted: false,
        isLocked: false
      },
      {
        id: "market-research",
        title: "AI Market Research & Validation",
        duration: "25 min",
        videoUrl: "/videos/market-research.mp4", 
        content: "How we identified Gen Z fashion pain points and validated Outfino's concept.",
        isCompleted: false,
        isLocked: false
      },
      {
        id: "building-mvp",
        title: "Building Your AI MVP",
        duration: "35 min",
        videoUrl: "/videos/building-mvp.mp4",
        content: "Technical decisions, team building, and rapid prototyping strategies.",
        isCompleted: false,
        isLocked: true
      },
      {
        id: "fundraising",
        title: "Fundraising & Investment Strategy",
        duration: "40 min",
        videoUrl: "/videos/fundraising.mp4",
        content: "How we secured 73M HUF from OUVC and lessons learned from the process.",
        isCompleted: false,
        isLocked: true
      }
    ]
  },
  "outfino-case-study": {
    id: "outfino-case-study",
    title: "Outfino Case Study: From Idea to 73M HUF",
    description: "Deep dive into the complete Outfino journey - the first Hungarian university-backed VC investment.",
    instructor: "Marcel Nyirő",
    duration: "3 hours",
    students: 89,
    rating: 5.0,
    image: "/api/placeholder/600/300",
    modules: [
      {
        id: "genesis",
        title: "The Genesis of Outfino",
        duration: "20 min",
        videoUrl: "/videos/outfino-genesis.mp4",
        content: "How the idea was born and early validation steps.",
        isCompleted: false,
        isLocked: false
      },
      {
        id: "tech-stack",
        title: "Building the AI Fashion Platform",
        duration: "30 min",
        videoUrl: "/videos/tech-stack.mp4",
        content: "Technical architecture, AI implementation, and platform development.",
        isCompleted: false,
        isLocked: false
      },
      {
        id: "ouvc-pitch",
        title: "The OUVC Pitch & Investment Process",
        duration: "25 min",
        videoUrl: "/videos/ouvc-pitch.mp4",
        content: "Inside the pitch that secured Hungary's first university VC investment.",
        isCompleted: false,
        isLocked: true
      }
    ]
  },
  "startup-scaling": {
    id: "startup-scaling",
    title: "Startup Scaling Strategies",
    description: "From 300 to 5000 users: Growth strategies, B2B partnerships, and international expansion.",
    instructor: "Marcel Nyirő",
    duration: "2.5 hours",
    students: 203,
    rating: 4.8,
    image: "/api/placeholder/600/300",
    modules: [
      {
        id: "user-growth",
        title: "User Acquisition & Growth",
        duration: "30 min",
        videoUrl: "/videos/user-growth.mp4",
        content: "How we grew from 300 to targeting 5000 users.",
        isCompleted: false,
        isLocked: false
      },
      {
        id: "b2b-partnerships",
        title: "Building B2B Partnerships",
        duration: "25 min",
        videoUrl: "/videos/b2b-partnerships.mp4",
        content: "Strategies for fashion brand partnerships and revenue diversification.",
        isCompleted: false,
        isLocked: true
      }
    ]
  }
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/');
    }

    if (params.slug && courses[params.slug as string]) {
      const selectedCourse = courses[params.slug as string];
      setCourse(selectedCourse);
      setCurrentModule(selectedCourse.modules[0]);
    }
  }, [params.slug, router]);

  if (!course || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-900 min-h-screen p-6 border-r border-gray-800">
          <Button 
            onClick={() => router.push('/')}
            variant="ghost" 
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-white mb-2">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.students}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {course.rating}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Course Modules</h3>
            {course.modules.map((module, index) => (
              <motion.div
                key={module.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  currentModule?.id === module.id 
                    ? 'bg-blue-600 text-white' 
                    : module.isLocked
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => !module.isLocked && setCurrentModule(module)}
                whileHover={!module.isLocked ? { scale: 1.02 } : {}}
                whileTap={!module.isLocked ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {index + 1}. {module.title}
                  </span>
                  {module.isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : module.isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>
                <div className="text-xs text-gray-400">{module.duration}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentModule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{currentModule.title}</h2>
                <p className="text-gray-400">{currentModule.content}</p>
              </div>

              {currentModule.videoUrl ? (
                <div className="mb-8">
                  <VideoPlayerPro src={currentModule.videoUrl} />
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-12 text-center mb-8">
                  <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Video content coming soon</p>
                </div>
              )}

              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Module Content</h3>
                <div className="space-y-4 text-gray-300">
                  <p>{currentModule.content}</p>
                  
                  {currentModule.id === "intro" && (
                    <div className="space-y-3">
                      <p>In this introductory module, you'll learn:</p>
                      <ul className="list-disc list-inside space-y-2 text-gray-400">
                        <li>Current AI market trends and opportunities</li>
                        <li>How to identify problems that AI can solve</li>
                        <li>Building the right mindset for AI entrepreneurship</li>
                        <li>My journey from student to funded AI founder</li>
                      </ul>
                    </div>
                  )}

                  {currentModule.id === "market-research" && (
                    <div className="space-y-3">
                      <p>Key topics covered:</p>
                      <ul className="list-disc list-inside space-y-2 text-gray-400">
                        <li>Understanding Gen Z fashion pain points</li>
                        <li>Validation techniques for AI products</li>
                        <li>Market research methodologies</li>
                        <li>How we reached our first 300 users</li>
                      </ul>
                    </div>
                  )}

                  {currentModule.id === "genesis" && (
                    <div className="space-y-3">
                      <p>The complete Outfino origin story:</p>
                      <ul className="list-disc list-inside space-y-2 text-gray-400">
                        <li>The "eureka" moment that sparked Outfino</li>
                        <li>Early market validation and user interviews</li>
                        <li>Building the founding team</li>
                        <li>First prototype and user feedback</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const currentIndex = course.modules.findIndex(m => m.id === currentModule.id);
                    if (currentIndex > 0) {
                      setCurrentModule(course.modules[currentIndex - 1]);
                    }
                  }}
                  disabled={course.modules.findIndex(m => m.id === currentModule.id) === 0}
                >
                  Previous Module
                </Button>
                <Button 
                  onClick={() => {
                    const currentIndex = course.modules.findIndex(m => m.id === currentModule.id);
                    if (currentIndex < course.modules.length - 1) {
                      const nextModule = course.modules[currentIndex + 1];
                      if (!nextModule.isLocked) {
                        setCurrentModule(nextModule);
                      }
                    }
                  }}
                  disabled={
                    course.modules.findIndex(m => m.id === currentModule.id) === course.modules.length - 1 ||
                    course.modules[course.modules.findIndex(m => m.id === currentModule.id) + 1]?.isLocked
                  }
                >
                  Next Module
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}