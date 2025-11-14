# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fintrax is a full-stack financial management and project tracking application with:
- **Backend**: Go (Gin framework) with PostgreSQL and GORM
- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS 4

## Development Setup

### Backend (Go)

The backend runs on Go 1.23+ and uses GORM for database operations with PostgreSQL.

**Install dependencies:**
```bash
cd backend
go mod download
```

**Environment setup:**
- Copy `.env.example` to `.env` and configure database credentials
- Required vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`

**Database migrations:**
```bash
# Install golang-migrate (macOS)
brew install golang-migrate

# Run migrations
cd backend
migrate -path migrations -database "postgres://USER:PASSWORD@localhost:5432/fintrax_db?sslmode=disable" up

# Create new migration
migrate create -ext sql -dir migrations -seq migration_name
```

**Run backend:**
```bash
cd backend
go run main.go
```

**Run backend tests:**
```bash
cd backend
go test ./...                    # All tests
go test ./helper/...             # Specific package
go test -v ./middleware/...      # Verbose output
```

### Frontend (Next.js)

**Install dependencies:**
```bash
cd frontend
npm install
```

**Run development server:**
```bash
cd frontend
npm run dev
```

**Other commands:**
```bash
npm run build      # Production build
npm run start      # Run production server
npm run lint       # Lint code
npm test           # Run tests
```

## Architecture

### Backend Structure

The backend follows a layered MVC-style architecture:

- **`main.go`**: Entry point - initializes DB connection, runs migrations, sets up Gin router with CORS and middleware
- **`database/`**: GORM database connection setup (`DB` is the global database instance)
- **`models/`**: GORM models (User, Todo, Finance, Transactions, Savings, Loans, etc.)
- **`controllers/`**: Request handlers - business logic lives here (userController, todoController, dashboardController)
- **`routes/`**: Route registration - groups endpoints by domain (UserRoute, TodoRoute)
- **`middleware/`**:
  - `authorization.go`: JWT validation, extracts Bearer token and sets `user_id` in context
  - `recovery.go`: Global panic recovery
- **`helper/`**: Utilities for JWT, password hashing (bcrypt), mail, and response formatting
- **`migrations/`**: SQL migration files (up/down) - managed via golang-migrate
- **`constants/`**: App-wide constants (APP_NAME, APP_PORT)

**Module name**: `fintrax-backend` (import paths like `fintrax-backend/controllers`)

### Frontend Structure

Built with Next.js 15 App Router using TypeScript and Tailwind CSS 4.

- **`src/app/`**: Next.js App Router pages
  - Authentication pages: `/login`, `/register`, `/forgot-password`, `/reset-password`
  - `/projects`: Project management view
  - Uses `layout.tsx` for shared layout
- **`src/components/`**: Reusable React components
  - `Dashboard/`, `Task/`, `Project/`: Feature-specific components
  - `Fields/`: Form input components
  - `AuthWrapper.tsx`: Authentication wrapper
  - `FormWrapper.tsx`, `BackgroundEffect.tsx`: UI wrappers
  - `svg.tsx`: Reusable SVG component utility
- **`src/lib/`**: Core utilities
  - `store.ts`: Zustand state management (projects, tasks, UI state)
  - `api.ts`: API client with centralized request handling (login, register, OTP, password reset)
  - `financeStore.ts`: Finance-specific state
- **`src/constants/`**: TypeScript interfaces and constants
- **`src/services/`**: Service layer for API calls
- **`src/utils/`**: Utility functions (includes test file `formatters.test.ts`)
- **`middleware.ts`**: Next.js middleware (currently minimal, configured for auth routes)

**State management**: Zustand store (`useAppStore`) manages projects, tasks, modals, and view state globally

**API integration**:
- Base URL from `NEXT_PUBLIC_API_URL` env var or defaults to `/api`
- API client in `src/lib/api.ts` handles authentication endpoints
- Backend runs on different port - ensure CORS is configured

### Authentication Flow

1. **Backend**: JWT-based auth
   - Register → Generate OTP → Verify email
   - Login returns JWT token
   - Forgot password → Generate OTP → Reset password
   - Protected routes use `middleware.Authorization()` to validate Bearer token
   - JWT helpers in `helper/jwtHelper.go`

2. **Frontend**:
   - API calls in `src/lib/api.ts`
   - Middleware in `middleware.ts` (currently configured but minimal)
   - `AuthWrapper.tsx` component for protected routes

### Database

- **ORM**: GORM with PostgreSQL driver
- **Connection**: Global `database.DB` instance
- **Migrations**: SQL files in `backend/migrations/` with up/down versions
- Migrations run automatically on app start in `main.go`

## Key Patterns

1. **Backend responses**: Use `helper.Response()` for consistent JSON responses with status, message, data, and errors
2. **Error handling**:
   - Backend uses panic recovery middleware
   - Frontend API client throws errors with message extraction
3. **Frontend forms**: Use components from `src/components/Fields/` for consistent form inputs
4. **State updates**: Zustand actions for all state mutations (don't mutate state directly)
5. **Testing**: Both backend (Go tests) and frontend (Node test runner with ts-node) have test infrastructure

## Important Notes

- Backend migrations run automatically on startup - ensure database is accessible before running
- Frontend uses Turbopack for faster dev builds (`--turbopack` flag)
- JWT secrets must be configured in backend `.env`
- Module imports in Go use `fintrax-backend/` prefix
- Frontend uses Next.js 15 App Router (not Pages Router)
