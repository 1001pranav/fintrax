-- Remove created_at and deleted_at columns from savings table
ALTER TABLE savings
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS deleted_at;
