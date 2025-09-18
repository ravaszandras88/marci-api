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

-- Grant permissions to the new user
GRANT ALL PRIVILEGES ON TABLE users TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE users_id_seq TO marci_user;