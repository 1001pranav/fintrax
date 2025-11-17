-- Remove created_at column from users table
ALTER TABLE users
DROP COLUMN IF EXISTS created_at;
