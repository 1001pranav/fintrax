ALTER TABLE users
ADD COLUMN deleted_at TIMESTAMP NULL,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN status VARCHAR(20) DEFAULT 'notVerified', -- "active", "inactive", "banned", "notVerified"
ADD COLUMN OTP_tries INT DEFAULT 0; -- Number