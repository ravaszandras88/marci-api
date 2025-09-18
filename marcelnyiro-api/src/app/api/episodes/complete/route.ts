import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { courseId, episodeId } = await request.json();
    
    if (!courseId || !episodeId) {
      return NextResponse.json(
        { error: 'Course ID and Episode ID are required' },
        { status: 400 }
      );
    }
    
    // Get the actual course ID from the database
    let dbCourseId: number;
    
    // Handle the string courseId to database ID mapping
    if (courseId.startsWith('weekly-checkins-')) {
      const year = courseId.split('-')[2];
      const courseResult = await query(
        `SELECT id FROM courses WHERE title = $1`,
        [`Weekly Check-ins ${year}`]
      );
      if (courseResult.length === 0) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      dbCourseId = courseResult[0].id;
    } else {
      // For other courses, try to find by title pattern
      const courseResult = await query(
        `SELECT id FROM courses WHERE LOWER(REPLACE(title, ' ', '-')) LIKE $1`,
        [`%${courseId}%`]
      );
      if (courseResult.length === 0) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      dbCourseId = courseResult[0].id;
    }
    
    // Mark the module as completed for this user
    await query(
      `INSERT INTO user_module_progress (user_id, module_id, completed, completed_at)
       VALUES ($1, $2, true, NOW())
       ON CONFLICT (user_id, module_id) 
       DO UPDATE SET completed = true, completed_at = NOW()`,
      [decoded.id, episodeId]
    );
    
    // Get total modules for the course
    const totalModulesResult = await query(
      `SELECT COUNT(*) as total FROM course_modules WHERE course_id = $1`,
      [dbCourseId]
    );
    const totalModules = parseInt(totalModulesResult[0].total);
    
    // Get completed modules for this user in this course
    const completedModulesResult = await query(
      `SELECT COUNT(*) as completed 
       FROM user_module_progress ump
       JOIN course_modules cm ON ump.module_id = cm.id
       WHERE ump.user_id = $1 AND cm.course_id = $2 AND ump.completed = true`,
      [decoded.id, dbCourseId]
    );
    const completedModules = parseInt(completedModulesResult[0].completed);
    
    // Calculate progress percentage
    const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Update or insert user progress
    await query(
      `INSERT INTO user_progress (user_id, course_id, progress, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, course_id)
       DO UPDATE SET progress = $3, updated_at = NOW()`,
      [decoded.id, dbCourseId, progress]
    );
    
    return NextResponse.json({
      message: 'Episode marked as completed',
      progress: progress,
      completed: completedModules,
      total: totalModules
    });
    
  } catch (error) {
    console.error('Episode completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}