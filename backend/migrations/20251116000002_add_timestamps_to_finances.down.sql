-- Remove created_at and deleted_at columns from finances table
ALTER TABLE finances
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS deleted_at;
