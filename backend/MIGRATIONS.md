# Database Migrations Guide

This document explains how to use the migration script to manage database schema changes.

## Prerequisites

- **golang-migrate** must be installed
  ```bash
  # macOS
  brew install golang-migrate

  # Linux
  curl -L https://github.com/golang-migrate/migrate/releases/download/v4.15.2/migrate.linux-amd64.tar.gz | tar xvz
  sudo mv migrate /usr/local/bin/

  # Or use Go
  go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
  ```

- `.env` file must be configured with database credentials

## Usage

The migration script (`migrate.sh`) provides several commands:

### 1. Run Migrations

Apply all pending migrations:
```bash
./migrate.sh up
```

### 2. Rollback Migrations

Rollback the last migration:
```bash
./migrate.sh down
```

Rollback the last N migrations:
```bash
./migrate.sh down 2
```

### 3. Check Current Version

Display the current migration version:
```bash
./migrate.sh version
```

### 4. Create New Migration

Create a new migration file:
```bash
./migrate.sh create add_user_avatar
```

This will create two files:
- `migrations/TIMESTAMP_add_user_avatar.up.sql` - Migration to apply
- `migrations/TIMESTAMP_add_user_avatar.down.sql` - Migration to rollback

### 5. Force Migration Version (Use with Caution)

If a migration is in a "dirty" state, you can force set the version:
```bash
./migrate.sh force VERSION_NUMBER
```

**⚠️ Warning:** Only use this if you know what you're doing. This bypasses normal migration tracking.

## Migration File Structure

### Up Migration (`*.up.sql`)
Contains SQL to apply the schema change:
```sql
-- Add new column to users table
ALTER TABLE users
ADD COLUMN avatar_url VARCHAR(255);
```

### Down Migration (`*.down.sql`)
Contains SQL to undo the schema change:
```sql
-- Remove avatar column from users table
ALTER TABLE users
DROP COLUMN IF EXISTS avatar_url;
```

## Best Practices

1. **Always test migrations locally first** before applying to production
2. **Keep migrations small and focused** - one logical change per migration
3. **Write reversible migrations** - always include proper down migration
4. **Never modify existing migrations** that have been run in production
5. **Use transactions** when possible to ensure atomic changes
6. **Backup your database** before running migrations in production

## Common Issues

### Migration is "dirty"
If a migration fails mid-execution, it may leave the database in a "dirty" state:
```bash
# Check version
./migrate.sh version
# Output: 20251116000001 (dirty)

# Force to the last successful version
./migrate.sh force 20251116000000

# Then try running migrations again
./migrate.sh up
```

### Cannot connect to database
Verify your `.env` file has correct database credentials:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Examples

### Example 1: Adding a new table
```bash
# Create migration
./migrate.sh create create_notifications_table

# Edit migrations/TIMESTAMP_create_notifications_table.up.sql
# Add your CREATE TABLE statement

# Edit migrations/TIMESTAMP_create_notifications_table.down.sql
# Add DROP TABLE statement

# Run migration
./migrate.sh up
```

### Example 2: Adding a column
```bash
# Create migration
./migrate.sh create add_email_verified_to_users

# Edit up migration
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

# Edit down migration
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;

# Run migration
./migrate.sh up
```

### Example 3: Rollback last migration
```bash
# Check current version
./migrate.sh version

# Rollback
./migrate.sh down

# Verify
./migrate.sh version
```

## Automatic Migrations on Server Start

The application automatically runs pending migrations when it starts (see `main.go`). However, it's recommended to run migrations manually first to catch any issues before deployment.

## Production Deployment

For production deployments:

1. Backup the database
2. Test migrations on staging first
3. Run migrations manually before deploying new code:
   ```bash
   ./migrate.sh up
   ```
4. Deploy application code
5. Verify everything is working

## Migration History

To see all migrations:
```bash
ls -la migrations/
```

Current migration version:
```bash
./migrate.sh version
```
