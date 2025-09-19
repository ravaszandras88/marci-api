import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

// Admin verification helper
const isAdmin = (email: string): boolean => {
  return email === 'business@marcelnyiro.com';
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const courseId = parseInt(params.id);
    const moduleData = await request.json();

    // Get the current highest order_index for this course
    const maxOrderResult = await query(
      'SELECT MAX(order_index) as max_order FROM course_modules WHERE course_id = $1',
      [courseId]
    );

    const nextOrderIndex = (maxOrderResult[0]?.max_order || 0) + 1;

    // Insert new module into database
    const moduleResult = await query(
      `INSERT INTO course_modules (course_id, title, duration, video_count, order_index, episode_date, episode_time, video_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [
        courseId,
        moduleData.title,
        moduleData.duration,
        moduleData.videos || 1,
        nextOrderIndex,
        moduleData.episode_date || null,
        moduleData.episode_time || null,
        moduleData.videoUrl || null
      ]
    );

    const newModuleId = moduleResult[0].id;

    return NextResponse.json({
      message: 'Module added successfully',
      moduleId: newModuleId
    }, { status: 201 });

  } catch (error) {
    console.error('Module creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}