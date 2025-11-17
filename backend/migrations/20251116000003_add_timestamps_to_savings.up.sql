-- Add created_at and deleted_at columns to savings table (updated_at already exists)
ALTER TABLE savings
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN deleted_at TIMESTAMP;

-- Set existing records to have current timestamp
UPDATE savings SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
