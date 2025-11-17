-- Add created_at and deleted_at columns to loans table (updated_at already exists)
ALTER TABLE loans
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN deleted_at TIMESTAMP;

-- Set existing records to have current timestamp
UPDATE loans SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
