-- Add status column to courses table
-- Run this SQL command in your PostgreSQL database

ALTER TABLE courses ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft';

-- Update existing courses to be active by default
UPDATE courses SET status = 'active' WHERE status IS NULL OR status = '';

-- Verify the column was added
\d courses;