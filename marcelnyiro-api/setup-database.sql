-- Create database and user for Marci Portfolio
-- Run this as the postgres superuser

-- Create database
CREATE DATABASE marci_portfolio_db;

-- Create user
CREATE USER marci_user WITH ENCRYPTED PASSWORD 'MarciPortfolio2024!';

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE marci_portfolio_db TO marci_user;

-- Connect to the new database
\c marci_portfolio_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO marci_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO marci_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO marci_user;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create user_sessions table for tokens
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on token for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

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

-- Insert sample courses
INSERT INTO courses (title, description, duration, thumbnail, category, level) VALUES
('AI Entrepreneurship Masterclass', 'Learn how to build and scale AI-powered businesses from ideation to 73M HUF funding like Outfino.', '8 hours', '🤖', 'entrepreneurship', 'Intermediate'),
('Building Outfino: From Idea to 73M HUF', 'Behind-the-scenes journey of building an AI fashion platform that secured Hungary''s first university VC investment.', '6 hours', '👗', 'case-study', 'Advanced'),
('Startup Scaling Strategies', 'Proven methods for growing from MVP to market leader, featuring Central-Eastern Europe expansion tactics.', '5 hours', '📈', 'business', 'Intermediate')
ON CONFLICT DO NOTHING;

-- Insert course modules
INSERT INTO course_modules (course_id, title, duration, video_count, order_index) VALUES
-- AI Entrepreneurship Masterclass modules
(1, 'AI Business Model Validation', '90 min', 4, 1),
(1, 'Building AI-Powered MVPs', '120 min', 5, 2),
(1, 'Fashion Tech & Industry Applications', '100 min', 4, 3),
(1, 'Securing VC Investment (OUVC Case Study)', '110 min', 4, 4),
(1, 'Scaling AI Products to 5K Users', '95 min', 4, 5),
(1, 'Exit Strategies for AI Startups', '85 min', 4, 6),

-- Building Outfino modules
(2, 'Pre-investment Preparation', '75 min', 4, 1),
(2, 'STRT Incubation Process', '80 min', 4, 2),
(2, 'OUVC Pitch & Negotiation', '90 min', 4, 3),
(2, 'Scaling to 300+ Users & Beyond', '85 min', 4, 4),

-- Startup Scaling modules
(3, 'Growth Hacking for Startups', '60 min', 3, 1),
(3, 'B2B Partnership Strategies', '80 min', 4, 2),
(3, 'Geographic Expansion Planning', '75 min', 4, 3),
(3, 'Team Building & Culture', '70 min', 4, 4)
ON CONFLICT DO NOTHING;

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to the new user
GRANT ALL PRIVILEGES ON TABLE users TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE users_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE user_sessions TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE user_sessions_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE courses TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE courses_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE course_modules TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE course_modules_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE user_progress TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE user_progress_id_seq TO marci_user;
GRANT ALL PRIVILEGES ON TABLE user_module_progress TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE user_module_progress_id_seq TO marci_user;