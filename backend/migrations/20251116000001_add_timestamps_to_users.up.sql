-- Add created_at column to users table (updated_at and deleted_at already exist)
ALTER TABLE users
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Set existing records to have current timestamp
UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
