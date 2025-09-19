-- Add course_type column to courses table
-- Run this SQL command in your PostgreSQL database

ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type VARCHAR(20) DEFAULT 'normal';

-- Update existing weekly-checkins courses to be monthly type
UPDATE courses SET course_type = 'monthly' WHERE category = 'weekly-checkins';

-- Update other courses to be normal type
UPDATE courses SET course_type = 'normal' WHERE course_type IS NULL OR course_type = '';

-- Verify the column was added
\d courses;