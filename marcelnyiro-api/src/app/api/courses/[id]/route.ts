import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

// Admin verification helper
const isAdmin = (email: string): boolean => {
  return email === 'business@marcelnyiro.com';
};

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const courseId = (await params).id;
    const changes = await request.json();
    
    console.log('PUT /api/courses/[id] - Course ID:', courseId);
    console.log('PUT /api/courses/[id] - Changes received:', JSON.stringify(changes, null, 2));

    // Update course fields if provided
    if (changes.title || changes.description || changes.duration || changes.level || changes.thumbnail) {
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      if (changes.title) {
        updateFields.push(`title = $${paramIndex++}`);
        updateValues.push(changes.title);
      }
      if (changes.description) {
        updateFields.push(`description = $${paramIndex++}`);
        updateValues.push(changes.description);
      }
      if (changes.duration) {
        updateFields.push(`duration = $${paramIndex++}`);
        updateValues.push(changes.duration);
      }
      if (changes.level) {
        updateFields.push(`level = $${paramIndex++}`);
        updateValues.push(changes.level);
      }
      if (changes.thumbnail) {
        updateFields.push(`thumbnail = $${paramIndex++}`);
        updateValues.push(changes.thumbnail);
      }

      if (updateFields.length > 0) {
        // Find course by ID string or mapping
        let dbCourseId = null;
        
        // Check if courseId ends with a database ID (format: "title-123")
        const lastDashIndex = courseId.lastIndexOf('-');
        const possibleDbId = courseId.substring(lastDashIndex + 1);
        
        if (lastDashIndex > 0 && /^\d+$/.test(possibleDbId)) {
          // Try direct database ID lookup first
          const directResult = await query('SELECT id FROM courses WHERE id = $1', [parseInt(possibleDbId)]);
          if (directResult.length > 0) {
            dbCourseId = directResult[0].id;
          }
        }
        
        // If not found, try the old method
        if (!dbCourseId) {
          const courseResult = await query(
            `SELECT id FROM courses WHERE 
             LOWER(REPLACE(REPLACE(title, ' ', '-'), '''', '')) = $1 OR 
             (category = 'weekly-checkins' AND CONCAT('weekly-checkins-', LOWER(level)) = $1)`,
            [courseId]
          );
          
          if (courseResult.length > 0) {
            dbCourseId = courseResult[0].id;
          }
        }

        if (!dbCourseId) {
          return NextResponse.json(
            { error: 'Course not found' },
            { status: 404 }
          );
        }

        updateValues.push(dbCourseId);
        const updateQuery = `UPDATE courses SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
        
        await query(updateQuery, updateValues);
      }
    }

    // Update module fields if provided
    if (changes.modules) {
      console.log('Processing module changes...');
      for (const [moduleId, moduleChanges] of Object.entries(changes.modules)) {
        console.log(`Processing module ${moduleId}:`, JSON.stringify(moduleChanges, null, 2));
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        const moduleUpdates = moduleChanges as any;
        
        if (moduleUpdates.title) {
          updateFields.push(`title = $${paramIndex++}`);
          updateValues.push(moduleUpdates.title);
        }
        if (moduleUpdates.duration) {
          updateFields.push(`duration = $${paramIndex++}`);
          updateValues.push(moduleUpdates.duration);
        }
        if (moduleUpdates.videos !== undefined) {
          updateFields.push(`video_count = $${paramIndex++}`);
          updateValues.push(moduleUpdates.videos);
        }
        if (moduleUpdates.videoUrl !== undefined) {
          updateFields.push(`video_url = $${paramIndex++}`);
          updateValues.push(moduleUpdates.videoUrl);
        }

        if (updateFields.length > 0) {
          updateValues.push(parseInt(moduleId));
          const moduleUpdateQuery = `UPDATE course_modules SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
          
          console.log('Executing module update query:', moduleUpdateQuery);
          console.log('With values:', updateValues);
          
          await query(moduleUpdateQuery, updateValues);
          console.log(`Module ${moduleId} updated successfully`);
        } else {
          console.log(`No updates needed for module ${moduleId}`);
        }
      }
    }

    // Handle new modules if provided
    if (changes.newModules && changes.newModules.length > 0) {
      // Use the same dbCourseId lookup logic as above
      let moduleDbCourseId = null;
      
      const lastDashIndex = courseId.lastIndexOf('-');
      const possibleDbId = courseId.substring(lastDashIndex + 1);
      
      if (lastDashIndex > 0 && /^\d+$/.test(possibleDbId)) {
        const directResult = await query('SELECT id FROM courses WHERE id = $1', [parseInt(possibleDbId)]);
        if (directResult.length > 0) {
          moduleDbCourseId = directResult[0].id;
        }
      }
      
      if (!moduleDbCourseId) {
        const courseResult = await query(
          `SELECT id FROM courses WHERE 
           LOWER(REPLACE(REPLACE(title, ' ', '-'), '''', '')) = $1 OR 
           (category = 'weekly-checkins' AND CONCAT('weekly-checkins-', LOWER(level)) = $1)`,
          [courseId]
        );
        
        if (courseResult.length > 0) {
          moduleDbCourseId = courseResult[0].id;
        }
      }

      if (moduleDbCourseId) {
        
        for (const newModule of changes.newModules) {
          await query(
            `INSERT INTO course_modules (course_id, title, duration, video_count, order_index) 
             VALUES ($1, $2, $3, $4, $5)`,
            [moduleDbCourseId, newModule.title, newModule.duration, newModule.videos, newModule.order_index]
          );
        }
      }
    }

    // Handle deleted modules if provided
    if (changes.deletedModules && changes.deletedModules.length > 0) {
      for (const moduleId of changes.deletedModules) {
        await query('DELETE FROM course_modules WHERE id = $1', [moduleId]);
      }
    }

    return NextResponse.json({
      message: 'Course updated successfully',
      courseId: courseId
    }, { status: 200 });

  } catch (error) {
    console.error('Course update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const courseId = (await params).id;

    // Find course by ID string or mapping
    let dbCourseId = null;
    
    // Check if courseId ends with a database ID (format: "title-123")
    const lastDashIndex = courseId.lastIndexOf('-');
    const possibleDbId = courseId.substring(lastDashIndex + 1);
    
    if (lastDashIndex > 0 && /^\d+$/.test(possibleDbId)) {
      // Try direct database ID lookup first
      const directResult = await query('SELECT id FROM courses WHERE id = $1', [parseInt(possibleDbId)]);
      if (directResult.length > 0) {
        dbCourseId = directResult[0].id;
      }
    }
    
    // If not found, try the old method
    if (!dbCourseId) {
      const courseResult = await query(
        `SELECT id FROM courses WHERE 
         LOWER(REPLACE(REPLACE(title, ' ', '-'), '''', '')) = $1 OR 
         (category = 'weekly-checkins' AND CONCAT('weekly-checkins-', LOWER(level)) = $1)`,
        [courseId]
      );
      
      if (courseResult.length > 0) {
        dbCourseId = courseResult[0].id;
      }
    }

    if (!dbCourseId) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Delete associated modules first (due to foreign key constraints)
    await query('DELETE FROM course_modules WHERE course_id = $1', [dbCourseId]);
    
    // Delete the course
    await query('DELETE FROM courses WHERE id = $1', [dbCourseId]);

    return NextResponse.json({
      message: 'Course deleted successfully',
      courseId: courseId
    }, { status: 200 });

  } catch (error) {
    console.error('Course deletion error:', error);
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
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}