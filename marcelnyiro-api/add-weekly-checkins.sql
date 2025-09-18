-- Add Weekly Check-ins courses to the database
-- Connect to the database first
-- \c marci_portfolio_db;

-- Insert Weekly Check-ins courses (one for each year)
INSERT INTO courses (title, description, duration, thumbnail, category, level) VALUES
('Weekly Check-ins 2023', 'Strategic business reviews and entrepreneurship insights from 2023 - foundational year of building Outfino.', '12 hours', '📅', 'weekly-checkins', '2023'),
('Weekly Check-ins 2024', 'Scaling strategies and investment preparation insights from 2024 - the year of securing 73M HUF funding.', '14 hours', '📆', 'weekly-checkins', '2024'),
('Weekly Check-ins 2025', 'Advanced growth tactics and market expansion strategies for 2025 - international scaling and beyond.', '10 hours', '🗓️', 'weekly-checkins', '2025')
ON CONFLICT DO NOTHING;

-- Get the course IDs (assuming they are inserted in order)
DO $$
DECLARE
    course_2023_id INTEGER;
    course_2024_id INTEGER;
    course_2025_id INTEGER;
BEGIN
    -- Get course IDs
    SELECT id INTO course_2023_id FROM courses WHERE title = 'Weekly Check-ins 2023';
    SELECT id INTO course_2024_id FROM courses WHERE title = 'Weekly Check-ins 2024';
    SELECT id INTO course_2025_id FROM courses WHERE title = 'Weekly Check-ins 2025';
    
    -- Insert modules for 2023
    IF course_2023_id IS NOT NULL THEN
        INSERT INTO course_modules (course_id, title, duration, video_count, order_index) VALUES
        (course_2023_id, 'Q1 2023: Ideation & Market Research', '180 min', 12, 1),
        (course_2023_id, 'Q2 2023: MVP Development Journey', '180 min', 12, 2),
        (course_2023_id, 'Q3 2023: First User Feedback & Pivots', '180 min', 12, 3),
        (course_2023_id, 'Q4 2023: Building the Founding Team', '180 min', 12, 4)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Insert modules for 2024
    IF course_2024_id IS NOT NULL THEN
        INSERT INTO course_modules (course_id, title, duration, video_count, order_index) VALUES
        (course_2024_id, 'Q1 2024: STRT Incubator Application', '210 min', 14, 1),
        (course_2024_id, 'Q2 2024: Product-Market Fit & Scaling', '210 min', 14, 2),
        (course_2024_id, 'Q3 2024: OUVC Investment Process', '210 min', 14, 3),
        (course_2024_id, 'Q4 2024: Post-Investment Growth', '210 min', 14, 4)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Insert modules for 2025
    IF course_2025_id IS NOT NULL THEN
        INSERT INTO course_modules (course_id, title, duration, video_count, order_index) VALUES
        (course_2025_id, 'Q1 2025: International Market Entry', '150 min', 10, 1),
        (course_2025_id, 'Q2 2025: AI Technology Advancements', '150 min', 10, 2),
        (course_2025_id, 'Q3 2025: Strategic Partnerships', '150 min', 10, 3),
        (course_2025_id, 'Q4 2025: Future Vision & Roadmap', '150 min', 10, 4)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Update the original AI Entrepreneurship course to remove it (optional)
-- Or rename it to something else if you want to keep it
-- UPDATE courses SET title = 'AI Startup Masterclass' WHERE title = 'AI Entrepreneurship Masterclass';

COMMIT;