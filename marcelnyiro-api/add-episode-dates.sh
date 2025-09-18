#!/bin/bash

# Script to add episode dates to course_modules
# Run with: sudo ./add-episode-dates.sh

echo "Adding episode dates to course modules..."

sudo -u postgres psql marci_portfolio_db << 'EOF'

-- Add episode_date column to course_modules
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS episode_date DATE,
ADD COLUMN IF NOT EXISTS episode_time TIME DEFAULT '19:00:00';

-- Update existing modules with dates based on their quarter
-- For 2023 Weekly Check-ins
UPDATE course_modules 
SET episode_date = '2023-01-15'::date + (order_index - 1) * INTERVAL '3 months'
WHERE course_id = (SELECT id FROM courses WHERE title = 'Weekly Check-ins 2023');

-- For 2024 Weekly Check-ins  
UPDATE course_modules
SET episode_date = '2024-01-15'::date + (order_index - 1) * INTERVAL '3 months'
WHERE course_id = (SELECT id FROM courses WHERE title = 'Weekly Check-ins 2024');

-- For 2025 Weekly Check-ins
UPDATE course_modules
SET episode_date = '2025-01-15'::date + (order_index - 1) * INTERVAL '3 months'  
WHERE course_id = (SELECT id FROM courses WHERE title = 'Weekly Check-ins 2025');

-- Now let's create individual weekly episodes for each quarter
-- First, delete existing quarterly modules
DELETE FROM course_modules 
WHERE course_id IN (
    SELECT id FROM courses WHERE category = 'weekly-checkins'
);

-- Create weekly episodes for 2023 (4 episodes per month)
DO $$
DECLARE
    course_id_2023 INTEGER;
    month_counter INTEGER;
    week_counter INTEGER;
    episode_date DATE;
BEGIN
    SELECT id INTO course_id_2023 FROM courses WHERE title = 'Weekly Check-ins 2023';
    
    FOR month_counter IN 1..12 LOOP
        FOR week_counter IN 1..4 LOOP
            episode_date := DATE '2023-01-01' + (month_counter - 1) * INTERVAL '1 month' + (week_counter - 1) * INTERVAL '1 week';
            
            INSERT INTO course_modules (course_id, title, duration, video_count, order_index, episode_date, episode_time)
            VALUES (
                course_id_2023,
                'Week ' || week_counter || ' - ' || TO_CHAR(episode_date, 'Month') || ' 2023',
                '45 min',
                1,
                (month_counter - 1) * 4 + week_counter,
                episode_date,
                '19:00:00'::time
            );
        END LOOP;
    END LOOP;
END $$;

-- Create weekly episodes for 2024 (4 episodes per month)
DO $$
DECLARE
    course_id_2024 INTEGER;
    month_counter INTEGER;
    week_counter INTEGER;
    episode_date DATE;
BEGIN
    SELECT id INTO course_id_2024 FROM courses WHERE title = 'Weekly Check-ins 2024';
    
    FOR month_counter IN 1..12 LOOP
        FOR week_counter IN 1..4 LOOP
            episode_date := DATE '2024-01-01' + (month_counter - 1) * INTERVAL '1 month' + (week_counter - 1) * INTERVAL '1 week';
            
            INSERT INTO course_modules (course_id, title, duration, video_count, order_index, episode_date, episode_time)
            VALUES (
                course_id_2024,
                'Week ' || week_counter || ' - ' || TO_CHAR(episode_date, 'Month') || ' 2024',
                '45 min',
                1,
                (month_counter - 1) * 4 + week_counter,
                episode_date,
                '19:00:00'::time
            );
        END LOOP;
    END LOOP;
END $$;

-- Create weekly episodes for 2025 (current year - episodes up to current month + 2 months ahead)
DO $$
DECLARE
    course_id_2025 INTEGER;
    month_counter INTEGER;
    week_counter INTEGER;
    episode_date DATE;
    current_month INTEGER;
BEGIN
    SELECT id INTO course_id_2025 FROM courses WHERE title = 'Weekly Check-ins 2025';
    current_month := EXTRACT(MONTH FROM CURRENT_DATE);
    
    -- Create episodes for months up to current month + 2
    FOR month_counter IN 1..LEAST(current_month + 2, 12) LOOP
        FOR week_counter IN 1..4 LOOP
            episode_date := DATE '2025-01-01' + (month_counter - 1) * INTERVAL '1 month' + (week_counter - 1) * INTERVAL '1 week';
            
            INSERT INTO course_modules (course_id, title, duration, video_count, order_index, episode_date, episode_time)
            VALUES (
                course_id_2025,
                'Week ' || week_counter || ' - ' || TO_CHAR(episode_date, 'Month') || ' 2025',
                '45 min',
                1,
                (month_counter - 1) * 4 + week_counter,
                episode_date,
                '19:00:00'::time
            );
        END LOOP;
    END LOOP;
END $$;

-- Verify the changes
SELECT 
    c.title as course,
    COUNT(cm.id) as total_episodes,
    MIN(cm.episode_date) as first_episode,
    MAX(cm.episode_date) as last_episode
FROM courses c
LEFT JOIN course_modules cm ON c.id = cm.course_id
WHERE c.category = 'weekly-checkins'
GROUP BY c.id, c.title
ORDER BY c.title;

-- Show sample episodes for current month
SELECT 
    c.title as course,
    cm.title as episode,
    cm.episode_date,
    cm.episode_time
FROM courses c
JOIN course_modules cm ON c.id = cm.course_id
WHERE c.category = 'weekly-checkins'
    AND EXTRACT(MONTH FROM cm.episode_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM cm.episode_date) = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY cm.episode_date
LIMIT 10;

EOF

echo "Episode dates added successfully!"