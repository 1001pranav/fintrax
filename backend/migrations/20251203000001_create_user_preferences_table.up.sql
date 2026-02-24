CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,

    -- Appearance
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    color_scheme VARCHAR(50) DEFAULT 'blue',
    font_size VARCHAR(20) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),

    -- Language & Localization
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    time_format VARCHAR(10) DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
    currency VARCHAR(10) DEFAULT 'USD',

    -- Notifications
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    task_reminders BOOLEAN DEFAULT true,
    project_updates BOOLEAN DEFAULT true,
    finance_alerts BOOLEAN DEFAULT true,
    weekly_digest BOOLEAN DEFAULT false,

    -- Privacy
    profile_visibility VARCHAR(20) DEFAULT 'private' CHECK (profile_visibility IN ('public', 'private', 'friends')),
    show_online_status BOOLEAN DEFAULT true,
    allow_data_collection BOOLEAN DEFAULT true,

    -- Finance Settings
    default_transaction_type INTEGER DEFAULT 2,
    show_balance BOOLEAN DEFAULT true,
    budget_warnings BOOLEAN DEFAULT true,

    -- Dashboard & Display
    default_dashboard_view VARCHAR(50) DEFAULT 'overview',
    tasks_per_page INTEGER DEFAULT 20,
    compact_mode BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
