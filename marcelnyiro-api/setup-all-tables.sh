#!/bin/bash

# Script to set up all database tables for Marci Portfolio
# Run with: sudo ./setup-all-tables.sh

echo "Setting up database tables for Marci Portfolio..."

sudo -u postgres psql marci_portfolio_db << 'EOF'

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    thumbnail VARCHAR(10) DEFAULT '📚',
    category VARCHAR(100) DEFAULT 'general',
    level VARCHAR(50) DEFAULT 'Beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    video_count INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table for tokens
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Create user_module_progress table
CREATE TABLE IF NOT EXISTS user_module_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, module_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert Weekly Check-ins courses
INSERT INTO courses (title, description, duration, thumbnail, category, level) VALUES
('Weekly Check-ins 2023', 'Strategic business reviews and entrepreneurship insights from 2023 - foundational year of building Outfino.', '12 hours', '📅', 'weekly-checkins', '2023'),
('Weekly Check-ins 2024', 'Scaling strategies and investment preparation insights from 2024 - the year of securing 73M HUF funding.', '14 hours', '📆', 'weekly-checkins', '2024'),
('Weekly Check-ins 2025', 'Advanced growth tactics and market expansion strategies for 2025 - international scaling and beyond.', '10 hours', '🗓️', 'weekly-checkins', '2025'),
('Building Outfino: From Idea to 73M HUF', 'Behind-the-scenes journey of building an AI fashion platform that secured Hungary''s first university VC investment.', '6 hours', '👗', 'case-study', 'Advanced'),
('Startup Scaling Strategies', 'Proven methods for growing from MVP to market leader, featuring Central-Eastern Europe expansion tactics.', '5 hours', '📈', 'business', 'Intermediate')
ON CONFLICT DO NOTHING;

-- Insert course modules
DO \$\$
DECLARE
    course_2023_id INTEGER;
    course_2024_id INTEGER;
    course_2025_id INTEGER;
    outfino_id INTEGER;
    scaling_id INTEGER;
BEGIN
    -- Get course IDs
    SELECT id INTO course_2023_id FROM courses WHERE title = 'Weekly Check-ins 2023';
    SELECT id INTO course_2024_id FROM courses WHERE title = 'Weekly Check-ins 2024';
    SELECT id INTO course_2025_id FROM courses WHERE title = 'Weekly Check-ins 2025';
    SELECT id INTO outfino_id FROM courses WHERE title = 'Building Outfino: From Idea to 73M HUF';
    SELECT id INTO scaling_id FROM courses WHERE title = 'Startup Scaling Strategies';
    
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
    
    -- Insert modules for Outfino course
    IF outfino_id IS NOT NULL THEN
        INSERT INTO course_modules (course_id, title, duration, video_count, order_index) VALUES
        (outfino_id, 'Pre-investment Preparation', '75 min', 4, 1),
        (outfino_id, 'STRT Incubation Process', '80 min', 4, 2),
        (outfino_id, 'OUVC Pitch & Negotiation', '90 min', 4, 3),
        (outfino_id, 'Scaling to 300+ Users & Beyond', '85 min', 4, 4)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Insert modules for Scaling course
    IF scaling_id IS NOT NULL THEN
        INSERT INTO course_modules (course_id, title, duration, video_count, order_index) VALUES
        (scaling_id, 'Growth Hacking for Startups', '60 min', 3, 1),
        (scaling_id, 'B2B Partnership Strategies', '80 min', 4, 2),
        (scaling_id, 'Geographic Expansion Planning', '75 min', 4, 3),
        (scaling_id, 'Team Building & Culture', '70 min', 4, 4)
        ON CONFLICT DO NOTHING;
    END IF;
END \$\$;

-- Grant permissions to marci_user
GRANT ALL PRIVILEGES ON TABLE courses TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE courses_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE course_modules TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE course_modules_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE user_sessions TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE user_sessions_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE user_progress TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE user_progress_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE user_module_progress TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE user_module_progress_id_seq TO marci_user;

-- Show created tables
\dt

-- Show courses
SELECT id, title, category, level FROM courses ORDER BY id;

-- Show modules count per course
SELECT c.title, COUNT(cm.id) as module_count 
FROM courses c 
LEFT JOIN course_modules cm ON c.id = cm.course_id 
GROUP BY c.title;

EOF

echo "Database setup complete!"
echo ""
echo "Created tables:"
echo "- courses (with Weekly Check-ins 2023, 2024, 2025)"
echo "- course_modules"
echo "- user_sessions"
echo "- user_progress"
echo "- user_module_progress"