#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    # Export only valid environment variables, stripping inline comments
    while IFS='=' read -r key value; do
        # Skip empty lines and lines starting with #
        [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue

        # Remove inline comments and quotes
        value=$(echo "$value" | sed 's/#.*//' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^"//' | sed 's/"$//' | sed "s/^'//" | sed "s/'$//")

        # Export the variable
        export "$key=$value"
    done < .env
else
    echo "❌ Error: .env file not found"
    exit 1
fi

# Database connection string
DB_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

# Check if migrate is installed
if ! command -v migrate &> /dev/null; then
    echo "❌ Error: golang-migrate is not installed"
    echo "Install it with: brew install golang-migrate"
    exit 1
fi

# Function to display usage
usage() {
    echo "Usage: ./migrate.sh [command]"
    echo ""
    echo "Commands:"
    echo "  up              Run all pending migrations"
    echo "  down            Rollback last migration"
    echo "  down [n]        Rollback last n migrations"
    echo "  version         Show current migration version"
    echo "  force [version] Force set migration version (use with caution)"
    echo "  create [name]   Create a new migration file"
    echo ""
    echo "Examples:"
    echo "  ./migrate.sh up"
    echo "  ./migrate.sh down"
    echo "  ./migrate.sh down 2"
    echo "  ./migrate.sh version"
    echo "  ./migrate.sh create add_user_avatar"
    exit 1
}

# Check if command is provided
if [ $# -eq 0 ]; then
    usage
fi

COMMAND=$1

case $COMMAND in
    up)
        echo "🚀 Running migrations..."
        migrate -path migrations -database "$DB_URL" up
        if [ $? -eq 0 ]; then
            echo "✅ Migrations completed successfully"
        else
            echo "❌ Migration failed"
            exit 1
        fi
        ;;

    down)
        if [ -n "$2" ]; then
            echo "⬇️  Rolling back last $2 migration(s)..."
            migrate -path migrations -database "$DB_URL" down $2
        else
            echo "⬇️  Rolling back last migration..."
            migrate -path migrations -database "$DB_URL" down 1
        fi
        if [ $? -eq 0 ]; then
            echo "✅ Rollback completed successfully"
        else
            echo "❌ Rollback failed"
            exit 1
        fi
        ;;

    version)
        echo "📌 Current migration version:"
        migrate -path migrations -database "$DB_URL" version
        ;;

    force)
        if [ -z "$2" ]; then
            echo "❌ Error: Please specify version number"
            echo "Usage: ./migrate.sh force [version]"
            exit 1
        fi
        echo "⚠️  Forcing migration version to $2..."
        migrate -path migrations -database "$DB_URL" force $2
        if [ $? -eq 0 ]; then
            echo "✅ Version forced successfully"
        else
            echo "❌ Force failed"
            exit 1
        fi
        ;;

    create)
        if [ -z "$2" ]; then
            echo "❌ Error: Please specify migration name"
            echo "Usage: ./migrate.sh create [name]"
            exit 1
        fi

        # Generate timestamp
        TIMESTAMP=$(date +%Y%m%d%H%M%S)
        MIGRATION_NAME=$2

        # Create migration files
        UP_FILE="migrations/${TIMESTAMP}_${MIGRATION_NAME}.up.sql"
        DOWN_FILE="migrations/${TIMESTAMP}_${MIGRATION_NAME}.down.sql"

        echo "-- Migration: $MIGRATION_NAME" > "$UP_FILE"
        echo "-- Add your up migration SQL here" >> "$UP_FILE"
        echo "" >> "$UP_FILE"

        echo "-- Migration: $MIGRATION_NAME" > "$DOWN_FILE"
        echo "-- Add your down migration SQL here" >> "$DOWN_FILE"
        echo "" >> "$DOWN_FILE"

        echo "✅ Created migration files:"
        echo "   📄 $UP_FILE"
        echo "   📄 $DOWN_FILE"
        ;;

    *)
        echo "❌ Unknown command: $COMMAND"
        usage
        ;;
esac
