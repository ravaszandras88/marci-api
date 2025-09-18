#!/bin/bash

# Script to add course modules
# Run with: sudo ./add-modules.sh

echo "Adding course modules..."

sudo -u postgres psql marci_portfolio_db << 'EOF'

-- Add modules for Weekly Check-ins 2023
INSERT INTO course_modules (course_id, title, duration, video_count, order_index) 
SELECT id, 'Q1 2023: Ideation & Market Research', '180 min', 12, 1 FROM courses WHERE title = 'Weekly Check-ins 2023';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q2 2023: MVP Development Journey', '180 min', 12, 2 FROM courses WHERE title = 'Weekly Check-ins 2023';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q3 2023: First User Feedback & Pivots', '180 min', 12, 3 FROM courses WHERE title = 'Weekly Check-ins 2023';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q4 2023: Building the Founding Team', '180 min', 12, 4 FROM courses WHERE title = 'Weekly Check-ins 2023';

-- Add modules for Weekly Check-ins 2024
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q1 2024: STRT Incubator Application', '210 min', 14, 1 FROM courses WHERE title = 'Weekly Check-ins 2024';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q2 2024: Product-Market Fit & Scaling', '210 min', 14, 2 FROM courses WHERE title = 'Weekly Check-ins 2024';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q3 2024: OUVC Investment Process', '210 min', 14, 3 FROM courses WHERE title = 'Weekly Check-ins 2024';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q4 2024: Post-Investment Growth', '210 min', 14, 4 FROM courses WHERE title = 'Weekly Check-ins 2024';

-- Add modules for Weekly Check-ins 2025
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q1 2025: International Market Entry', '150 min', 10, 1 FROM courses WHERE title = 'Weekly Check-ins 2025';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q2 2025: AI Technology Advancements', '150 min', 10, 2 FROM courses WHERE title = 'Weekly Check-ins 2025';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q3 2025: Strategic Partnerships', '150 min', 10, 3 FROM courses WHERE title = 'Weekly Check-ins 2025';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Q4 2025: Future Vision & Roadmap', '150 min', 10, 4 FROM courses WHERE title = 'Weekly Check-ins 2025';

-- Add modules for Outfino course
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Pre-investment Preparation', '75 min', 4, 1 FROM courses WHERE title = 'Building Outfino: From Idea to 73M HUF';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'STRT Incubation Process', '80 min', 4, 2 FROM courses WHERE title = 'Building Outfino: From Idea to 73M HUF';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'OUVC Pitch & Negotiation', '90 min', 4, 3 FROM courses WHERE title = 'Building Outfino: From Idea to 73M HUF';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Scaling to 300+ Users & Beyond', '85 min', 4, 4 FROM courses WHERE title = 'Building Outfino: From Idea to 73M HUF';

-- Add modules for Scaling course
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Growth Hacking for Startups', '60 min', 3, 1 FROM courses WHERE title = 'Startup Scaling Strategies';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'B2B Partnership Strategies', '80 min', 4, 2 FROM courses WHERE title = 'Startup Scaling Strategies';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Geographic Expansion Planning', '75 min', 4, 3 FROM courses WHERE title = 'Startup Scaling Strategies';
INSERT INTO course_modules (course_id, title, duration, video_count, order_index)
SELECT id, 'Team Building & Culture', '70 min', 4, 4 FROM courses WHERE title = 'Startup Scaling Strategies';

-- Clean up accidentally created tables
DROP TABLE IF EXISTS course_2024_id;
DROP TABLE IF EXISTS course_2025_id; 
DROP TABLE IF EXISTS outfino_id;
DROP TABLE IF EXISTS scaling_id;

-- Verify modules were added
SELECT c.title as course, COUNT(cm.id) as modules 
FROM courses c 
LEFT JOIN course_modules cm ON c.id = cm.course_id 
GROUP BY c.id, c.title
ORDER BY c.id;

-- Show some sample modules
SELECT c.title as course, cm.title as module, cm.video_count as videos
FROM courses c
JOIN course_modules cm ON c.id = cm.course_id
WHERE c.category = 'weekly-checkins'
ORDER BY c.id, cm.order_index
LIMIT 6;

EOF

echo "Modules added successfully!"