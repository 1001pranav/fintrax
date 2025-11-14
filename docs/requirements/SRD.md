# Software Requirements Document (SRD)
## Fintrax - Integrated Productivity and Finance Management Platform

**Version:** 1.0
**Date:** November 13, 2025
**Status:** Draft

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Architecture](#5-system-architecture)
6. [Database Schema](#6-database-schema)
7. [API Specifications](#7-api-specifications)
8. [User Interface Requirements](#8-user-interface-requirements)
9. [Security Requirements](#9-security-requirements)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Document (SRD) specifies the functional and non-functional requirements for **Fintrax**, an integrated platform that combines productivity management (task tracking, project management, learning roadmaps) with comprehensive personal finance management (budgeting, expense tracking, savings, loans, and investments).

### 1.2 Scope
Fintrax is a full-stack web application designed to help users:
- Manage tasks, projects, and learning roadmaps with hierarchical organization
- Track personal finances including income, expenses, savings, and loans
- Visualize financial health and productivity metrics through interactive dashboards
- Organize learning resources and create structured learning paths
- Collaborate on projects with team members (future scope)

### 1.3 Target Audience
- **Primary Users:** Individual professionals, students, freelancers, and entrepreneurs
- **Secondary Users:** Small teams and families managing shared finances and projects
- **User Personas:**
  - Young professionals balancing career development with financial planning
  - Students tracking learning goals and managing student loans/budgets
  - Freelancers managing multiple projects and irregular income streams
  - Entrepreneurs planning business roadmaps while tracking startup finances

### 1.4 Definitions and Acronyms

| Term | Definition |
|------|------------|
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| OTP | One-Time Password |
| SPA | Single Page Application |
| GORM | Go Object-Relational Mapping |
| UI/UX | User Interface / User Experience |
| SRD | Software Requirements Document |

---

## 2. System Overview

### 2.1 Product Description
Fintrax is a unified platform that eliminates the need for separate productivity and finance applications. It provides:
- **Task & Project Management:** Hierarchical task organization with subtasks, priorities, and status tracking
- **Learning Roadmaps:** Structured learning paths with resource management and progress tracking
- **Financial Management:** Comprehensive tracking of income, expenses, savings, loans, and investments
- **Analytics Dashboard:** Real-time insights into productivity and financial health
- **Resource Library:** Centralized storage for learning materials (links, notes, audio, video)

### 2.2 System Context
**Technology Stack:**
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand
- **Backend:** Go 1.23+, Gin framework, GORM ORM
- **Database:** PostgreSQL with automated migrations
- **Authentication:** JWT-based with OTP email verification
- **Deployment:** Containerized deployment (Docker-ready architecture)

### 2.3 User Characteristics
- **Technical Proficiency:** Basic to intermediate computer literacy
- **Age Range:** 18-45 years
- **Usage Patterns:** Daily active users requiring quick access to tasks and financial data
- **Device Usage:** Primarily desktop/laptop, mobile-responsive design

---

## 3. Functional Requirements

### 3.1 User Management Module

#### 3.1.1 User Registration
**FR-UM-001:** The system shall allow users to register with username, email, and password.
- **Input:** Username (3-50 chars), valid email, password (min 8 chars)
- **Output:** User account created with "Inactive" status, JWT token generated
- **Validation:** Email uniqueness, password strength requirements
- **Business Rule:** Upon registration, a Finance record is automatically created with zero balance

**FR-UM-002:** The system shall send OTP to user's email for verification.
- **OTP Validity:** 5 minutes
- **OTP Format:** 4-digit numeric code (1000-9999)
- **Rate Limiting:** Maximum 1 OTP generation per minute

#### 3.1.2 Email Verification
**FR-UM-003:** Users must verify email with OTP before accessing the application.
- **Input:** Email, 6-digit OTP
- **Output:** User status changed to "Active"
- **Validation:** OTP matches and is not expired
- **Security:** Maximum 3 OTP attempts before lockout

#### 3.1.3 User Authentication
**FR-UM-004:** The system shall provide secure login with email and password.
- **Input:** Email, password
- **Output:** JWT access token, user details (ID, username, email)
- **Session Management:** Token-based authentication with configurable expiry
- **Error Handling:** Clear messages for invalid credentials or unverified accounts

**FR-UM-005:** The system shall support password reset via OTP.
- **Workflow:** Generate OTP → Verify OTP → Set new password
- **Security:** Old password hash is replaced, all existing sessions remain valid

**FR-UM-006:** The system shall allow authenticated users to change password.
- **Input:** Email, old password, new password
- **Validation:** Old password verification before update

#### 3.1.4 User Status Management
**User Statuses:**
- **Active:** Verified users with full access
- **Inactive:** Newly registered, unverified users
- **Banned:** Suspended accounts (admin action)
- **Deleted:** Soft-deleted accounts (data retained for compliance)

---

### 3.2 Task Management Module

#### 3.2.1 Task CRUD Operations
**FR-TM-001:** Users shall create tasks with comprehensive details.
- **Required Fields:** Title
- **Optional Fields:** Description, priority (1-5), start date, end date, due days, status
- **Hierarchical Support:** Tasks can have parent-child relationships (subtasks)
- **Roadmap Association:** Tasks can be linked to learning roadmaps

**FR-TM-002:** Users shall view all their tasks with filtering and sorting.
- **Filters:** Status, priority, roadmap association, date range
- **Sorting:** By priority, due date, created date
- **Display:** Kanban board, list view, calendar view

**FR-TM-003:** Users shall update task details and status.
- **Editable Fields:** All task fields except user association
- **Status Transitions:** Not Started → In Progress → Completed (with intermediate states)

**FR-TM-004:** Users shall soft-delete tasks.
- **Behavior:** Status changed to "Deleted", DeletedAt timestamp set
- **Data Retention:** Deleted tasks retained in database for potential recovery
- **Cascade:** Deleting parent task sets ParentID of subtasks to NULL

#### 3.2.2 Task Status Workflow
**Status Values:**
1. **Not Started (1):** Task created but not begun
2. **In Progress (2):** Actively being worked on
3. **On Hold (3):** Temporarily paused
4. **Cancelled (4):** Abandoned without completion
5. **Deleted (5):** Soft-deleted
6. **Completed (6):** Successfully finished

#### 3.2.3 Task Attributes
**Priority Levels:** 1 (Highest) to 5 (Lowest), default: 5
**Due Days:** Estimated days to complete (0 = no estimate)
**Dates:** Start date and end date for time-bound tasks
**Parent-Child Relationships:** Unlimited nesting for subtask hierarchies

#### 3.2.4 Task Resources
**FR-TM-005:** Users shall attach multiple resources to tasks.
- **Resource Types:**
  - Link (1): External URLs
  - Audio (2): Audio file references
  - Video (3): Video file references
  - Notes (4): Text notes
- **MiscID:** Custom identifier for external system integration

#### 3.2.5 Task Notes
**FR-TM-006:** Each task can have associated notes.
- **Note Structure:** ID, text content
- **Relationship:** One-to-one (one note per task)
- **Usage:** Detailed explanations, meeting notes, context

---

### 3.3 Project Management Module

#### 3.3.1 Project Creation
**FR-PM-001:** Users shall create projects to group related tasks.
- **Required Fields:** Name, description
- **Optional Fields:** Color theme (from predefined palette), cover image, status
- **Auto-Calculation:** Task count derived from associated tasks
- **Status Options:** Not Started, In Progress, Completed, On Hold, Cancelled

#### 3.3.2 Project Visualization
**FR-PM-002:** The system shall provide project dashboard with statistics.
- **Metrics:** Total tasks, completed tasks, in-progress tasks, task distribution by priority
- **Views:** Card view, list view
- **Color Coding:** Custom color themes for visual organization

**FR-PM-003:** Users shall view tasks within project context.
- **Kanban Board:** Columns for todo, in-progress, done
- **Calendar View:** Tasks plotted by start/end dates
- **Filtering:** By tags, priority, assignee (future)

#### 3.3.3 Project Settings
**FR-PM-004:** Users shall customize project appearance and behavior.
- **Color Themes:** 8 predefined colors (Blue, Green, Amber, Red, Purple, Cyan, Lime, Orange)
- **Status Management:** Update project status independently of tasks
- **Templates:** Save project as template for future reuse (future scope)

---

### 3.4 Learning Roadmap Module

#### 3.4.1 Roadmap Creation
**FR-LR-001:** Users shall create learning roadmaps with timeline and goals.
- **Required Fields:** Name, start date, end date
- **Progress Tracking:** Percentage completion (0-100%)
- **Task Association:** Multiple tasks can be linked to a roadmap

**FR-LR-002:** Roadmaps shall automatically calculate progress based on associated tasks.
- **Calculation:** (Completed tasks / Total tasks) × 100
- **Display:** Progress bar, percentage indicator
- **Updates:** Real-time recalculation when task status changes

#### 3.4.2 Roadmap Visualization
**FR-LR-003:** Users shall view roadmap timeline with milestones.
- **Timeline View:** Gantt-style visualization showing task distribution
- **Milestone Markers:** Key dates and achievements
- **Color Coding:** Tasks colored by priority or status

#### 3.4.3 Roadmap-Task Integration
**FR-LR-004:** Tasks marked as "is_roadmap = true" are roadmap-specific.
- **Filtering:** Dashboard shows only active roadmaps
- **Association:** Tasks reference roadmap via RoadmapID foreign key
- **Cascade:** Deleting roadmap sets RoadmapID to NULL in tasks

---

### 3.5 Finance Management Module

#### 3.5.1 Finance Overview
**FR-FM-001:** Each user shall have a finance profile created automatically.
- **Attributes:** Balance (current total), TotalDebt (sum of loans)
- **Initialization:** Both set to 0.00 upon registration
- **Calculation:** Updated based on transactions, savings, and loans

#### 3.5.2 Transaction Management
**FR-FM-002:** Users shall record financial transactions.
- **Required Fields:** Source, amount, type (income/expense), transaction type, date
- **Optional Fields:** Category, notes
- **Transaction Types:**
  1. **Income (1):** Salary, freelance, investments
  2. **Expense (2):** Bills, purchases, subscriptions
  3. **Saving (3):** Deposits to savings accounts
  4. **Debt (4):** Loan payments, credit card payments
  5. **Investment (5):** Stock purchases, mutual funds

**FR-FM-003:** Transactions shall update finance balance automatically.
- **Income/Saving:** Balance += Amount
- **Expense/Debt:** Balance -= Amount
- **Investment:** Balance -= Amount (treated as expense)

#### 3.5.3 Savings Management
**FR-FM-004:** Users shall create and track savings instruments.
- **Attributes:** Name, amount, interest rate, user association
- **Savings Types:**
  1. **FD/RD (1):** Fixed/Recurring Deposits
  2. **SIP (2):** Systematic Investment Plans
  3. **PPF (3):** Public Provident Fund
  4. **NPS (4):** National Pension Scheme
  5. **Mutual Funds (5)**
  6. **Gold (6):** Physical/Digital gold investments

**FR-FM-005:** Savings shall show maturity calculations and interest earnings.
- **Display:** Principal amount, interest rate, maturity date, estimated returns
- **Alerts:** Notifications for maturity dates (future scope)

#### 3.5.4 Loan Management
**FR-FM-006:** Users shall track loans with amortization schedules.
- **Required Fields:** Name, total amount, interest rate, term (months), duration (payment frequency)
- **Calculated Fields:** Premium amount (monthly payment)
- **Formula:** EMI calculation using reducing balance method
- **Total Debt Tracking:** Sum of all active loans reflected in Finance.TotalDebt

**FR-FM-007:** The system shall calculate loan EMI and payment schedules.
- **EMI Formula:** `P × r × (1+r)^n / ((1+r)^n - 1)`
  - P = Principal loan amount
  - r = Monthly interest rate (annual rate / 12 / 100)
  - n = Loan term in months
- **Display:** Amortization table, total interest, remaining balance

#### 3.5.5 Transaction Categories
**FR-FM-008:** Transactions shall be categorized for analysis.
- **Default Categories:** Housing, Food, Transportation, Entertainment, Healthcare, Education, Utilities, Shopping, Travel, Other
- **Custom Categories:** Users can create custom categories (future scope)
- **Reporting:** Expense breakdown by category

---

### 3.6 Dashboard and Analytics Module

#### 3.6.1 Dashboard Overview
**FR-DA-001:** Users shall have a unified dashboard showing key metrics.
- **Financial Metrics:**
  - Total Balance
  - Monthly Income vs Expenses
  - Savings Growth Rate
  - Debt-to-Income Ratio
- **Productivity Metrics:**
  - Total Active Tasks
  - Completed Tasks (this week/month)
  - Active Roadmaps Count
  - Project Completion Rate

**FR-DA-002:** Dashboard shall display recent activity feed.
- **Activities:** Recent tasks, transactions, roadmap updates
- **Time Grouping:** Today, Yesterday, This Week, Earlier
- **Limit:** Latest 20 activities

#### 3.6.2 Financial Analytics
**FR-DA-003:** The system shall provide financial reports and visualizations.
- **Charts:**
  - Income vs Expense trend (line chart)
  - Expense breakdown by category (pie chart)
  - Savings growth over time (area chart)
  - Loan repayment progress (bar chart)
- **Time Periods:** Daily, Weekly, Monthly, Yearly, Custom range

**FR-DA-004:** Users shall export financial reports.
- **Formats:** PDF, CSV, Excel (future scope)
- **Content:** Transaction history, category summaries, tax reports

#### 3.6.3 Productivity Analytics
**FR-DA-005:** The system shall visualize task completion trends.
- **Metrics:**
  - Tasks completed per day/week/month
  - Average task completion time
  - Priority distribution
  - Roadmap progress over time
- **Burndown Charts:** For projects with deadlines

---

### 3.7 Notes and Resources Module

#### 3.7.1 Notes Management
**FR-NR-001:** Users shall create standalone notes or attach to tasks/transactions.
- **Structure:** ID, text content
- **Usage:** Meeting notes, ideas, reminders, transaction details
- **Associations:** Can be linked to tasks or transactions

#### 3.7.2 Resources Management
**FR-NR-002:** Users shall organize learning resources by type.
- **Resource Types:** Links, Audio files, Video files, Notes
- **Task Association:** Each resource linked to a specific task
- **External Integration:** MiscID for referencing external content management systems

**FR-NR-003:** The system shall preview and validate resource links.
- **Link Validation:** Check URL accessibility (future scope)
- **Preview:** Generate thumbnail/metadata for links (future scope)
- **Categorization:** Tag resources for easy discovery

---

### 3.8 Notification Module (Future Scope)

**FR-NT-001:** Users shall receive notifications for important events.
- **Event Types:**
  - Task due date approaching
  - Loan payment due
  - Savings maturity date
  - Roadmap milestone reached
  - Budget limit exceeded
- **Delivery Channels:** Email, in-app notifications, push notifications (PWA)

**FR-NT-002:** Users shall configure notification preferences.
- **Settings:** Enable/disable by type, frequency, quiet hours
- **Digest:** Daily/weekly summary emails

---

### 3.9 Search and Filter Module

**FR-SF-001:** The system shall provide global search across all entities.
- **Search Scope:** Tasks, projects, roadmaps, transactions, notes
- **Search Algorithm:** Full-text search with relevance ranking
- **Filters:** By type, date range, status, amount range (for transactions)

**FR-SF-002:** Users shall save custom filter presets.
- **Examples:** "High priority tasks this week", "Monthly expenses > $1000"
- **Quick Access:** Saved filters in sidebar for one-click application

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

**NFR-PF-001:** The system shall load dashboard within 2 seconds on standard broadband.
- **Target:** < 2s initial page load, < 500ms subsequent navigation
- **Optimization:** Code splitting, lazy loading, caching strategies

**NFR-PF-002:** API responses shall complete within 500ms for 95% of requests.
- **Database Queries:** Optimized with proper indexing
- **Pagination:** Default 50 items per page, configurable up to 100

**NFR-PF-003:** The system shall support up to 10,000 tasks per user without performance degradation.
- **Scalability:** Efficient query patterns, database indexing
- **Archival:** Soft-deleted items moved to archive table after 90 days (future scope)

### 4.2 Security Requirements

**NFR-SC-001:** All passwords shall be hashed using bcrypt with cost factor 10.
- **Implementation:** helper.HashPassword() and helper.CheckPasswordHash()

**NFR-SC-002:** JWT tokens shall expire after 24 hours.
- **Refresh Strategy:** Token refresh mechanism (future scope)
- **Revocation:** Token blacklist for logout (future scope)

**NFR-SC-003:** All API endpoints (except auth) shall require valid JWT authentication.
- **Middleware:** Authorization() middleware on protected routes
- **Error Handling:** 401 Unauthorized for invalid/missing tokens

**NFR-SC-004:** The system shall implement rate limiting to prevent abuse.
- **Login Attempts:** Maximum 5 failed attempts per hour per IP
- **OTP Generation:** 1 request per minute per user
- **API Calls:** 100 requests per minute per user (future scope)

**NFR-SC-005:** All data transmission shall use HTTPS/TLS encryption.
- **Certificate:** Valid SSL/TLS certificate in production
- **Headers:** Security headers (CSP, X-Frame-Options, HSTS)

**NFR-SC-006:** Sensitive data shall never be logged or exposed in error messages.
- **Exclusions:** Passwords, JWT tokens, OTPs
- **Error Messages:** Generic messages to users, detailed logs for admins

### 4.3 Usability Requirements

**NFR-US-001:** The UI shall be responsive and mobile-friendly.
- **Breakpoints:** Mobile (320-767px), Tablet (768-1023px), Desktop (1024px+)
- **Touch-Optimized:** Large buttons, swipe gestures

**NFR-US-002:** The system shall support modern browsers.
- **Supported:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JavaScript

**NFR-US-003:** The interface shall follow WCAG 2.1 Level AA accessibility guidelines.
- **Features:** Keyboard navigation, screen reader support, color contrast ratios
- **ARIA:** Proper ARIA labels for interactive elements

**NFR-US-004:** The system shall provide contextual help and tooltips.
- **Onboarding:** First-time user tutorial
- **Tooltips:** Explanations for complex features

### 4.4 Reliability Requirements

**NFR-RL-001:** The system shall maintain 99.5% uptime.
- **Downtime:** Maximum 3.65 hours per month planned maintenance
- **Monitoring:** Health check endpoints, uptime monitoring

**NFR-RL-002:** Database transactions shall ensure ACID properties.
- **Implementation:** PostgreSQL transactions, rollback on errors
- **Consistency:** Foreign key constraints, check constraints

**NFR-RL-003:** The system shall recover gracefully from failures.
- **Error Handling:** Global panic recovery middleware
- **Fallbacks:** Default values for missing data, retry mechanisms

### 4.5 Maintainability Requirements

**NFR-MT-001:** Code shall follow established style guides.
- **Go:** Official Go conventions, gofmt
- **TypeScript/React:** ESLint configuration, Prettier

**NFR-MT-002:** The system shall include comprehensive API documentation.
- **Format:** OpenAPI/Swagger specification
- **Examples:** Request/response samples for each endpoint

**NFR-MT-003:** Database schema changes shall use migration scripts.
- **Tool:** golang-migrate
- **Versioning:** Sequential migration files with up/down scripts

### 4.6 Scalability Requirements

**NFR-SC-007:** The database shall support horizontal scaling via read replicas.
- **Architecture:** Primary for writes, replicas for reads
- **Load Balancing:** Connection pooling, read/write splitting

**NFR-SC-008:** The application shall be stateless for horizontal scaling.
- **Sessions:** JWT tokens (no server-side session storage)
- **Deployment:** Containerized with Docker, orchestrated with Kubernetes (future scope)

---

## 5. System Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Next.js 15 Frontend (React 19 + TypeScript)        │    │
│  │  - App Router (SSR/CSR)                             │    │
│  │  - Zustand State Management                         │    │
│  │  - Tailwind CSS 4                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Go Backend (Gin Framework)                         │    │
│  │  ┌────────────┬────────────┬────────────────────┐   │    │
│  │  │ Controllers│ Middleware │ Helper Functions   │   │    │
│  │  ├────────────┼────────────┼────────────────────┤   │    │
│  │  │ - User     │ - Auth     │ - JWT              │   │    │
│  │  │ - Todo     │ - Recovery │ - Password Hash    │   │    │
│  │  │ - Finance  │ - CORS     │ - Response Format  │   │    │
│  │  │ - Roadmap  │            │ - Email (future)   │   │    │
│  │  └────────────┴────────────┴────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ GORM ORM
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  PostgreSQL Database                                │    │
│  │  - Users, Finance, Transactions                     │    │
│  │  - Todos, Roadmaps, Resources, Notes               │    │
│  │  - Savings, Loans                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Frontend Architecture

**Component Hierarchy:**
```
App (layout.tsx)
├── Public Routes
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   └── Reset Password
└── Protected Routes (AuthWrapper)
    ├── Dashboard
    │   ├── WelcomeHero
    │   ├── ProjectStats
    │   └── RecentTasks
    ├── Projects
    │   ├── ProjectCardComponent
    │   ├── ProjectModelComponent
    │   └── ProjectSettings
    └── Tasks
        ├── Kanban
        ├── CalendarView
        ├── TaskCard
        └── TaskModel
```

**State Management (Zustand):**
- **useAppStore:** Projects, tasks, selected entities, modal states, view preferences
- **useFinanceStore:** Transactions, savings, loans, balance calculations

### 5.3 Backend Architecture

**Layered Structure:**
1. **Routes Layer:** Group endpoints by domain (UserRoute, TodoRoute, etc.)
2. **Middleware Layer:** Authentication, recovery, CORS
3. **Controller Layer:** Business logic, request validation, response formatting
4. **Model Layer:** GORM models with relationships
5. **Database Layer:** Connection management, migrations
6. **Helper Layer:** Reusable utilities (JWT, bcrypt, email, response)

**Request Flow:**
```
Client Request
  → Gin Router
  → Middleware (Auth, Recovery)
  → Controller Handler
  → Database Query (GORM)
  → Response Formatter
  → JSON Response
```

---

## 6. Database Schema

### 6.1 Entity Relationship Diagram

**Key Relationships:**
- **Users** (1) → (N) **Todos:** One user has many tasks
- **Users** (1) → (1) **Finance:** One user has one finance profile
- **Todos** (1) → (N) **Todos:** Self-referencing for subtasks (ParentID)
- **Todos** (N) → (1) **Roadmap:** Many tasks belong to one roadmap (optional)
- **Todos** (1) → (N) **Resources:** One task has many resources
- **Todos** (1) → (1) **Notes:** One task has one note (optional)
- **Transactions** (1) → (1) **Notes:** One transaction has one note (optional)

### 6.2 Table Specifications

#### Users Table
```sql
Column       Type         Constraints
──────────────────────────────────────────────────
ID           SERIAL       PRIMARY KEY
Username     VARCHAR(255) NOT NULL
Email        VARCHAR(255) NOT NULL UNIQUE
Password     VARCHAR(255) NOT NULL
OTP          INTEGER
OTPTime      TIMESTAMP
OTPTries     INTEGER      DEFAULT 0
Status       VARCHAR(20)  DEFAULT 'Inactive'
CreatedAt    TIMESTAMP    NOT NULL
UpdatedAt    TIMESTAMP    NOT NULL
DeletedAt    TIMESTAMP    NULL
```

#### Finance Table
```sql
Column       Type         Constraints
──────────────────────────────────────────────────
ID           SERIAL       PRIMARY KEY
Balance      DECIMAL      NOT NULL DEFAULT 0
TotalDebt    DECIMAL      NOT NULL DEFAULT 0
UserID       INTEGER      NOT NULL REFERENCES Users(ID)
Status       INTEGER      DEFAULT 1 CHECK (status >= 1 AND <= 6)
CreatedAt    TIMESTAMP    NOT NULL
UpdatedAt    TIMESTAMP    NOT NULL
```

#### Todos Table
```sql
Column       Type         Constraints
──────────────────────────────────────────────────
ID           SERIAL       PRIMARY KEY
Task         VARCHAR(255) NOT NULL
Description  TEXT
IsRoadmap    BOOLEAN      DEFAULT FALSE
Priority     INTEGER      DEFAULT 5 CHECK (priority >= 0 AND <= 5)
DueDays      INTEGER      DEFAULT 0
StartDate    TIMESTAMP    NULL
EndDate      TIMESTAMP    NULL
Status       INTEGER      DEFAULT 1 CHECK (status >= 1 AND <= 6)
ParentID     INTEGER      NULL REFERENCES Todos(ID) ON DELETE SET NULL
UserID       INTEGER      NOT NULL REFERENCES Users(ID) ON DELETE CASCADE
RoadmapID    INTEGER      NULL REFERENCES Roadmap(ID) ON DELETE SET NULL
NotesID      INTEGER      NULL REFERENCES Notes(ID) ON DELETE SET NULL
CreatedAt    TIMESTAMP    NOT NULL
UpdatedAt    TIMESTAMP    NOT NULL
DeletedAt    TIMESTAMP    NULL
```

#### Roadmap Table
```sql
Column       Type         Constraints
──────────────────────────────────────────────────
ID           SERIAL       PRIMARY KEY
Name         VARCHAR(255) NOT NULL
StartDate    TIMESTAMP    NOT NULL
EndDate      TIMESTAMP    NOT NULL
Progress     DECIMAL      DEFAULT 0.0
Status       INTEGER      DEFAULT 1 CHECK (status >= 1 AND <= 6)
CreatedAt    TIMESTAMP    NOT NULL
UpdatedAt    TIMESTAMP    NOT NULL
```

#### Transactions Table
```sql
Column            Type         Constraints
──────────────────────────────────────────────────
ID                SERIAL       PRIMARY KEY
Source            VARCHAR(150) NOT NULL
Amount            DECIMAL      NOT NULL
Type              INTEGER      DEFAULT 1 CHECK (type >= 1 AND <= 2)
TransactionType   INTEGER      DEFAULT 1 CHECK (transaction_type >= 1 AND <= 5)
Category          VARCHAR(100)
Date              TIMESTAMP    NOT NULL
NotesID           INTEGER      NULL REFERENCES Notes(ID) ON DELETE SET NULL
Status            INTEGER      DEFAULT 1 CHECK (status >= 1 AND <= 6)
CreatedAt         TIMESTAMP    NOT NULL
UpdatedAt         TIMESTAMP    NOT NULL
```

#### Savings Table
```sql
Column       Type         Constraints
──────────────────────────────────────────────────
ID           SERIAL       PRIMARY KEY
Name         VARCHAR(255) NOT NULL
Amount       DECIMAL      NOT NULL
Rate         DECIMAL      NOT NULL
UserID       INTEGER      NOT NULL REFERENCES Users(ID) ON DELETE SET NULL
Status       INTEGER      DEFAULT 1 CHECK (status >= 1 AND <= 6)
CreatedAt    TIMESTAMP    NOT NULL
UpdatedAt    TIMESTAMP    NOT NULL
```

#### Loans Table
```sql
Column         Type         Constraints
──────────────────────────────────────────────────
ID             SERIAL       PRIMARY KEY
Name           VARCHAR(255) NOT NULL
TotalAmount    DECIMAL      NOT NULL
Rate           DECIMAL      NOT NULL
Term           INTEGER      NOT NULL (months)
Duration       INTEGER      NOT NULL (payment frequency)
PremiumAmount  DECIMAL      NOT NULL (EMI)
UserID         INTEGER      NOT NULL REFERENCES Users(ID) ON DELETE SET NULL
Status         INTEGER      DEFAULT 1 CHECK (status >= 1 AND <= 6)
CreatedAt      TIMESTAMP    NOT NULL
UpdatedAt      TIMESTAMP    NOT NULL
```

#### Resources Table
```sql
Column       Type         Constraints
──────────────────────────────────────────────────
ID           SERIAL       PRIMARY KEY
Type         INTEGER      DEFAULT 1 CHECK (type >= 1 AND <= 4)
MiscID       INTEGER      DEFAULT 0
Link         VARCHAR(500) NULL
TodoID       INTEGER      NOT NULL REFERENCES Todos(ID) ON DELETE CASCADE
CreatedAt    TIMESTAMP    NOT NULL
UpdatedAt    TIMESTAMP    NOT NULL
```

#### Notes Table
```sql
Column       Type         Constraints
──────────────────────────────────────────────────
ID           SERIAL       PRIMARY KEY
Text         TEXT         NOT NULL
CreatedAt    TIMESTAMP    NOT NULL
UpdatedAt    TIMESTAMP    NOT NULL
```

### 6.3 Indexes and Performance Optimization

**Recommended Indexes:**
```sql
-- User lookups
CREATE INDEX idx_users_email ON Users(Email);

-- Task queries
CREATE INDEX idx_todos_user_id ON Todos(UserID);
CREATE INDEX idx_todos_status ON Todos(Status);
CREATE INDEX idx_todos_roadmap_id ON Todos(RoadmapID);
CREATE INDEX idx_todos_parent_id ON Todos(ParentID);

-- Transaction queries
CREATE INDEX idx_transactions_user_id ON Transactions(UserID);
CREATE INDEX idx_transactions_date ON Transactions(Date DESC);
CREATE INDEX idx_transactions_type ON Transactions(TransactionType);

-- Finance lookups
CREATE INDEX idx_finance_user_id ON Finance(UserID);

-- Resources
CREATE INDEX idx_resources_todo_id ON Resources(TodoID);
```

---

## 7. API Specifications

### 7.1 Base URL
**Development:** `http://localhost:80/api`
**Production:** `https://api.fintrax.com/api` (example)

### 7.2 Authentication Endpoints

#### POST /api/user/register
**Description:** Create new user account
**Authentication:** None
**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```
**Response (201 Created):**
```json
{
  "status": 201,
  "message": "User created successfully",
  "data": {
    "user_id": 42,
    "username": "john_doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

#### POST /api/user/verify-email
**Description:** Verify user email with OTP
**Request Body:**
```json
{
  "email": "john@example.com",
  "OTP": 1234
}
```
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Email verified successfully",
  "data": null,
  "error": null
}
```

#### POST /api/user/login
**Description:** Authenticate user and receive JWT
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 42,
    "email": "john@example.com",
    "username": "john_doe"
  },
  "error": null
}
```

#### POST /api/user/generate-otp
**Description:** Generate OTP for password reset or email verification
**Request Body:**
```json
{
  "email": "john@example.com"
}
```
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "OTP generated successfully",
  "data": {
    "otp": 5678
  },
  "error": null
}
```
**Note:** In production, OTP should be sent via email, not returned in response.

#### POST /api/user/forgot-password
**Description:** Reset password using OTP
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "NewSecureP@ss123",
  "otp": "5678"
}
```
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Password updated successfully",
  "data": null,
  "error": null
}
```

#### POST /api/user/reset-password
**Description:** Change password while authenticated
**Authentication:** Required (JWT)
**Request Body:**
```json
{
  "email": "john@example.com",
  "old_password": "CurrentP@ss123",
  "new_password": "NewSecureP@ss123"
}
```
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Password updated successfully",
  "data": null,
  "error": null
}
```

### 7.3 Task Management Endpoints

#### POST /api/todo
**Description:** Create new task
**Authentication:** Required (JWT)
**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive SRD for Fintrax",
  "priority": 1,
  "due_days": 5,
  "start_date": "2025-11-13T10:00:00Z",
  "end_date": "2025-11-18T18:00:00Z",
  "status": 1,
  "is_roadmap": false,
  "parent_id": null
}
```
**Response (201 Created):**
```json
{
  "status": 201,
  "message": "Todo created successfully",
  "data": {
    "task_id": 123,
    "title": "Complete project documentation",
    "description": "Write comprehensive SRD for Fintrax",
    "priority": 1,
    "due_days": 5,
    "start_date": "2025-11-13T10:00:00Z",
    "end_date": "2025-11-18T18:00:00Z",
    "status": 1,
    "is_roadmap": false,
    "parent_id": null
  },
  "error": null
}
```

#### GET /api/todo
**Description:** Get all tasks for authenticated user
**Authentication:** Required (JWT)
**Query Parameters:**
- `status` (optional): Filter by status (1-6)
- `priority` (optional): Filter by priority (1-5)
- `is_roadmap` (optional): Filter roadmap tasks (true/false)

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Todos fetched successfully",
  "data": [
    {
      "task_id": 123,
      "title": "Complete project documentation",
      "description": "Write comprehensive SRD for Fintrax",
      "priority": 1,
      "due_days": 5,
      "start_date": "2025-11-13T10:00:00Z",
      "end_date": "2025-11-18T18:00:00Z",
      "status": 2,
      "is_roadmap": false,
      "parent_id": null
    }
  ],
  "error": null
}
```

#### GET /api/todo/:id
**Description:** Get specific task by ID
**Authentication:** Required (JWT)
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Todo fetched successfully",
  "data": {
    "task_id": 123,
    "title": "Complete project documentation",
    "description": "Write comprehensive SRD for Fintrax",
    "priority": 1,
    "due_days": 5,
    "start_date": "2025-11-13T10:00:00Z",
    "end_date": "2025-11-18T18:00:00Z",
    "status": 2,
    "is_roadmap": false,
    "parent_id": null
  },
  "error": null
}
```

#### PUT /api/todo/:id
**Description:** Update task
**Authentication:** Required (JWT)
**Request Body:** (all fields optional)
```json
{
  "title": "Updated task title",
  "status": 6
}
```
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Todo updated successfully",
  "data": {
    "task_id": 123,
    "title": "Updated task title",
    "status": 6,
    ...
  },
  "error": null
}
```

#### DELETE /api/todo/:id
**Description:** Soft-delete task
**Authentication:** Required (JWT)
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Todo deleted successfully",
  "data": {
    "task_id": 123,
    "status": 5,
    "deleted_at": "2025-11-13T15:30:00Z"
  },
  "error": null
}
```

### 7.4 Dashboard Endpoint

#### GET /api/dashboard
**Description:** Get dashboard summary
**Authentication:** Required (JWT)
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Dashboard retrieved successfully",
  "data": {
    "total_balance": 25000.50,
    "total_todo": 15,
    "active_roadmaps": 3
  },
  "error": null
}
```

### 7.5 Response Format

**All API responses follow this structure:**
```json
{
  "status": <HTTP_STATUS_CODE>,
  "message": "<Human-readable message>",
  "data": <Response_Data_Object_Or_Array>,
  "error": <Error_Details_Or_Null>
}
```

**Error Response Example (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Invalid request",
  "data": null,
  "error": "Field 'title' is required"
}
```

### 7.6 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation errors |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

---

## 8. User Interface Requirements

### 8.1 Design Principles

**Visual Identity:**
- **Color Palette:** Primary (Blue #3B82F6), Success (Green #10B981), Warning (Amber #F59E0B), Danger (Red #EF4444)
- **Typography:** System fonts with fallback (sans-serif)
- **Spacing:** 8px grid system (4px, 8px, 16px, 24px, 32px, 48px)
- **Shadows:** Subtle elevation with layered shadows

**UI Patterns:**
- **Cards:** Rounded corners (8px), subtle shadow, hover effects
- **Buttons:** Primary (solid), Secondary (outline), Ghost (text only)
- **Forms:** Floating labels, inline validation, error states
- **Modals:** Centered overlay, dimmed background, slide-in animation

### 8.2 Page Specifications

#### 8.2.1 Landing Page (/)
**Purpose:** Introduce Fintrax and encourage sign-up
**Sections:**
- Hero with tagline: "Your productivity and financial tracking companion"
- Feature highlights (task management, finance tracking, roadmaps)
- Call-to-action buttons (Get Started, Learn More)

#### 8.2.2 Login Page (/login)
**Components:**
- Logo and tagline
- Email input (with validation)
- Password input (with visibility toggle)
- Remember me checkbox
- Login button
- Links: Forgot Password, Sign Up

#### 8.2.3 Registration Page (/register)
**Components:**
- Username, email, password inputs
- Password strength indicator
- Terms of Service acceptance checkbox
- Sign Up button
- Link to Login

#### 8.2.4 Email Verification Page
**Components:**
- 6-digit OTP input fields
- Resend OTP button (with cooldown timer)
- Verify button
- Link to change email

#### 8.2.5 Dashboard (/dashboard)
**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Sidebar           │  Main Content Area             │
│  ├─ Dashboard      │  ┌──────────────────────────┐  │
│  ├─ Projects       │  │  Welcome Hero            │  │
│  ├─ Tasks          │  └──────────────────────────┘  │
│  ├─ Roadmaps       │  ┌──────────┬──────────────┐  │
│  ├─ Finance        │  │ Financial│  Productivity│  │
│  │  ├─ Overview    │  │  Stats   │    Stats     │  │
│  │  ├─ Transactions│  └──────────┴──────────────┘  │
│  │  ├─ Savings     │  ┌──────────────────────────┐  │
│  │  └─ Loans       │  │  Recent Tasks            │  │
│  └─ Settings       │  │  - Task 1                │  │
│                    │  │  - Task 2                │  │
│                    │  └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Widgets:**
1. **Welcome Hero:** Greeting with current date
2. **Financial Stats:** Total Balance, Monthly Income/Expense, Debt
3. **Productivity Stats:** Active Tasks, Completed This Week, Roadmaps
4. **Recent Tasks:** Latest 5 tasks with quick actions
5. **Quick Actions:** Add Task, Record Transaction, New Project

#### 8.2.6 Projects Page (/projects)
**Views:**
- **Grid View:** Project cards with color, name, task count
- **List View:** Table with columns (Name, Status, Tasks, Created Date)

**Actions:**
- Create New Project (modal)
- Edit Project (modal)
- Delete Project (confirmation dialog)
- Click project → Navigate to project detail

#### 8.2.7 Project Detail Page (/projects/:id)
**Tabs:**
1. **Kanban Board:** Three columns (To Do, In Progress, Done)
2. **Calendar View:** Tasks plotted on monthly calendar
3. **Settings:** Project name, color, status, delete option

**Task Actions:**
- Drag & drop between Kanban columns
- Click task → Open task detail modal
- Add new task within project context

#### 8.2.8 Tasks Page (/tasks)
**Filters:**
- Status (All, Not Started, In Progress, Completed, On Hold)
- Priority (All, High 1-2, Medium 3, Low 4-5)
- Date Range (This Week, This Month, Custom)

**Display:**
- **Kanban:** Group by status
- **List:** Sortable table
- **Calendar:** Monthly view with task markers

#### 8.2.9 Roadmaps Page (/roadmaps)
**List of Roadmaps:**
- Name, progress bar (percentage), start/end dates
- Click roadmap → Expand to show associated tasks

**Create Roadmap:**
- Name, start date, end date
- Option to link existing tasks or create new

#### 8.2.10 Finance Pages

**Overview (/finance):**
- Balance summary card
- Income vs Expense chart (last 6 months)
- Savings and Loans summaries
- Recent transactions (last 10)

**Transactions (/finance/transactions):**
- Filterable table (date range, type, category)
- Add Transaction button → Modal
- Export to CSV button

**Savings (/finance/savings):**
- List of savings instruments with maturity info
- Add Savings → Modal (type, amount, rate)
- Calculate returns button

**Loans (/finance/loans):**
- Active loans with EMI, remaining balance, next payment date
- Add Loan → Modal (amount, rate, term)
- View amortization schedule

### 8.3 Component Library

**Reusable Components:**
1. **InputField:** Text, email, password, number inputs with validation
2. **Button:** Primary, secondary, danger variants
3. **Card:** Container with shadow and padding
4. **Modal:** Overlay with header, body, footer
5. **Dropdown:** Select menu with search
6. **DatePicker:** Calendar widget for date selection
7. **OTPInput:** Six-digit code entry
8. **ProgressBar:** Percentage indicator
9. **Badge:** Status indicators (color-coded)
10. **Avatar:** User profile picture or initials
11. **Toast:** Notification messages (success, error, info)
12. **Loading:** Spinner and skeleton loaders
13. **EmptyState:** Placeholder for empty lists

### 8.4 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | 320-767px | Single column, hamburger menu, stacked cards |
| Tablet | 768-1023px | Two columns, collapsible sidebar |
| Desktop | 1024-1439px | Full sidebar, three-column grid |
| Large Desktop | 1440px+ | Wider main content, expanded charts |

### 8.5 Accessibility

**WCAG 2.1 Level AA Compliance:**
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Keyboard Navigation:** Tab order, focus indicators, Escape to close modals
- **Screen Readers:** ARIA labels, semantic HTML, alt text for images
- **Touch Targets:** Minimum 44x44px for interactive elements
- **Forms:** Associated labels, error messages linked to inputs

---

## 9. Security Requirements

### 9.1 Authentication and Authorization

**JWT Implementation:**
- **Algorithm:** HMAC-SHA256 (HS256)
- **Payload:** User ID, issued at (iat), expiration (exp)
- **Secret:** Strong random string (min 256 bits) stored in environment variable
- **Expiration:** 24 hours (configurable)

**Password Security:**
- **Hashing:** bcrypt with cost factor 10
- **Minimum Requirements:** 8 characters, mix of letters and numbers
- **Storage:** Only hashed passwords stored, never plaintext

**OTP Security:**
- **Generation:** Cryptographically secure random number generator
- **Validity:** 5 minutes from generation
- **Rate Limiting:** 1 generation per minute per user
- **Attempts:** Maximum 3 incorrect attempts before lockout
- **Delivery:** Email (production), response body (development only for testing)

### 9.2 Data Protection

**Encryption:**
- **In Transit:** TLS 1.2+ for all communications
- **At Rest:** Database-level encryption for sensitive fields (future scope)
- **Backups:** Encrypted backups with access control

**Sensitive Data Handling:**
- **Never Log:** Passwords, tokens, OTPs, credit card numbers
- **Masking:** Display partial data only (e.g., *****@example.com)
- **Deletion:** Secure wipeout for hard deletions (GDPR compliance)

### 9.3 Input Validation and Sanitization

**Backend Validation:**
- **Type Checking:** All inputs validated against expected types
- **Length Limits:** Maximum string lengths enforced
- **SQL Injection:** Parameterized queries via GORM (prevents SQL injection)
- **XSS Prevention:** Output encoding, Content Security Policy headers

**Frontend Validation:**
- **Client-Side:** Immediate feedback for user experience
- **Server-Side:** Always re-validate (never trust client input)
- **Regex Patterns:** Email, phone number, URL validation

### 9.4 Rate Limiting

**Limits:**
- **Login:** 5 attempts per hour per IP
- **OTP Generation:** 1 request per minute per user
- **API Calls:** 100 requests per minute per user (future scope)
- **Implementation:** In-memory store (Redis recommended for production)

### 9.5 Security Headers

**HTTP Headers:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

### 9.6 Audit Logging

**Logged Events:**
- User registration, login, logout
- Password changes, OTP generation
- Financial transactions (create, update, delete)
- Task/project modifications

**Log Format:**
```json
{
  "timestamp": "2025-11-13T15:30:00Z",
  "user_id": 42,
  "event": "LOGIN_SUCCESS",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0..."
}
```

### 9.7 GDPR and Privacy Compliance

**User Rights:**
- **Access:** Export all user data in JSON format
- **Rectification:** Update personal information
- **Erasure:** Request account deletion (with data retention policies)
- **Portability:** Download data in machine-readable format

**Data Retention:**
- **Active Users:** Indefinite storage
- **Deleted Accounts:** 30-day soft delete, then permanent removal
- **Financial Records:** 7 years for compliance (even after account deletion)

---

## 10. Future Enhancements

### 10.1 Phase 2 Features (3-6 months)

**Collaboration:**
- **FR-COL-001:** Shared projects with role-based permissions (Owner, Editor, Viewer)
- **FR-COL-002:** Task assignment to team members
- **FR-COL-003:** Real-time collaboration with WebSocket notifications
- **FR-COL-004:** Comments and @mentions on tasks

**Advanced Finance:**
- **FR-FIN-001:** Budgeting with category limits and overspending alerts
- **FR-FIN-002:** Recurring transactions (monthly bills, salary)
- **FR-FIN-003:** Multi-currency support with exchange rate API
- **FR-FIN-004:** Financial goal tracking (save for vacation, pay off debt)
- **FR-FIN-005:** Investment portfolio tracking with market data integration

**Notifications:**
- **FR-NOT-001:** Email notifications for due tasks and financial events
- **FR-NOT-002:** In-app notification center
- **FR-NOT-003:** Push notifications (Progressive Web App)
- **FR-NOT-004:** Configurable notification preferences

### 10.2 Phase 3 Features (6-12 months)

**Mobile Applications:**
- **FR-MOB-001:** Native iOS app (Swift/SwiftUI)
- **FR-MOB-002:** Native Android app (Kotlin/Jetpack Compose)
- **FR-MOB-003:** Offline mode with sync

**AI/ML Integration:**
- **FR-AI-001:** Smart task scheduling based on priority and deadlines
- **FR-AI-002:** Expense categorization with machine learning
- **FR-AI-003:** Financial insights and spending pattern analysis
- **FR-AI-004:** Predictive budgeting recommendations
- **FR-AI-005:** Natural language task creation ("Remind me to...")

**Integrations:**
- **FR-INT-001:** Calendar sync (Google Calendar, Outlook)
- **FR-INT-002:** Bank account integration (Plaid API)
- **FR-INT-003:** GitHub/GitLab issue tracker sync
- **FR-INT-004:** Slack/Teams bot for quick task creation
- **FR-INT-005:** Zapier/IFTTT webhooks

**Gamification:**
- **FR-GAM-001:** Achievement badges for task completion streaks
- **FR-GAM-002:** Productivity score and leaderboards (for teams)
- **FR-GAM-003:** Financial milestones and rewards

### 10.3 Technical Debt and Improvements

**Performance:**
- **Caching:** Redis for frequently accessed data (user sessions, dashboard stats)
- **CDN:** Static asset delivery via CDN
- **Database Optimization:** Query optimization, read replicas
- **Pagination:** Implement cursor-based pagination for large datasets

**Testing:**
- **Unit Tests:** Go backend (target 80% coverage)
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Cypress/Playwright for critical user flows
- **Load Testing:** Performance benchmarking with k6

**DevOps:**
- **CI/CD:** GitHub Actions for automated testing and deployment
- **Containerization:** Docker multi-stage builds
- **Orchestration:** Kubernetes deployment with auto-scaling
- **Monitoring:** Prometheus + Grafana for metrics, Sentry for error tracking
- **Logging:** Centralized logging with ELK stack

**Documentation:**
- **API Docs:** Interactive Swagger/OpenAPI documentation
- **User Guide:** Comprehensive help center with tutorials
- **Developer Docs:** Contributing guidelines, architecture diagrams
- **Video Tutorials:** Onboarding and feature walkthroughs

---

## Appendix A: Status and Type Constants

### Task/Project/Roadmap Status
| Value | Constant | Description |
|-------|----------|-------------|
| 1 | STATUS_NOT_STARTED | Planned but not begun |
| 2 | STATUS_IN_PROGRESS | Actively being worked on |
| 3 | STATUS_ON_HOLD | Temporarily paused |
| 4 | STATUS_CANCELLED | Abandoned |
| 5 | STATUS_DELETED | Soft-deleted |
| 6 | STATUS_COMPLETED | Successfully finished |

### User Status
| Value | Description |
|-------|-------------|
| Active | Verified, full access |
| Inactive | Unverified, limited access |
| Banned | Suspended by admin |
| Deleted | Account closed |

### Transaction Types
| Value | Constant | Description |
|-------|----------|-------------|
| 1 | TRANSACTION_TYPE_INCOME | Money received |
| 2 | TRANSACTION_TYPE_EXPENSE | Money spent |
| 3 | TRANSACTION_TYPE_SAVING | Transfer to savings |
| 4 | TRANSACTION_TYPE_DEBT | Loan payment |
| 5 | TRANSACTION_TYPE_INVESTMENT | Investment purchase |

### Resource Types
| Value | Constant | Description |
|-------|----------|-------------|
| 1 | RESOURCE_TYPE_LINK | External URL |
| 2 | RESOURCE_TYPE_AUDIO | Audio file |
| 3 | RESOURCE_TYPE_VIDEO | Video file |
| 4 | RESOURCE_TYPE_NOTES | Text notes |

### Savings Types
| Value | Constant | Description |
|-------|----------|-------------|
| 1 | SAVING_TYPE_FD_RD | Fixed/Recurring Deposit |
| 2 | SAVING_TYPE_SIP | Systematic Investment Plan |
| 3 | SAVING_TYPE_PPF | Public Provident Fund |
| 4 | SAVING_TYPE_NPS | National Pension Scheme |
| 5 | SAVING_TYPE_MF | Mutual Funds |
| 6 | SAVING_TYPE_GOLD | Gold investment |

---

## Appendix B: Environment Variables

**Backend (.env):**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=strongpassword
DB_NAME=fintrax_db

# Application Configuration
GIN_MODE=debug  # debug, release, test
JWT_SECRET=your-256-bit-secret-key-here

# Email Configuration (Future)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@fintrax.com
SMTP_PASSWORD=email-password

# External APIs (Future)
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:80/api
```

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Amortization** | The gradual repayment of a loan through scheduled payments |
| **bcrypt** | Password hashing algorithm with built-in salt |
| **EMI** | Equated Monthly Installment (loan payment) |
| **Gin** | High-performance Go web framework |
| **GORM** | Go Object-Relational Mapping library |
| **JWT** | JSON Web Token for stateless authentication |
| **Kanban** | Visual workflow management method with columns |
| **ORM** | Object-Relational Mapping (database abstraction) |
| **OTP** | One-Time Password for verification |
| **Roadmap** | Strategic learning path or project plan |
| **Soft Delete** | Marking record as deleted without physical removal |
| **Zustand** | Lightweight state management library for React |

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-13 | AI Assistant | Initial SRD creation based on codebase analysis |

---

**End of Software Requirements Document**
