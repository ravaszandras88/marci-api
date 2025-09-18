#!/bin/bash

echo "Setting up PostgreSQL database for Marci Portfolio..."

# Create database
echo "Creating database..."
echo "triotro44404" | sudo -S -u postgres createdb marci_portfolio_db 2>/dev/null || echo "Database may already exist"

# Create user and set up tables
echo "Setting up user and tables..."
echo "triotro44404" | sudo -S -u postgres psql -d postgres << EOF
-- Create user
CREATE USER marci_user WITH ENCRYPTED PASSWORD 'MarciPortfolio2024!';

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE marci_portfolio_db TO marci_user;
EOF

# Connect to the new database and create tables
echo "triotro44404" | sudo -S -u postgres psql -d marci_portfolio_db << EOF
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

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to the new user
GRANT ALL PRIVILEGES ON TABLE users TO marci_user;
GRANT ALL PRIVILEGES ON SEQUENCE users_id_seq TO marci_user;

-- Grant future table privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO marci_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO marci_user;
EOF

echo ""
echo "Database setup complete!"
echo "Database: marci_portfolio_db"
echo "User: marci_user"
echo "Password: MarciPortfolio2024!"
echo ""
echo "You can now test the registration in your application."