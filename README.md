# Fintrax

> An all-in-one application for task management, finance tracking, budgeting, and goal tracking

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.23.0-blue)](https://golang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue)](https://www.postgresql.org/)

Fintrax is a comprehensive productivity and finance management platform that helps you organize your tasks, track your finances, manage budgets, and achieve your goals - all in one place.

## ✨ Features

### 📋 Task Management
- **Full CRUD Operations** - Create, read, update, and delete tasks
- **Kanban Board** - Drag-and-drop task management across different columns
- **Calendar View** - Visualize tasks on a calendar
- **Task Hierarchy** - Create parent tasks and subtasks
- **Task Properties** - Priority levels (0-5), status tracking, due dates
- **Task Tags** - Categorize tasks with customizable tags
- **Roadmaps** - Long-term project planning with progress tracking

### 💰 Finance Management
- **Balance Tracking** - Monitor your overall financial balance
- **Transactions** - Track income and expenses by category
- **Savings Goals** - Multiple savings types (FD/RD, SIP, PPF, NPS, MF, Gold)
- **Loan Management** - Track loans with amount, rate, term, and payments
- **Dashboard** - Quick overview of financial status and tasks

### 🔐 Authentication & Security
- **User Registration** - Email-based signup with verification
- **Email Verification** - OTP-based email verification system
- **Secure Login** - JWT token-based authentication (24-hour expiry)
- **Password Management** - Forgot password and reset password flows
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Comprehensive validation and sanitization

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.4.1 with React 19.1.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4.1.11
- **State Management:** Zustand 5.0.6
- **Icons:** Lucide React 0.534.0
- **Build Tool:** Turbopack

### Backend
- **Language:** Go 1.23.0
- **Framework:** Gin 1.10.0 (REST API)
- **ORM:** GORM 1.25.10
- **Database:** PostgreSQL (via pgx v5.5.5)
- **Authentication:** JWT (golang-jwt/jwt/v5)
- **Migrations:** golang-migrate v4.18.3
- **Password Hashing:** bcrypt
- **Testing:** Testify v1.10.0

## 📁 Project Structure

```
fintrax/
├── frontend/              # Next.js React application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # State management & API utilities
│   │   ├── constants/    # Type definitions & constants
│   │   └── utils/        # Utility functions
│   └── package.json
│
└── backend/              # Go REST API server
    ├── main.go           # Application entry point
    ├── controllers/      # Business logic handlers
    ├── models/           # Data models
    ├── routes/           # API route definitions
    ├── middleware/       # Request processing middleware
    ├── database/         # Database connection
    ├── helper/           # Utility functions
    ├── migrations/       # Database schema migrations
    ├── constants/        # Application constants
    └── go.mod
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Go** 1.23.0+
- **PostgreSQL** 12+
- **Git**

### Database Setup

1. Create a PostgreSQL database:
```bash
createdb fintrax_db
```

2. Create a PostgreSQL user (if needed):
```sql
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fintrax_db TO your_user;
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Go dependencies:
```bash
go mod download
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=fintrax_db
GIN_MODE=debug
JWT_SECRET=your_super_secret_jwt_key_change_this
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

**Note on Email Configuration:**
- For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- Go to your Google Account → Security → 2-Step Verification → App passwords
- Generate a new app password and use it in the `EMAIL_PASSWORD` field

5. Run database migrations:
```bash
# Migrations run automatically when you start the server
go run main.go
```

6. Start the backend server:
```bash
go run main.go
```

The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file (if needed):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register
```http
POST /api/user/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Rate Limit:** 5 requests per minute per IP

#### Verify Email
```http
POST /api/user/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "OTP": 123456
}
```

**Rate Limit:** 5 requests per minute per IP

#### Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Rate Limit:** 5 requests per minute per IP

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user_id": 1,
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

#### Generate OTP
```http
POST /api/user/generate-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Rate Limit:** 3 requests per 5 minutes per IP

#### Forgot Password
```http
POST /api/user/forgot-password
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "newPassword123",
  "otp": "123456"
}
```

**Rate Limit:** 5 requests per minute per IP

#### Reset Password (Authenticated)
```http
POST /api/user/reset-password
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "email": "john@example.com",
  "old_password": "oldPassword123",
  "new_password": "newPassword123"
}
```

**Rate Limit:** 5 requests per minute per IP

### Todo Endpoints (Requires Authentication)

All todo endpoints require JWT token in the Authorization header:
```
Authorization: Bearer {jwt_token}
```

**Rate Limit:** 100 requests per minute per IP

#### Create Todo
```http
POST /api/todo
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "task": "Complete project documentation",
  "description": "Write comprehensive README",
  "priority": 4,
  "status": 1
}
```

#### Get All Todos
```http
GET /api/todo
Authorization: Bearer {jwt_token}
```

#### Get Specific Todo
```http
GET /api/todo/:id
Authorization: Bearer {jwt_token}
```

#### Update Todo
```http
PATCH /api/todo/:id
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "task": "Updated task title",
  "status": 2
}
```

#### Delete Todo
```http
DELETE /api/todo/:id
Authorization: Bearer {jwt_token}
```

### Dashboard Endpoint

#### Get Dashboard Stats
```http
GET /api/dashboard
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "message": "Dashboard retrieved successfully",
  "data": {
    "total_balance": 10000,
    "total_todo": 15,
    "active_roadmaps": 3
  }
}
```

**Rate Limit:** 100 requests per minute per IP

## 🔒 Security Features

### Rate Limiting
The API implements three levels of rate limiting:

- **General Endpoints:** 100 requests per minute per IP
- **Authentication Endpoints:** 5 requests per minute per IP
- **OTP Generation:** 3 requests per 5 minutes per IP

Rate limits are enforced at the IP address level to prevent abuse and brute force attacks.

### Input Validation & Sanitization
All user inputs are validated and sanitized on the frontend to prevent:
- XSS (Cross-Site Scripting) attacks
- SQL injection
- Invalid data submission

#### Password Requirements
- Minimum 8 characters
- Maximum 128 characters
- Must contain at least one lowercase letter
- Must contain at least one uppercase letter
- Must contain at least one number
- Must contain at least one special character
- Cannot be a common weak password

#### Username Requirements
- Minimum 3 characters
- Maximum 30 characters
- Must start with a letter
- Can only contain letters, numbers, underscores, and hyphens

#### Email Requirements
- Must be a valid RFC 5322 compliant email address
- Maximum 254 characters

### Authentication
- JWT tokens with 24-hour expiry
- Bcrypt password hashing
- OTP-based email verification (5-minute validity)
- OTP regeneration delay (1 minute) to prevent spam

## 🧪 Testing

### Backend Tests
Run backend tests:
```bash
cd backend
go test ./... -v
```

Test coverage includes:
- JWT helper functions
- Password hashing and verification
- Response formatting
- Authorization middleware
- Recovery middleware

### Frontend Tests
Run frontend tests:
```bash
cd frontend
npm test
# or
yarn test
```

Test coverage includes:
- Utility formatters (currency, percentage)

## 🗃️ Database Schema

The application uses 13 database tables:

| Table | Purpose |
|-------|---------|
| `users` | User accounts and authentication |
| `todos` | Tasks and subtasks |
| `finance` | User financial overview |
| `transactions` | Income and expense tracking |
| `savings` | Savings goals |
| `loans` | Loan tracking |
| `roadmaps` | Long-term project plans |
| `notes` | Task notes and documentation |
| `tags` | Task categorization tags |
| `todo_tags` | Task-tag relationships |
| `resources` | Task resources (links, videos) |

All tables support soft deletes via the `deleted_at` column.

## 🐛 Known Issues

- Finance features are partially implemented (models exist but limited API endpoints)
- Project system exists only in frontend state (not persisted to backend)
- Some endpoints lack comprehensive error handling

## 🗺️ Roadmap

### High Priority
- [ ] Complete finance API integration (savings, loans, transactions)
- [ ] Connect projects to backend persistence
- [ ] Add comprehensive error logging system
- [ ] Implement API documentation (Swagger/OpenAPI)

### Medium Priority
- [ ] Expand test coverage for controllers and models
- [ ] Add advanced filtering and search capabilities
- [ ] Implement real-time features (WebSockets)
- [ ] Add analytics and reporting features

### Low Priority
- [ ] Docker deployment configuration
- [ ] CI/CD pipeline setup
- [ ] Mobile app (React Native)
- [ ] Data export functionality

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- **Go:** Follow [Effective Go](https://golang.org/doc/effective_go) guidelines
- **TypeScript/React:** Follow [Airbnb Style Guide](https://github.com/airbnb/javascript)
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing React framework
- Gin framework for the fast Go web framework
- GORM team for the excellent ORM
- All open source contributors

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js and Go**
