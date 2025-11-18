# Docker Setup for Fintrax Backend

This guide explains how to run the Fintrax backend with PostgreSQL using Docker.

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Environment Configuration

Copy the Docker environment file to `.env`:

```bash
cd backend
cp .env.docker .env
```

Or create your own `.env` file with the following variables:

```env
DB_USER=fintrax
DB_PASSWORD=fintrax123
DB_NAME=fintrax_db
DB_HOST=postgres
DB_PORT=5432
APP_PORT=:8080
GIN_MODE=debug
JWT_SECRET=your-secret-key-change-in-production
EMAIL=
EMAIL_PASSWORD=
```

**Important**: Change `JWT_SECRET` to a secure random string in production.

### 2. Start the Services

Build and start both PostgreSQL and the backend:

```bash
docker compose up -d --build
```

This will:
- Pull the PostgreSQL 16 Alpine image
- Build the Go backend Docker image
- Start PostgreSQL first and wait for it to be healthy
- Run database migrations automatically
- Start the backend server on port 8080

### 3. Verify Services

Check if services are running:

```bash
docker compose ps
```

View logs:

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# PostgreSQL only
docker compose logs -f postgres
```

### 4. Test the API

The backend should be accessible at `http://localhost:8080`:

```bash
curl http://localhost:8080
```

Expected response:
```json
{"message": "Welcome to Fintrax API"}
```

## Common Commands

### Stop Services

```bash
docker compose down
```

### Stop and Remove Data

```bash
docker compose down -v
```

**Warning**: This will delete all data in the PostgreSQL database.

### Restart Services

```bash
docker compose restart
```

### Rebuild After Code Changes

```bash
docker compose up -d --build
```

### Access PostgreSQL Database

```bash
# Connect to PostgreSQL container
docker compose exec postgres psql -U fintrax -d fintrax_db
```

Common PostgreSQL commands:
```sql
-- List all tables
\dt

-- Describe a table
\d users

-- Run a query
SELECT * FROM users;

-- Exit
\q
```

### View Container Resource Usage

```bash
docker compose stats
```

## Architecture

### Services

1. **postgres**: PostgreSQL 16 Alpine
   - Port: 5432
   - Volume: `postgres_data` (persistent storage)
   - Health check enabled

2. **backend**: Go application
   - Port: 8080
   - Depends on PostgreSQL health check
   - Auto-runs migrations on startup

### Networking

Both services run on a private bridge network called `fintrax-network`. The backend connects to PostgreSQL using the service name `postgres` as the hostname.

### Volumes

- `postgres_data`: Persists PostgreSQL data between container restarts

## Development Workflow

### 1. Make Code Changes

Edit your Go code as needed.

### 2. Rebuild and Restart

```bash
docker compose up -d --build backend
```

### 3. View Logs

```bash
docker compose logs -f backend
```

## Troubleshooting

### Backend won't start

Check if PostgreSQL is healthy:

```bash
docker compose ps
```

View backend logs for errors:

```bash
docker compose logs backend
```

### Database connection issues

Verify PostgreSQL is accessible:

```bash
docker compose exec postgres pg_isready -U fintrax -d fintrax_db
```

### Port conflicts

If port 8080 or 5432 is already in use, modify the `.env` file:

```env
DB_PORT=5433
APP_PORT=:8081
```

Then restart:

```bash
docker compose down
docker compose up -d
```

### Reset everything

```bash
# Stop and remove all containers, networks, and volumes
docker compose down -v

# Remove the backend image
docker rmi backend-backend

# Start fresh
docker compose up -d --build
```

### Migration errors

If migrations fail, check the logs:

```bash
docker compose logs backend
```

To manually run migrations:

```bash
# Access the backend container
docker compose exec backend sh

# Migrations are in /root/migrations
ls -la migrations/
```

## Production Deployment

For production deployments:

1. **Change JWT_SECRET**: Use a cryptographically secure random string
2. **Set GIN_MODE**: Change to `release`
3. **Use strong database credentials**: Update `DB_PASSWORD`
4. **Configure email**: Set `EMAIL` and `EMAIL_PASSWORD` for OTP functionality
5. **Use secrets management**: Consider using Docker secrets or environment variable injection
6. **Enable SSL**: Configure PostgreSQL with SSL/TLS
7. **Set up reverse proxy**: Use Nginx or Traefik in front of the backend
8. **Regular backups**: Implement PostgreSQL backup strategy

Example production `.env`:

```env
DB_USER=fintrax_prod
DB_PASSWORD=very-secure-password-change-me
DB_NAME=fintrax_production
DB_HOST=postgres
DB_PORT=5432
APP_PORT=:8080
GIN_MODE=release
JWT_SECRET=very-long-random-secure-string-at-least-32-characters
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_USER` | PostgreSQL username | `fintrax` | Yes |
| `DB_PASSWORD` | PostgreSQL password | `fintrax123` | Yes |
| `DB_NAME` | Database name | `fintrax_db` | Yes |
| `DB_HOST` | Database host (use `postgres` for Docker) | `postgres` | Yes |
| `DB_PORT` | Database port | `5432` | Yes |
| `APP_PORT` | Application port | `:8080` | Yes |
| `GIN_MODE` | Gin mode (debug/release/test) | `debug` | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `EMAIL` | Gmail address for OTP emails | - | No |
| `EMAIL_PASSWORD` | Gmail app password | - | No |

## Next Steps

- Configure the frontend to connect to `http://localhost:8080/api`
- Set up email credentials for OTP functionality
- Review and customize database credentials
- Consider adding Redis for caching
- Set up monitoring and logging
