CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    source VARCHAR(150) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    type INTEGER DEFAULT 1 CHECK (type >= 1 AND type <= 2),
    transaction_type INTEGER DEFAULT 1 CHECK (transaction_type >= 1 AND transaction_type <= 5),
    category VARCHAR(150) NOT NULL,
    notes_id INTEGER,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    status INTEGER DEFAULT 1 CHECK (status >= 1 AND status <= 6)
);
