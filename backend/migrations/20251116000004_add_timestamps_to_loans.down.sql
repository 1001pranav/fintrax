-- Remove created_at and deleted_at columns from loans table
ALTER TABLE loans
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS deleted_at;
