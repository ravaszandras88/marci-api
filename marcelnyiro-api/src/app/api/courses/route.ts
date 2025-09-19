import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

// Admin verification helper
const isAdmin = (email: string): boolean => {
  return email === 'business@marcelnyiro.com';
};

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

    // Check if user is admin to determine if we should show draft courses
    let isUserAdmin = false;
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('Token present:', token ? 'Yes' : 'No');
      const decoded = verifyJWT(token);
      console.log('Decoded token:', decoded);
      if (decoded && decoded.email === 'business@marcelnyiro.com') {
        isUserAdmin = true;
        console.log('User identified as admin');
      } else {
        console.log('User not admin. Email:', decoded?.email);
      }
    }
    console.log('isUserAdmin:', isUserAdmin);

    // Fetch courses from database - filter by status based on admin status
    const coursesQuery = isUserAdmin 
      ? `SELECT id, title, description, duration, thumbnail, category, level, status, course_type 
         FROM courses 
         ORDER BY id`
      : `SELECT id, title, description, duration, thumbnail, category, level, status, course_type 
         FROM courses 
         WHERE status = 'active'
         ORDER BY id`;
    
    const coursesResult = await query(coursesQuery);

    // For each course, fetch modules and user progress
    const courses = await Promise.all(coursesResult.map(async (course) => {
      // Fetch modules for this course
      const modulesResult = await query(
        `SELECT id, title, duration, video_count as videos, order_index, episode_date, episode_time, video_url 
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
          episode_time: module.episode_time,
          videoUrl: module.video_url || null
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
        courseId = `weekly-checkins-${course.level.toLowerCase()}-${course.id}`;
      } else {
        // For other courses, append database ID to ensure uniqueness
        courseId = `${courseId}-${course.id}`;
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
        status: course.status,
        courseType: course.course_type,
        modules: modules
      };
    }));


    return NextResponse.json(courses);
  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!isAdmin(decoded.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const courseData = await request.json();

    // Insert new course into database with draft status by default
    const courseResult = await query(
      `INSERT INTO courses (title, description, duration, thumbnail, category, level, status, course_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [
        courseData.title,
        courseData.description,
        courseData.duration,
        courseData.thumbnail,
        courseData.category,
        courseData.level,
        'draft',
        courseData.courseType || 'normal'
      ]
    );

    const newCourseId = courseResult[0].id;

    // Insert initial modules if provided
    if (courseData.modules && courseData.modules.length > 0) {
      for (let i = 0; i < courseData.modules.length; i++) {
        const module = courseData.modules[i];
        await query(
          `INSERT INTO course_modules (course_id, title, duration, video_count, order_index, episode_date, episode_time) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            newCourseId,
            module.title,
            module.duration,
            module.videos || 1,
            i + 1,
            module.episode_date || null,
            module.episode_time || null
          ]
        );
      }
    }

    return NextResponse.json({
      message: 'Course created successfully',
      courseId: courseData.id,
      databaseId: newCourseId
    }, { status: 201 });

  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}