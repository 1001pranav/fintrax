ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id INTEGER NOT NULL DEFAULT 1;

ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
