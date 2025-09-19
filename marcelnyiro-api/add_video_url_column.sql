-- Add video_url column to course_modules table
-- Run this SQL command in your PostgreSQL database

ALTER TABLE course_modules ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);

-- Verify the column was added
\d course_modules;