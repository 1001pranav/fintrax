ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_transactions_user;

DROP INDEX IF EXISTS idx_transactions_user_id;

ALTER TABLE transactions DROP COLUMN IF EXISTS user_id;
