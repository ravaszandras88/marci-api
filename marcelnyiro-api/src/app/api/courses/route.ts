import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header to identify the user
    const authHeader = request.headers.get('authorization');
    let userId: number | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Get user from token
      const userResult = await query(
        `SELECT user_id FROM user_sessions 
         WHERE token = $1 AND expires_at > NOW()`,
        [token]
      );
      
      if (userResult.length > 0) {
        userId = userResult[0].user_id;
      }
    }

    // Fetch courses from database
    const coursesResult = await query(
      `SELECT id, title, description, duration, thumbnail, category, level 
       FROM courses 
       ORDER BY id`
    );

    // For each course, fetch modules and user progress
    const courses = await Promise.all(coursesResult.map(async (course) => {
      // Fetch modules for this course
      const modulesResult = await query(
        `SELECT id, title, duration, video_count as videos, order_index, episode_date, episode_time 
         FROM course_modules 
         WHERE course_id = $1 
         ORDER BY order_index`,
        [course.id]
      );

      // Fetch user progress if user is logged in
      let progress = 0;
      let userModuleProgress = [];
      
      if (userId) {
        const progressResult = await query(
          `SELECT progress FROM user_progress 
           WHERE user_id = $1 AND course_id = $2`,
          [userId, course.id]
        );
        
        if (progressResult.length > 0) {
          progress = progressResult[0].progress;
        }

        // Get module completion status
        userModuleProgress = await query(
          `SELECT module_id, completed 
           FROM user_module_progress 
           WHERE user_id = $1 AND module_id = ANY($2::int[])`,
          [userId, modulesResult.map(m => m.id)]
        );
      }

      // Map modules with completion status
      const modules = modulesResult.map((module, index) => {
        const moduleProgress = userModuleProgress.find(p => p.module_id === module.id);
        const completed = moduleProgress ? moduleProgress.completed : false;
        const locked = index > 0 && !modulesResult.slice(0, index).every((m, i) => {
          const mp = userModuleProgress.find(p => p.module_id === m.id);
          return mp && mp.completed;
        });

        return {
          id: module.id,
          title: module.title,
          videos: module.videos,
          duration: module.duration,
          completed: completed,
          locked: locked,
          episode_date: module.episode_date,
          episode_time: module.episode_time
        };
      });

      // Calculate total lessons (sum of all videos in modules)
      const lessons = modules.reduce((sum, m) => sum + m.videos, 0);

      // Generate course ID string
      let courseId = course.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      // Special handling for Weekly Check-ins courses
      if (course.category === 'weekly-checkins') {
        courseId = `weekly-checkins-${course.level.toLowerCase()}`;
      }

      return {
        id: courseId,
        title: course.title,
        description: course.description,
        progress: progress,
        duration: course.duration,
        lessons: lessons,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        modules: modules
      };
    }));

    // Fallback to static data if database is empty
    if (courses.length === 0) {
      const staticCourses = [
      {
        id: "ai-entrepreneurship",
        title: "AI Entrepreneurship Masterclass",
        description: "Learn how to build and scale AI-powered businesses from ideation to 73M HUF funding like Outfino.",
        progress: 65,
        duration: "8 hours",
        lessons: 24,
        thumbnail: "🤖",
        category: "entrepreneurship",
        level: "Intermediate",
        modules: [
          { id: 1, title: "AI Business Model Validation", videos: 4, duration: "90 min", completed: true, locked: false },
          { id: 2, title: "Building AI-Powered MVPs", videos: 5, duration: "120 min", completed: true, locked: false },
          { id: 3, title: "Fashion Tech & Industry Applications", videos: 4, duration: "100 min", completed: false, locked: false },
          { id: 4, title: "Securing VC Investment (OUVC Case Study)", videos: 4, duration: "110 min", completed: false, locked: false },
          { id: 5, title: "Scaling AI Products to 5K Users", videos: 4, duration: "95 min", completed: false, locked: true },
          { id: 6, title: "Exit Strategies for AI Startups", videos: 4, duration: "85 min", completed: false, locked: true }
        ]
      },
      {
        id: "outfino-case-study",
        title: "Building Outfino: From Idea to 73M HUF",
        description: "Behind-the-scenes journey of building an AI fashion platform that secured Hungary's first university VC investment.",
        progress: 30,
        duration: "6 hours",
        lessons: 16,
        thumbnail: "👗",
        category: "case-study",
        level: "Advanced",
        modules: [
          { id: 1, title: "Pre-investment Preparation", videos: 4, duration: "75 min", completed: false, locked: false },
          { id: 2, title: "STRT Incubation Process", videos: 4, duration: "80 min", completed: false, locked: false },
          { id: 3, title: "OUVC Pitch & Negotiation", videos: 4, duration: "90 min", completed: false, locked: false },
          { id: 4, title: "Scaling to 300+ Users & Beyond", videos: 4, duration: "85 min", completed: false, locked: false }
        ]
      },
      {
        id: "startup-scaling",
        title: "Startup Scaling Strategies",
        description: "Proven methods for growing from MVP to market leader, featuring Central-Eastern Europe expansion tactics.",
        progress: 0,
        duration: "5 hours",
        lessons: 15,
        thumbnail: "📈",
        category: "business",
        level: "Intermediate", 
        modules: [
          { id: 1, title: "Growth Hacking for Startups", videos: 3, duration: "60 min", completed: false, locked: false },
          { id: 2, title: "B2B Partnership Strategies", videos: 4, duration: "80 min", completed: false, locked: true },
          { id: 3, title: "Geographic Expansion Planning", videos: 4, duration: "75 min", completed: false, locked: true },
          { id: 4, title: "Team Building & Culture", videos: 4, duration: "70 min", completed: false, locked: true }
        ]
      }
      ];
      return NextResponse.json(staticCourses);
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}