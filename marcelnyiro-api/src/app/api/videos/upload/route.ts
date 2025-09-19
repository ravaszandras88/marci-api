import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Admin verification helper
const isAdmin = (email: string): boolean => {
  return email === 'business@marcelnyiro.com';
};

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

    const formData = await request.formData();
    const file = formData.get('video') as File;
    const courseId = formData.get('courseId') as string;
    const moduleId = formData.get('moduleId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    if (!courseId || !moduleId) {
      return NextResponse.json(
        { error: 'Course ID and Module ID are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, and OGG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }

    // Create videos directory if it doesn't exist
    const videosDir = join(process.cwd(), 'public', 'videos');
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true });
    }

    // Create course-specific directory
    const courseDir = join(videosDir, courseId);
    if (!existsSync(courseDir)) {
      await mkdir(courseDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `module_${moduleId}_${timestamp}.${fileExtension}`;
    const filePath = join(courseDir, fileName);

    // Save file to local storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate URL for the uploaded video
    const videoUrl = `/videos/${courseId}/${fileName}`;

    // Update the module in the database with the new video URL
    const updateResult = await query(
      'UPDATE course_modules SET video_url = $1 WHERE id = $2 RETURNING id',
      [videoUrl, parseInt(moduleId)]
    );

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update module with video URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Video uploaded successfully',
      videoUrl: videoUrl,
      fileName: fileName,
      fileSize: file.size,
      fileType: file.type
    }, { status: 200 });

  } catch (error) {
    console.error('Video upload error:', error);
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