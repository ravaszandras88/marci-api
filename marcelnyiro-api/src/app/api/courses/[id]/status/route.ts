import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

// Admin verification helper
const isAdmin = (email: string): boolean => {
  return email === 'business@marcelnyiro.com';
};

export async function PUT(
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

    const { status } = await request.json();
    const courseId = (await params).id;

    // Validate status value
    if (!status || !['active', 'draft'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "active" or "draft"' },
        { status: 400 }
      );
    }

    // Update course status in database
    const result = await query(
      'UPDATE courses SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, parseInt(courseId)]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Course status updated successfully',
      courseId: courseId,
      status: status
    }, { status: 200 });

  } catch (error) {
    console.error('Course status update error:', error);
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
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}