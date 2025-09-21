-- Add user_premium column to users table
-- This column tracks if a user has premium access

ALTER TABLE users 
ADD COLUMN user_premium BOOLEAN DEFAULT FALSE;

-- Add comment to document the column
COMMENT ON COLUMN users.user_premium IS 'Indicates if user has premium access. Default is false.';

-- Create index for premium users for faster queries
CREATE INDEX IF NOT EXISTS idx_users_premium ON users(user_premium) WHERE user_premium = TRUE;

-- Update existing users to have premium=false (this is redundant due to DEFAULT but ensures consistency)
UPDATE users SET user_premium = FALSE WHERE user_premium IS NULL;