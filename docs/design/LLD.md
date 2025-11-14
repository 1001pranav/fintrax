# Low-Level Design (LLD) Document

**Project Name:** Fintrax - Unified Task and Finance Management System
**Version:** 1.0
**Last Updated:** 2025-11-14
**Document Status:** Draft

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-11-08 | Development Team | Initial draft |
| 0.5 | 2025-11-12 | Technical Lead | Detailed design review |
| 1.0 | 2025-11-14 | Senior Developer | Final approval |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Backend Component Design](#2-backend-component-design)
3. [Frontend Component Design](#3-frontend-component-design)
4. [Sequence Diagrams](#4-sequence-diagrams)
5. [Algorithm Specifications](#5-algorithm-specifications)
6. [Data Access Patterns](#6-data-access-patterns)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [State Management Design](#8-state-management-design)
9. [Security Implementation](#9-security-implementation)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Introduction

### 1.1 Purpose

This Low-Level Design (LLD) document provides detailed technical specifications for implementing the Fintrax system. It complements the High-Level Design (HLD) document by diving into component-level details, including:

- Detailed class structures and relationships
- Sequence diagrams for critical user flows
- Algorithm implementations for business logic
- Database transaction patterns
- Error handling mechanisms
- State management strategies
- Code-level implementation guidelines

### 1.2 Scope

This document covers the detailed design of:

**Backend Components:**
- Controller layer implementation
- Model layer with GORM specifications
- Middleware components (authentication, rate limiting, recovery)
- Helper utilities (JWT, email, response formatting)
- Database migration strategies

**Frontend Components:**
- React component hierarchy
- Zustand state management stores
- API client implementation
- Form handling and validation
- Routing and navigation

### 1.3 Intended Audience

- Backend Developers (Go/Gin)
- Frontend Developers (Next.js/React)
- QA Engineers
- DevOps Engineers
- Technical Reviewers

### 1.4 References

| Document | Location | Purpose |
|----------|----------|---------|
| High-Level Design (HLD) | `/docs/design/HLD.md` | System architecture overview |
| Software Requirements Specification (SRS) | `/docs/requirements/SRS.md` | Functional and non-functional requirements |
| Database Schema | `/backend/migrations/` | SQL migration files |
| API Documentation | `/docs/api/` | REST API specifications (to be created) |

### 1.5 Design Principles

This implementation follows these key principles:

1. **SOLID Principles**
   - Single Responsibility: Each component has one well-defined purpose
   - Open/Closed: Open for extension, closed for modification
   - Liskov Substitution: Subtypes must be substitutable for base types
   - Interface Segregation: Many specific interfaces over one general-purpose interface
   - Dependency Inversion: Depend on abstractions, not concretions

2. **DRY (Don't Repeat Yourself)**
   - Reusable helper functions
   - Shared middleware components
   - Common UI components

3. **Clean Code**
   - Meaningful variable and function names
   - Small, focused functions
   - Consistent code style (enforced by linters)

4. **Security by Design**
   - Input validation at all entry points
   - Parameterized database queries (GORM ORM)
   - JWT token validation
   - Rate limiting on sensitive endpoints

5. **Performance Optimization**
   - Database query optimization with indexes
   - Connection pooling
   - Lazy loading of components
   - Code splitting

---

## 2. Backend Component Design

### 2.1 Architecture Overview

The backend follows a layered MVC-style architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         ROUTER LAYER                        │
│  (Route Registration, HTTP Method Binding, Middleware)      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                       │
│  - Rate Limiting    - Authentication    - Recovery          │
│  - CORS             - Request Logging   - Validation        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      CONTROLLER LAYER                       │
│  - Request Parsing  - Business Logic    - Response Building │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                        MODEL LAYER                          │
│  - GORM Models      - Relationships     - Validation Tags   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                         │
│  PostgreSQL (GORM ORM abstraction)                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Directory Structure

```
backend/
├── main.go                    # Application entry point
├── config/
│   └── database.go           # Database connection configuration
├── controllers/              # Request handlers (business logic)
│   ├── userController.go
│   ├── todoController.go
│   ├── projectController.go
│   ├── financeController.go
│   ├── transactionController.go
│   ├── savingsController.go
│   ├── loanController.go
│   ├── roadmapController.go
│   ├── resourceController.go
│   ├── noteController.go
│   ├── tagController.go
│   └── dashboardController.go
├── models/                   # GORM data models
│   ├── user.go
│   ├── todo.go
│   ├── project.go
│   ├── finance.go
│   ├── transaction.go
│   ├── savings.go
│   ├── loan.go
│   ├── roadmap.go
│   ├── resource.go
│   ├── note.go
│   ├── tag.go
│   └── category.go
├── middleware/               # HTTP middleware
│   ├── authorization.go      # JWT validation
│   ├── rateLimit.go         # Rate limiting
│   └── recovery.go          # Panic recovery
├── routes/                   # Route registration
│   ├── userRoute.go
│   ├── todoRoute.go
│   ├── projectRoute.go
│   ├── financeRoute.go
│   ├── transactionRoute.go
│   ├── savingsRoute.go
│   ├── loanRoute.go
│   ├── roadmapRoute.go
│   ├── resourceRoute.go
│   ├── noteRoute.go
│   ├── tagRoute.go
│   └── dashboard.go
├── helper/                   # Utility functions
│   ├── jwt.go               # JWT generation and validation
│   ├── email.go             # Email service (SendGrid)
│   └── response.go          # Standardized API responses
└── migrations/              # Database migrations
    ├── 000001_create_users_table.up.sql
    ├── 000001_create_users_table.down.sql
    └── ... (other migrations)
```

### 2.3 Model Layer - Class Diagrams

The model layer uses GORM (Go Object-Relational Mapping) to define database structures and relationships. All models embed `gorm.Model` which provides `ID`, `CreatedAt`, `UpdatedAt`, and `DeletedAt` fields.

#### 2.3.1 Core Domain Model - Entity Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                        CORE ENTITIES                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      Users       │
├──────────────────┤         1:1          ┌──────────────────┐
│ + ID: uint (PK)  │◄─────────────────────│    Finance       │
│ + Username       │                      ├──────────────────┤
│ + Email          │                      │ + ID: uint (PK)  │
│ + Password       │                      │ + Balance        │
│ + OTP: uint      │                      │ + TotalDebt      │
│ + OTPTime        │                      │ + UserID (FK)    │
│ + OTPTries: int  │                      │ + Status: uint   │
│ + Status: string │                      └──────────────────┘
└────────┬─────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────┐
│   Transactions   │
├──────────────────┤
│ + ID: uint (PK)  │
│ + Source: string │
│ + Amount: float  │
│ + Type: uint     │◄──────────┐
│ + TransType      │           │ N:1
│ + Category       │           │
│ + Date: time     │           │
│ + UserID (FK)    │     ┌─────┴────────┐
│ + NotesID (FK)   │     │    Notes     │
│ + Status: uint   │     ├──────────────┤
└──────────────────┘     │ + ID (PK)    │
                         │ + Text       │
         │ 1:N           └──────────────┘
         │
         ▼
┌──────────────────┐
│     Savings      │
├──────────────────┤
│ + ID: uint (PK)  │
│ + Name: string   │
│ + Amount: float  │
│ + Rate: float    │
│ + UserID (FK)    │
│ + Status: uint   │
└──────────────────┘

         │ 1:N
         │
         ▼
┌──────────────────┐
│      Loans       │
├──────────────────┤
│ + ID: uint (PK)  │
│ + Name: string   │
│ + TotalAmount    │
│ + Rate: float    │
│ + Term: uint     │
│ + Duration       │
│ + PremiumAmount  │
│ + UserID (FK)    │
│ + Status: uint   │
└──────────────────┘
```

#### 2.3.2 Task Management Domain Model

```
┌────────────────────────────────────────────────────────────────────┐
│                  TASK MANAGEMENT ENTITIES                          │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      Users       │
│ (from Core)      │
└────────┬─────────┘
         │
         │ 1:N
         │
         ├────────────────────┬─────────────────────┐
         │                    │                     │
         ▼                    ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│     Project      │  │     Roadmap      │  │      Todo       │
├──────────────────┤  ├──────────────────┤  ├─────────────────┤
│ + ID: uint (PK)  │  │ + ID: uint (PK)  │  │ + ID (PK)       │
│ + Name: string   │  │ + Name: string   │  │ + Task          │
│ + Description    │  │ + StartDate      │  │ + Description   │
│ + Color: string  │  │ + EndDate        │  │ + IsRoadmap     │
│ + CoverImage     │  │ + Progress       │  │ + Priority      │
│ + UserID (FK)    │  │ + Status: uint   │  │ + DueDays       │
│ + Status: uint   │  └────────┬─────────┘  │ + StartDate     │
└────────┬─────────┘           │             │ + EndDate       │
         │                     │ 1:N         │ + Status        │
         │ 1:N                 │             │ + ParentID (FK) │◄──┐
         │                     ▼             │ + UserID (FK)   │   │
         │            ┌──────────────────┐   │ + RoadmapID(FK) │   │
         │            │      Todo        │   │ + ProjectID(FK) │   │
         └───────────►│  (references     │◄──┤ + NotesID (FK)  │   │
                      │   parent above)  │   └─────────┬───────┘   │
                      └──────────────────┘             │           │
                               │                       │           │
                               │ Self-Referencing      │ Subtasks  │
                               │ (Hierarchical Tasks)  └───────────┘
                               │
                               │ 1:N
                               │
                               ▼
                      ┌──────────────────┐
                      │    Resources     │
                      ├──────────────────┤
                      │ + ID: uint (PK)  │
                      │ + Type: uint     │
                      │ + MiscID: uint   │
                      │ + Link: *string  │
                      │ + TodoID (FK)    │
                      └──────────────────┘
```

#### 2.3.3 Tagging System (Many-to-Many)

```
┌──────────────────┐              ┌──────────────────┐
│      Todo        │              │       Tag        │
├──────────────────┤              ├──────────────────┤
│ + ID: uint (PK)  │              │ + ID: uint (PK)  │
│ + Task: string   │              │ + Name: string   │
│ + ...            │              └────────┬─────────┘
└────────┬─────────┘                       │
         │                                 │
         │ N                               │ N
         │                                 │
         │         ┌──────────────────┐    │
         └────────►│   TodoTags       │◄───┘
                   │ (Join Table)     │
                   ├──────────────────┤
                   │ + TodoID (FK)    │
                   │ + TagID (FK)     │
                   └──────────────────┘
```

#### 2.3.4 Detailed Model Specifications

##### Users Model

**File:** `backend/models/user.go`

```go
type Users struct {
    gorm.Model
    ID       uint      `gorm:"primaryKey;autoIncrement:true"`
    Username string    `json:"username"`
    Email    string    `json:"email"`
    Password string    `json:"password"`
    OTP      uint      `json:"otp"`
    OTPTime  time.Time `json:"otp_time"`
    OTPTries int       `json:"otp_tries"`
    Status   string    `json:"status"`
}
```

**Attributes:**
- `ID`: Primary key, auto-increment
- `Username`: User's display name
- `Email`: Unique email address (indexed)
- `Password`: bcrypt hashed password (cost factor 10)
- `OTP`: One-time password for email verification
- `OTPTime`: Timestamp when OTP was generated
- `OTPTries`: Counter for failed OTP attempts (max 3)
- `Status`: User account status
  - `"active"`: Verified and active
  - `"inactive"`: Temporarily disabled
  - `"banned"`: Permanently banned
  - `"notVerified"`: Email not verified

**Relationships:**
- One-to-One with Finance
- One-to-Many with Transactions
- One-to-Many with Savings
- One-to-Many with Loans
- One-to-Many with Projects
- One-to-Many with Todos
- One-to-Many with Roadmaps

**Business Rules:**
- Email must be unique across all users
- Password must be hashed before storage
- OTP expires after 10 minutes
- Maximum 3 OTP attempts before lockout

---

##### Finance Model

**File:** `backend/models/finance.go`

```go
type Finance struct {
    gorm.Model
    ID        uint      `json:"finance_id" gorm:"primaryKey;autoIncrement:true"`
    Balance   float64   `json:"balance"`
    TotalDebt float64   `json:"total_debt"`
    UserID    uint      `json:"user_id"`
    User      Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
    UpdatedAt time.Time `json:"updated_at"`
    Status    uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
```

**Attributes:**
- `ID`: Primary key
- `Balance`: Current account balance (precision: 2 decimal places)
- `TotalDebt`: Sum of all active loans
- `UserID`: Foreign key to Users table
- `Status`: Record status (1=active, 2=frozen, 3=closed)

**Relationships:**
- Belongs-To Users (1:1)

**Business Rules:**
- Balance updated atomically with transactions
- TotalDebt calculated from active loans
- Status changes require admin approval

**Constraints:**
- `status` CHECK: value between 1 and 6
- Foreign key: `UserID` references `Users.ID`
  - ON UPDATE: CASCADE
  - ON DELETE: SET NULL

---

##### Todo Model

**File:** `backend/models/todo.go`

```go
type Todo struct {
    gorm.Model
    ID          uint      `json:"task_id" gorm:"primaryKey;autoIncrement:true"`
    Task        string    `json:"task"`
    Description string    `json:"description" gorm:"size:1000"`
    IsRoadmap   bool      `json:"is_roadmap"`
    Priority    uint      `json:"priority" gorm:"default:5;check:priority >= 0 AND priority <= 5"`
    DueDays     uint      `json:"due_days" gorm:"default:0"`
    EndDate     time.Time `json:"end_date" gorm:"default:NULL"`
    StartDate   time.Time `json:"start_date" gorm:"default:NULL"`
    Status      uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`

    // Self-referencing for subtasks
    ParentID    *uint     `json:"parent_id" gorm:"default:NULL;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
    Subtasks    []Todo    `json:"subtasks" gorm:"foreignKey:ParentID"`

    // Foreign keys
    UserID      uint      `json:"user_id"`
    Users       Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
    RoadmapID   *uint     `json:"roadmap_id" gorm:"default:NULL"`
    Roadmap     Roadmap   `gorm:"foreignKey:RoadmapID"`
    ProjectID   *uint     `json:"project_id" gorm:"default:NULL"`
    Project     Project   `gorm:"foreignKey:ProjectID"`
    NotesID     *uint     `json:"notes_id" gorm:"default:NULL"`
    Notes       Notes     `gorm:"foreignKey:NotesID"`

    // Resources relationship
    Resources   []Resources `json:"resources" gorm:"foreignKey:TodoID"`
}
```

**Attributes:**
- `Priority`: 0 (lowest) to 5 (highest)
- `Status`: 1=Todo, 2=In Progress, 3=Done, 4=Blocked, 5=Cancelled, 6=Archived
- `ParentID`: Nullable pointer for hierarchical tasks
- `IsRoadmap`: Flag to indicate if task is part of a roadmap

**Relationships:**
- Belongs-To Users (required)
- Belongs-To Project (optional)
- Belongs-To Roadmap (optional)
- Belongs-To Notes (optional)
- Self-referencing (Subtasks) - creates tree structure
- Has-Many Resources

**Business Rules:**
- Subtasks inherit project and roadmap from parent
- Deleting parent sets subtasks' ParentID to NULL
- Status transitions must follow workflow: Todo → In Progress → Done
- Priority changes trigger re-sorting in UI

**Constraints:**
- `priority` CHECK: 0-5 range
- `status` CHECK: 1-6 range

---

##### Project Model

**File:** `backend/models/project.go`

```go
type Project struct {
    gorm.Model
    ID          uint   `json:"project_id" gorm:"primaryKey;autoIncrement:true"`
    Name        string `json:"name" gorm:"not null"`
    Description string `json:"description" gorm:"size:1000"`
    Color       string `json:"color" gorm:"default:#3B82F6"`
    CoverImage  string `json:"cover_image" gorm:"default:NULL"`
    Status      uint   `json:"status" gorm:"default:1;check:status >= 1 AND status <= 3"`

    UserID      uint   `json:"user_id"`
    Users       Users  `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
    Tasks       []Todo `json:"tasks" gorm:"foreignKey:ProjectID"`
}
```

**Attributes:**
- `Color`: Hex color code for UI theming (default: blue #3B82F6)
- `CoverImage`: URL to cover image (optional)
- `Status`: 1=Active, 2=Archived, 3=Deleted

**Relationships:**
- Belongs-To Users
- Has-Many Todos

**Business Rules:**
- Name is required
- Default color if not specified
- Archiving project archives all tasks
- Soft delete (sets DeletedAt timestamp)

---

##### Transactions Model

**File:** `backend/models/transactions.go`

```go
type Transactions struct {
    gorm.Model
    ID              uint      `gorm:"primaryKey;autoIncrement:true"`
    Source          string    `json:"source" gorm:"size:150"`
    Amount          float64   `json:"amount"`
    Type            uint      `json:"type" gorm:"default:1;check:type >= 1 AND type <= 2"`
    TransactionType uint      `json:"transaction_type" gorm:"default:1;check:transaction_type >= 1 AND transaction_type <= 5"`
    Category        string    `json:"category"`
    NotesID         *uint     `json:"notes_id" gorm:"nullable"`
    Date            time.Time `json:"date"`
    UserID          uint      `json:"user_id" gorm:"not null"`
    User            Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
    Notes           Notes     `gorm:"foreignKey:NotesID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
    Status          uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
```

**Attributes:**
- `Type`: 1=Income, 2=Expense
- `TransactionType`: 1=Cash, 2=Credit, 3=Debit, 4=UPI, 5=Other
- `Category`: User-defined category (e.g., "Food", "Transport")
- `Status`: 1=Active, 2=Pending, 3=Cancelled

**Relationships:**
- Belongs-To Users
- Belongs-To Notes (optional)

**Business Rules:**
- Amount must be positive
- Date cannot be future date
- Transaction updates Finance.Balance atomically
- Income adds to balance, Expense subtracts

**Constraints:**
- `type` CHECK: 1-2 range
- `transaction_type` CHECK: 1-5 range
- `status` CHECK: 1-6 range

---

##### Savings Model

**File:** `backend/models/Savings.go`

```go
type Savings struct {
    gorm.Model
    ID        uint      `json:"saving_id" gorm:"primaryKey;autoIncrement:true"`
    Name      string    `json:"name"`
    Amount    float64   `json:"amount"`
    Rate      float64   `json:"rate"`
    UserID    uint      `json:"user_id"`
    User      Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
    UpdatedAt time.Time `json:"updated_at"`
    Status    uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
```

**Attributes:**
- `Name`: Savings goal name (e.g., "Emergency Fund")
- `Amount`: Current saved amount
- `Rate`: Interest rate (percentage)
- `Status`: 1=Active, 2=Matured, 3=Withdrawn

**Relationships:**
- Belongs-To Users

**Business Rules:**
- Rate represents annual interest percentage
- Interest calculated monthly
- Status changes on maturity

---

##### Loans Model

**File:** `backend/models/loans.go`

```go
type Loans struct {
    gorm.Model
    ID            uint    `json:"loan_id" gorm:"primaryKey;autoIncrement:true"`
    Name          string  `json:"name"`
    TotalAmount   float64 `json:"total_amount"`
    Rate          float64 `json:"rate"`
    Term          uint    `json:"term"`
    Duration      uint    `json:"duration"`
    PremiumAmount float64 `json:"premium_amount"`
    UserID        uint    `json:"user_id"`
    User          Users   `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
    Status        uint    `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
```

**Attributes:**
- `TotalAmount`: Principal loan amount
- `Rate`: Annual interest rate (percentage)
- `Term`: Total loan term in months
- `Duration`: Payment frequency (1=monthly, 3=quarterly, 12=yearly)
- `PremiumAmount`: EMI/Premium amount per duration
- `Status`: 1=Active, 2=Paid, 3=Defaulted

**Relationships:**
- Belongs-To Users

**Business Rules:**
- PremiumAmount calculated using EMI formula
- Updates Finance.TotalDebt on creation
- Status changes when fully paid

---

##### Roadmap Model

**File:** `backend/models/roadmap.go`

```go
type Roadmap struct {
    gorm.Model
    ID        uint      `json:"roadmap_id" gorm:"primaryKey;autoIncrement:true"`
    Name      string    `json:"name"`
    StartDate time.Time `json:"start_date"`
    EndDate   time.Time `json:"end_date"`
    Progress  float64   `json:"progress"`
    Todos     []Todo    `json:"todos" gorm:"foreignKey:RoadmapID"`
    Status    uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
```

**Attributes:**
- `Progress`: Percentage completion (0.0 to 100.0)
- `Status`: 1=Active, 2=Completed, 3=Abandoned

**Relationships:**
- Has-Many Todos

**Business Rules:**
- Progress auto-calculated from completed todos
- EndDate must be after StartDate
- Cannot delete with active todos

---

##### Resources Model

**File:** `backend/models/resources.go`

```go
type Resources struct {
    gorm.Model
    ID     uint    `json:"resource_id" gorm:"primaryKey;autoIncrement:true"`
    Type   uint    `json:"type" gorm:"default:1;check:type >= 1 AND type <= 4"`
    MiscID uint    `json:"misc_id" gorm:"default:0;"`
    Link   *string `json:"link" gorm:"nullable"`
    TodoID uint    `json:"todo_id"`
    Todo   Todo    `gorm:"foreignKey:TodoID"`
}
```

**Attributes:**
- `Type`: 1=URL, 2=File, 3=Image, 4=Video
- `MiscID`: Reference to external resource if stored elsewhere
- `Link`: URL or file path

**Relationships:**
- Belongs-To Todo

**Business Rules:**
- Link required for Type 1 (URL)
- MiscID used for cloud-stored resources

---

##### Notes Model

**File:** `backend/models/notes.go`

```go
type Notes struct {
    gorm.Model
    ID   uint   `json:"note_id" gorm:"primaryKey;autoIncrement:true"`
    Text string `json:"text"`
}
```

**Attributes:**
- `Text`: Markdown-formatted note content

**Relationships:**
- Referenced by Todos and Transactions

**Business Rules:**
- Supports markdown formatting
- Can be shared across multiple entities

---

##### Tag Model

**File:** `backend/models/tags.go`

```go
type Tag struct {
    gorm.Model
    ID   uint   `json:"tag_id" gorm:"primaryKey;autoIncrement:true"`
    Name string `json:"name"`
}
```

**Attributes:**
- `Name`: Unique tag name

**Relationships:**
- Many-to-Many with Todos (through TodoTags join table)

**Business Rules:**
- Tag names are case-insensitive
- Duplicate tags prevented

---

### 2.4 Controller Layer Design

Controllers handle HTTP requests, execute business logic, and return responses. All controllers follow a consistent pattern.

#### 2.4.1 Controller Structure Pattern

```go
// Standard controller function signature
func ControllerName(c *gin.Context) {
    // 1. Extract request data
    // 2. Validate input
    // 3. Execute business logic
    // 4. Build response
    // 5. Return standardized response
}
```

#### 2.4.2 Key Controllers

**User Controller** (`backend/controllers/userController.go`)

Functions:
- `CreateUser(c *gin.Context)`: Register new user
- `Login(c *gin.Context)`: Authenticate user
- `GetUser(c *gin.Context)`: Retrieve user profile
- `UpdateUser(c *gin.Context)`: Update user details
- `DeleteUser(c *gin.Context)`: Soft delete user
- `SendOTP(c *gin.Context)`: Generate and send OTP
- `VerifyOTP(c *gin.Context)`: Validate OTP
- `ForgotPassword(c *gin.Context)`: Initiate password reset
- `ResetPassword(c *gin.Context)`: Complete password reset

**Todo Controller** (`backend/controllers/todoController.go`)

Functions:
- `CreateToDo(c *gin.Context)`: Create new task
- `GetAllToDos(c *gin.Context)`: List all tasks with filters
- `GetToDo(c *gin.Context)`: Get single task by ID
- `UpdateToDo(c *gin.Context)`: Update task details
- `DeleteToDo(c *gin.Context)`: Soft delete task

**Transaction Controller** (`backend/controllers/transactionController.go`)

Functions:
- `CreateTransaction(c *gin.Context)`: Record income/expense
- `GetAllTransactions(c *gin.Context)`: List with pagination
- `GetTransaction(c *gin.Context)`: Get single transaction
- `UpdateTransaction(c *gin.Context)`: Modify transaction
- `DeleteTransaction(c *gin.Context)`: Remove transaction
- `GetTransactionsByCategory(c *gin.Context)`: Filter by category
- `GetTransactionsByDateRange(c *gin.Context)`: Date range query

**Dashboard Controller** (`backend/controllers/dashboardController.go`)

Functions:
- `GetDashboard(c *gin.Context)`: Aggregate metrics
  - Net worth calculation
  - Total income/expense
  - Savings summary
  - Active loans
  - Task statistics
  - Recent transactions

---

### 2.5 Middleware Components

#### 2.5.1 Rate Limiter Middleware

**File:** `backend/middleware/rateLimit.go`

**Implementation:**

```go
type RateLimiter struct {
    requests map[string]*ClientRequests
    mu       sync.RWMutex
    limit    int
    window   time.Duration
}

type ClientRequests struct {
    count     int
    firstSeen time.Time
}
```

**Global Limiters:**
- `GeneralLimiter`: 100 requests/minute (general API endpoints)
- `AuthLimiter`: 5 requests/minute (authentication endpoints)
- `OTPLimiter`: 3 requests/5 minutes (OTP generation)

**Algorithm:**
- Fixed window counter
- Tracks requests per IP address
- Automatic cleanup every 1 minute
- Returns 429 Too Many Requests when exceeded

**Usage in Routes:**
```go
// General endpoints
router.Group("/api", middleware.RateLimitGeneral())

// Auth endpoints
router.Group("/auth", middleware.RateLimitAuth())

// OTP endpoints
router.POST("/otp/send", middleware.RateLimitOTP(), controllers.SendOTP)
```

#### 2.5.2 Authorization Middleware

**File:** `backend/middleware/authorization.go`

**Implementation:**
- Extracts JWT from Authorization header
- Validates token signature
- Extracts user claims (UserID, Email)
- Injects user context into request
- Returns 401 Unauthorized if invalid

**Usage:**
```go
// Protected routes
router.Group("/api", middleware.Authorization())
```

#### 2.5.3 Recovery Middleware

**File:** `backend/middleware/recovery.go`

**Implementation:**
- Catches panics in request handlers
- Logs stack trace
- Returns 500 Internal Server Error
- Prevents server crash

---

## 3. Frontend Component Design

### 3.1 Component Architecture

The frontend follows a modular component-based architecture using Next.js 15 App Router with React 19.

```
frontend/src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth group (no layout)
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Dashboard group (with layout)
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── finance/
│   │   └── settings/
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── OTPVerification.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── MetricsCard.tsx
│   │   ├── RecentActivity.tsx
│   │   └── QuickActions.tsx
│   ├── tasks/                    # Task management components
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── SubtaskList.tsx
│   ├── projects/                 # Project components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   └── ProjectForm.tsx
│   └── finance/                  # Finance components
│       ├── TransactionList.tsx
│       ├── TransactionForm.tsx
│       ├── AccountSummary.tsx
│       └── BudgetChart.tsx
├── lib/                          # Utilities and configurations
│   ├── api.ts                    # API client
│   ├── store.ts                  # Zustand state management
│   ├── utils.ts                  # Helper functions
│   └── constants.ts              # App constants
└── types/                        # TypeScript type definitions
    ├── user.ts
    ├── task.ts
    ├── project.ts
    └── finance.ts
```

### 3.2 State Management - Zustand Stores

**File:** `frontend/src/lib/store.ts`

**User Store:**
```typescript
interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}
```

**Project Store:**
```typescript
interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  fetchProjects: () => Promise<void>
  createProject: (data: CreateProjectDto) => Promise<void>
  updateProject: (id: number, data: UpdateProjectDto) => Promise<void>
  deleteProject: (id: number) => Promise<void>
}
```

**Task Store:**
```typescript
interface TaskState {
  tasks: Todo[]
  filters: TaskFilters
  fetchTasks: (filters?: TaskFilters) => Promise<void>
  createTask: (data: CreateTaskDto) => Promise<void>
  updateTask: (id: number, data: UpdateTaskDto) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}
```

---

## 4. Sequence Diagrams

This section provides detailed sequence diagrams for critical user flows in the Fintrax application.

### 4.1 User Registration Flow with OTP Verification

```
Actor: User
Client: Next.js Frontend
Backend: Go/Gin API
DB: PostgreSQL
Email: SendGrid Service

┌─────┐          ┌────────┐         ┌─────────┐      ┌──────┐     ┌───────┐
│User │          │Client  │         │Backend  │      │  DB  │     │ Email │
└──┬──┘          └───┬────┘         └────┬────┘      └──┬───┘     └───┬───┘
   │                 │                   │              │             │
   │ 1. Fill         │                   │              │             │
   │ Registration    │                   │              │             │
   │ Form            │                   │              │             │
   ├────────────────>│                   │              │             │
   │                 │                   │              │             │
   │ 2. Submit Form  │                   │              │             │
   ├────────────────>│                   │              │             │
   │                 │                   │              │             │
   │                 │ 3. POST /register │              │             │
   │                 ├──────────────────>│              │             │
   │                 │ {email, password, │              │             │
   │                 │  username}        │              │             │
   │                 │                   │              │             │
   │                 │                   │ 4. Hash      │             │
   │                 │                   │ Password     │             │
   │                 │                   │ (bcrypt)     │             │
   │                 │                   │              │             │
   │                 │                   │ 5. Generate  │             │
   │                 │                   │ 6-digit OTP  │             │
   │                 │                   │              │             │
   │                 │                   │ 6. INSERT    │             │
   │                 │                   │ User Record  │             │
   │                 │                   ├─────────────>│             │
   │                 │                   │ Status:      │             │
   │                 │                   │ "notVerified"│             │
   │                 │                   │              │             │
   │                 │                   │<─────────────┤             │
   │                 │                   │ User Created │             │
   │                 │                   │              │             │
   │                 │                   │ 7. Send OTP  │             │
   │                 │                   │ via Email    │             │
   │                 │                   ├──────────────┼────────────>│
   │                 │                   │              │             │
   │                 │                   │              │             │ 8. Email
   │                 │                   │              │             │ Delivered
   │                 │                   │              │             │
   │                 │ 9. 201 Created    │              │             │
   │                 │<──────────────────┤              │             │
   │                 │ {userId, message} │              │             │
   │                 │                   │              │             │
   │ 10. Show OTP    │                   │              │             │
   │ Input Screen    │                   │              │             │
   │<────────────────┤                   │              │             │
   │                 │                   │              │             │
   │ 11. Enter OTP   │                   │              │             │
   ├────────────────>│                   │              │             │
   │                 │                   │              │             │
   │                 │ 12. POST          │              │             │
   │                 │ /verify-otp       │              │             │
   │                 ├──────────────────>│              │             │
   │                 │ {email, otp}      │              │             │
   │                 │                   │              │             │
   │                 │                   │ 13. Validate │             │
   │                 │                   │ OTP & Expiry │             │
   │                 │                   ├─────────────>│             │
   │                 │                   │ Check OTPTime│             │
   │                 │                   │<─────────────┤             │
   │                 │                   │              │             │
   │                 │                   │ 14. UPDATE   │             │
   │                 │                   │ User Status  │             │
   │                 │                   ├─────────────>│             │
   │                 │                   │ Status:      │             │
   │                 │                   │ "active"     │             │
   │                 │                   │<─────────────┤             │
   │                 │                   │              │             │
   │                 │                   │ 15. Create   │             │
   │                 │                   │ Finance      │             │
   │                 │                   │ Record       │             │
   │                 │                   ├─────────────>│             │
   │                 │                   │ Balance: 0.0 │             │
   │                 │                   │<─────────────┤             │
   │                 │                   │              │             │
   │                 │                   │ 16. Generate │             │
   │                 │                   │ JWT Token    │             │
   │                 │                   │              │             │
   │                 │ 17. 200 OK        │              │             │
   │                 │<──────────────────┤              │             │
   │                 │ {token, user}     │              │             │
   │                 │                   │              │             │
   │ 18. Redirect to │                   │              │             │
   │ Dashboard       │                   │              │             │
   │<────────────────┤                   │              │             │
   │                 │                   │              │             │
```

**Key Steps:**
1. User fills registration form (email, password, username)
2. Frontend validates input and submits to backend
3. Backend hashes password using bcrypt (cost factor 10)
4. Backend generates 6-digit random OTP
5. User record created with status "notVerified"
6. OTP sent via SendGrid email service
7. User enters OTP from email
8. Backend validates OTP and checks expiry (10-minute window)
9. User status updated to "active"
10. Finance record created with initial balance 0.0
11. JWT token generated and returned
12. User redirected to dashboard

---

### 4.2 User Login Flow with JWT Authentication

```
Actor: User
Client: Next.js Frontend
Backend: Go/Gin API
DB: PostgreSQL

┌─────┐          ┌────────┐         ┌─────────┐      ┌──────┐
│User │          │Client  │         │Backend  │      │  DB  │
└──┬──┘          └───┬────┘         └────┬────┘      └──┬───┘
   │                 │                   │              │
   │ 1. Enter Email  │                   │              │
   │ & Password      │                   │              │
   ├────────────────>│                   │              │
   │                 │                   │              │
   │                 │ 2. POST /login    │              │
   │                 ├──────────────────>│              │
   │                 │ {email, password} │              │
   │                 │                   │              │
   │                 │                   │ 3. Rate Limit│
   │                 │                   │ Check        │
   │                 │                   │ (5 req/min)  │
   │                 │                   │              │
   │                 │                   │ 4. Query User│
   │                 │                   ├─────────────>│
   │                 │                   │ WHERE email  │
   │                 │                   │<─────────────┤
   │                 │                   │ User Record  │
   │                 │                   │              │
   │                 │                   │ 5. Compare   │
   │                 │                   │ Password Hash│
   │                 │                   │ (bcrypt)     │
   │                 │                   │              │
   │                 │                   │ 6. Generate  │
   │                 │                   │ JWT Token    │
   │                 │                   │ Claims:      │
   │                 │                   │ - UserID     │
   │                 │                   │ - Email      │
   │                 │                   │ - Exp: 24h   │
   │                 │                   │              │
   │                 │ 7. 200 OK         │              │
   │                 │<──────────────────┤              │
   │                 │ {token, user}     │              │
   │                 │                   │              │
   │ 8. Store Token  │                   │              │
   │ in localStorage │                   │              │
   │<────────────────┤                   │              │
   │                 │                   │              │
   │ 9. Set Auth     │                   │              │
   │ Header for      │                   │              │
   │ Future Requests │                   │              │
   │<────────────────┤                   │              │
   │                 │                   │              │
   │ 10. Redirect to │                   │              │
   │ Dashboard       │                   │              │
   │<────────────────┤                   │              │
```

**Key Steps:**
1. User submits login credentials
2. Rate limiter checks (5 requests/minute for auth endpoints)
3. Backend queries user by email
4. Password verified using bcrypt.CompareHashAndPassword
5. JWT token generated with 24-hour expiry
6. Token stored in localStorage
7. Authorization header set for all subsequent API calls

**Error Scenarios:**
- Invalid credentials: 401 Unauthorized
- Account not verified: 403 Forbidden
- Rate limit exceeded: 429 Too Many Requests
- Account banned: 403 Forbidden

---

### 4.3 Create Task with Balance Update (Transaction Flow)

```
Actor: User
Client: Next.js Frontend
Backend: Go/Gin API
DB: PostgreSQL

┌─────┐          ┌────────┐         ┌─────────┐      ┌──────┐
│User │          │Client  │         │Backend  │      │  DB  │
└──┬──┘          └───┬────┘         └────┬────┘      └──┬───┘
   │                 │                   │              │
   │ 1. Fill Task    │                   │              │
   │ Creation Form   │                   │              │
   ├────────────────>│                   │              │
   │                 │                   │              │
   │                 │ 2. POST /todo     │              │
   │                 ├──────────────────>│              │
   │                 │ Authorization:    │              │
   │                 │ Bearer <token>    │              │
   │                 │ {task, priority,  │              │
   │                 │  projectId, ...}  │              │
   │                 │                   │              │
   │                 │                   │ 3. Validate  │
   │                 │                   │ JWT Token    │
   │                 │                   │ Extract      │
   │                 │                   │ UserID       │
   │                 │                   │              │
   │                 │                   │ 4. Rate Limit│
   │                 │                   │ Check        │
   │                 │                   │ (100 req/min)│
   │                 │                   │              │
   │                 │                   │ 5. Validate  │
   │                 │                   │ Input Data   │
   │                 │                   │              │
   │                 │                   │ 6. INSERT    │
   │                 │                   │ Todo Record  │
   │                 │                   ├─────────────>│
   │                 │                   │              │
   │                 │                   │<─────────────┤
   │                 │                   │ Todo Created │
   │                 │                   │              │
   │                 │ 7. 201 Created    │              │
   │                 │<──────────────────┤              │
   │                 │ {todo}            │              │
   │                 │                   │              │
   │ 8. Update UI    │                   │              │
   │ with New Task   │                   │              │
   │<────────────────┤                   │              │
```

---

### 4.4 Create Transaction with Atomic Balance Update

```
Actor: User
Client: Next.js Frontend
Backend: Go/Gin API
DB: PostgreSQL

┌─────┐          ┌────────┐         ┌─────────┐      ┌──────┐
│User │          │Client  │         │Backend  │      │  DB  │
└──┬──┘          └───┬────┘         └────┬────┘      └──┬───┘
   │                 │                   │              │
   │ 1. Fill         │                   │              │
   │ Transaction Form│                   │              │
   │ (Income/Expense)│                   │              │
   ├────────────────>│                   │              │
   │                 │                   │              │
   │                 │ 2. POST           │              │
   │                 │ /transaction      │              │
   │                 ├──────────────────>│              │
   │                 │ Authorization:    │              │
   │                 │ Bearer <token>    │              │
   │                 │ {source, amount,  │              │
   │                 │  type, category}  │              │
   │                 │                   │              │
   │                 │                   │ 3. Validate  │
   │                 │                   │ JWT & Extract│
   │                 │                   │ UserID       │
   │                 │                   │              │
   │                 │                   │ 4. BEGIN     │
   │                 │                   │ TRANSACTION  │
   │                 │                   ├─────────────>│
   │                 │                   │              │
   │                 │                   │ 5. INSERT    │
   │                 │                   │ Transaction  │
   │                 │                   │ Record       │
   │                 │                   ├─────────────>│
   │                 │                   │              │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 6. UPDATE    │
   │                 │                   │ Finance      │
   │                 │                   │ Balance      │
   │                 │                   ├─────────────>│
   │                 │                   │ If Income:   │
   │                 │                   │ Balance += $ │
   │                 │                   │ If Expense:  │
   │                 │                   │ Balance -= $ │
   │                 │                   │              │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 7. COMMIT    │
   │                 │                   ├─────────────>│
   │                 │                   │              │
   │                 │                   │<─────────────┤
   │                 │                   │ Success      │
   │                 │                   │              │
   │                 │ 8. 201 Created    │              │
   │                 │<──────────────────┤              │
   │                 │ {transaction,     │              │
   │                 │  newBalance}      │              │
   │                 │                   │              │
   │ 9. Update UI    │                   │              │
   │ Balance Display │                   │              │
   │<────────────────┤                   │              │
```

**ACID Transaction Flow:**
1. Begin database transaction
2. Insert transaction record
3. Update finance balance atomically
4. Commit transaction
5. On error: Rollback transaction

**Business Rules:**
- Income (Type=1): Balance increases
- Expense (Type=2): Balance decreases
- Balance update and transaction insert must be atomic
- If either fails, both rollback

---

### 4.5 Dashboard Metrics Aggregation Flow

```
Actor: User
Client: Next.js Frontend
Backend: Go/Gin API
DB: PostgreSQL

┌─────┐          ┌────────┐         ┌─────────┐      ┌──────┐
│User │          │Client  │         │Backend  │      │  DB  │
└──┬──┘          └───┬────┘         └────┬────┘      └──┬───┘
   │                 │                   │              │
   │ 1. Navigate to  │                   │              │
   │ Dashboard       │                   │              │
   ├────────────────>│                   │              │
   │                 │                   │              │
   │                 │ 2. GET /dashboard │              │
   │                 ├──────────────────>│              │
   │                 │ Authorization:    │              │
   │                 │ Bearer <token>    │              │
   │                 │                   │              │
   │                 │                   │ 3. Validate  │
   │                 │                   │ JWT & Extract│
   │                 │                   │ UserID       │
   │                 │                   │              │
   │                 │                   │ 4. Query     │
   │                 │                   │ Finance Data │
   │                 │                   ├─────────────>│
   │                 │                   │ SELECT       │
   │                 │                   │ Balance,     │
   │                 │                   │ TotalDebt    │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 5. Query     │
   │                 │                   │ Transactions │
   │                 │                   ├─────────────>│
   │                 │                   │ SUM(Amount)  │
   │                 │                   │ WHERE Type=1 │
   │                 │                   │ (Income)     │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 6. Query     │
   │                 │                   │ Expenses     │
   │                 │                   ├─────────────>│
   │                 │                   │ SUM(Amount)  │
   │                 │                   │ WHERE Type=2 │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 7. Query     │
   │                 │                   │ Savings      │
   │                 │                   ├─────────────>│
   │                 │                   │ SUM(Amount)  │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 8. Query     │
   │                 │                   │ Active Loans │
   │                 │                   ├─────────────>│
   │                 │                   │ WHERE        │
   │                 │                   │ Status=1     │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 9. Query     │
   │                 │                   │ Task Stats   │
   │                 │                   ├─────────────>│
   │                 │                   │ COUNT(*)     │
   │                 │                   │ GROUP BY     │
   │                 │                   │ Status       │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 10. Calculate│
   │                 │                   │ Net Worth    │
   │                 │                   │ = Balance +  │
   │                 │                   │   Savings -  │
   │                 │                   │   TotalDebt  │
   │                 │                   │              │
   │                 │ 11. 200 OK        │              │
   │                 │<──────────────────┤              │
   │                 │ {netWorth,        │              │
   │                 │  balance,         │              │
   │                 │  totalIncome,     │              │
   │                 │  totalExpense,    │              │
   │                 │  savings,         │              │
   │                 │  loans,           │              │
   │                 │  taskStats}       │              │
   │                 │                   │              │
   │ 12. Render      │                   │              │
   │ Dashboard with  │                   │              │
   │ Metrics         │                   │              │
   │<────────────────┤                   │              │
```

**Aggregated Metrics:**
1. **Net Worth** = Balance + Savings - TotalDebt
2. **Total Income** = SUM(Transactions WHERE Type=1)
3. **Total Expense** = SUM(Transactions WHERE Type=2)
4. **Savings** = SUM(Savings.Amount WHERE Status=1)
5. **Active Loans** = COUNT(Loans WHERE Status=1)
6. **Task Statistics** = COUNT(*) GROUP BY Status

---

### 4.6 Subtask Creation (Hierarchical Task Flow)

```
Actor: User
Client: Next.js Frontend
Backend: Go/Gin API
DB: PostgreSQL

┌─────┐          ┌────────┐         ┌─────────┐      ┌──────┐
│User │          │Client  │         │Backend  │      │  DB  │
└──┬──┘          └───┬────┘         └────┬────┘      └──┬───┘
   │                 │                   │              │
   │ 1. Click "Add   │                   │              │
   │ Subtask" on     │                   │              │
   │ Parent Task     │                   │              │
   ├────────────────>│                   │              │
   │                 │                   │              │
   │                 │ 2. POST /todo     │              │
   │                 ├──────────────────>│              │
   │                 │ {task,            │              │
   │                 │  parentId: 123,   │              │
   │                 │  projectId,       │              │
   │                 │  roadmapId}       │              │
   │                 │                   │              │
   │                 │                   │ 3. Query     │
   │                 │                   │ Parent Task  │
   │                 │                   ├─────────────>│
   │                 │                   │ SELECT *     │
   │                 │                   │ WHERE ID=123 │
   │                 │                   │<─────────────┤
   │                 │                   │              │
   │                 │                   │ 4. Inherit   │
   │                 │                   │ ProjectID &  │
   │                 │                   │ RoadmapID    │
   │                 │                   │ from Parent  │
   │                 │                   │              │
   │                 │                   │ 5. INSERT    │
   │                 │                   │ Subtask      │
   │                 │                   ├─────────────>│
   │                 │                   │ ParentID=123 │
   │                 │                   │              │
   │                 │                   │<─────────────┤
   │                 │                   │ Subtask      │
   │                 │                   │ Created      │
   │                 │                   │              │
   │                 │ 6. 201 Created    │              │
   │                 │<──────────────────┤              │
   │                 │ {subtask}         │              │
   │                 │                   │              │
   │ 7. Update UI    │                   │              │
   │ Show Subtask    │                   │              │
   │ Under Parent    │                   │              │
   │<────────────────┤                   │              │
```

**Hierarchical Rules:**
- Subtasks inherit ProjectID and RoadmapID from parent
- ParentID creates tree structure
- Deleting parent sets subtasks' ParentID to NULL (ON DELETE SET NULL)
- Maximum depth: Not enforced (can be added as business rule)

---

## 5. Algorithm Specifications

This section provides detailed algorithms for key business logic operations in Fintrax.

### 5.1 EMI/Premium Calculation Algorithm

**Purpose:** Calculate Equated Monthly Installment (EMI) for loans

**Formula:**
```
EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
- P = Principal loan amount (TotalAmount)
- r = Monthly interest rate (Rate / 12 / 100)
- n = Total number of payments (Term)
```

**Implementation:**

```go
// File: backend/helper/finance.go (proposed)

func CalculateEMI(principal float64, annualRate float64, termMonths uint) float64 {
    // Convert annual rate to monthly rate (as decimal)
    monthlyRate := (annualRate / 12.0) / 100.0

    // If interest rate is 0, simple division
    if monthlyRate == 0 {
        return principal / float64(termMonths)
    }

    // EMI formula: [P × r × (1 + r)^n] / [(1 + r)^n - 1]
    n := float64(termMonths)

    // Calculate (1 + r)^n
    powerTerm := math.Pow(1 + monthlyRate, n)

    // Calculate EMI
    emi := (principal * monthlyRate * powerTerm) / (powerTerm - 1)

    // Round to 2 decimal places
    return math.Round(emi * 100) / 100
}
```

**Example Calculation:**
```
Input:
- Principal: $100,000
- Annual Rate: 8.5%
- Term: 60 months (5 years)

Calculation:
- Monthly Rate: 8.5 / 12 / 100 = 0.00708333
- (1 + r)^n: (1.00708333)^60 = 1.53125
- EMI: (100000 × 0.00708333 × 1.53125) / (1.53125 - 1)
- EMI: $2,052.30

Verification:
- Total Payment: 2052.30 × 60 = $123,138
- Total Interest: $23,138
```

**Business Rules:**
- EMI calculated at loan creation time
- Stored in `PremiumAmount` field
- Rounded to 2 decimal places
- If rate is 0%, simple division (interest-free loan)

---

### 5.2 OTP Generation and Validation Algorithm

**Purpose:** Generate secure 6-digit OTP for email verification

**OTP Generation:**

```go
// File: backend/helper/otp.go (proposed)

import (
    "crypto/rand"
    "math/big"
    "time"
)

func GenerateOTP() (uint, error) {
    // Generate random number between 100000 and 999999
    max := big.NewInt(900000) // 999999 - 100000 + 1

    n, err := rand.Int(rand.Reader, max)
    if err != nil {
        return 0, err
    }

    // Add 100000 to get 6-digit number
    otp := uint(n.Int64() + 100000)

    return otp, nil
}

func GetOTPExpiry() time.Time {
    // OTP expires 10 minutes from now
    return time.Now().Add(10 * time.Minute)
}
```

**OTP Validation:**

```go
func ValidateOTP(userOTP uint, storedOTP uint, otpTime time.Time, otpTries int) (bool, error) {
    // Check if OTP tries exceeded
    if otpTries >= 3 {
        return false, errors.New("maximum OTP attempts exceeded")
    }

    // Check if OTP is expired (10 minutes)
    if time.Now().After(otpTime.Add(10 * time.Minute)) {
        return false, errors.New("OTP has expired")
    }

    // Check if OTP matches
    if userOTP != storedOTP {
        return false, errors.New("invalid OTP")
    }

    return true, nil
}
```

**Security Considerations:**
- Uses `crypto/rand` for cryptographically secure random numbers
- 6-digit OTP provides 1,000,000 possible combinations
- 10-minute expiry window reduces vulnerability
- Maximum 3 attempts prevents brute force
- OTP stored as uint (not hashed) for simplicity
- Single-use: OTP cleared after successful verification

**Flow:**
1. Generate random 6-digit number (100000-999999)
2. Store OTP and current timestamp
3. Send OTP via email
4. User submits OTP within 10 minutes
5. Validate: Check tries, expiry, match
6. Clear OTP on success or lockout on 3 failures

---

### 5.3 Roadmap Progress Calculation Algorithm

**Purpose:** Calculate progress percentage for roadmaps based on completed tasks

**Algorithm:**

```go
// File: backend/helper/progress.go (proposed)

func CalculateRoadmapProgress(todos []Todo) float64 {
    if len(todos) == 0 {
        return 0.0
    }

    totalTasks := len(todos)
    completedTasks := 0

    for _, todo := range todos {
        // Status 3 = Done
        if todo.Status == 3 {
            completedTasks++
        }
    }

    // Calculate percentage
    progress := (float64(completedTasks) / float64(totalTasks)) * 100.0

    // Round to 2 decimal places
    return math.Round(progress * 100) / 100
}
```

**Weighted Progress Algorithm (Future Enhancement):**

```go
// Future: Consider task priority in progress calculation
func CalculateWeightedProgress(todos []Todo) float64 {
    if len(todos) == 0 {
        return 0.0
    }

    totalWeight := 0.0
    completedWeight := 0.0

    for _, todo := range todos {
        // Priority 0-5, use as weight (0 defaults to 1)
        weight := float64(todo.Priority)
        if weight == 0 {
            weight = 1.0
        }

        totalWeight += weight

        if todo.Status == 3 { // Done
            completedWeight += weight
        }
    }

    if totalWeight == 0 {
        return 0.0
    }

    progress := (completedWeight / totalWeight) * 100.0
    return math.Round(progress * 100) / 100
}
```

**Example:**
```
Tasks:
1. Task A: Status = Done (3)
2. Task B: Status = In Progress (2)
3. Task C: Status = Done (3)
4. Task D: Status = Todo (1)

Simple Progress:
- Completed: 2 out of 4
- Progress: (2 / 4) × 100 = 50.00%

Weighted Progress (if priorities are A=5, B=3, C=4, D=2):
- Total Weight: 5 + 3 + 4 + 2 = 14
- Completed Weight: 5 + 4 = 9
- Progress: (9 / 14) × 100 = 64.29%
```

---

### 5.4 Balance Update Algorithm (Atomic Transaction)

**Purpose:** Update user balance atomically when transactions are created

**Algorithm:**

```go
// File: backend/controllers/transactionController.go

func CreateTransaction(c *gin.Context) {
    var transaction Transactions

    // Parse request
    if err := c.ShouldBindJSON(&transaction); err != nil {
        helper.Response(c, 400, "Invalid input", nil, nil)
        return
    }

    // Extract UserID from JWT
    userID := c.GetUint("user_id")
    transaction.UserID = userID

    // Begin database transaction
    tx := config.DB.Begin()

    // Step 1: Insert transaction record
    if err := tx.Create(&transaction).Error; err != nil {
        tx.Rollback()
        helper.Response(c, 500, "Failed to create transaction", nil, nil)
        return
    }

    // Step 2: Update balance atomically
    var finance Finance
    if err := tx.Where("user_id = ?", userID).First(&finance).Error; err != nil {
        tx.Rollback()
        helper.Response(c, 404, "Finance record not found", nil, nil)
        return
    }

    // Calculate new balance
    var newBalance float64
    if transaction.Type == 1 { // Income
        newBalance = finance.Balance + transaction.Amount
    } else { // Expense (Type == 2)
        newBalance = finance.Balance - transaction.Amount
    }

    // Update finance balance
    if err := tx.Model(&finance).Update("balance", newBalance).Error; err != nil {
        tx.Rollback()
        helper.Response(c, 500, "Failed to update balance", nil, nil)
        return
    }

    // Commit transaction
    if err := tx.Commit().Error; err != nil {
        helper.Response(c, 500, "Transaction commit failed", nil, nil)
        return
    }

    // Return success with new balance
    helper.Response(c, 201, "Transaction created", transaction, map[string]interface{}{
        "new_balance": newBalance,
    })
}
```

**ACID Properties:**
1. **Atomicity:** Both insert and update happen or neither happens
2. **Consistency:** Balance always reflects sum of transactions
3. **Isolation:** Concurrent transactions don't interfere
4. **Durability:** Committed changes persist

**Rollback Scenarios:**
- Transaction insert fails → No balance update
- Balance update fails → Transaction record removed
- Commit fails → All changes rolled back

---

### 5.5 Net Worth Calculation Algorithm

**Purpose:** Calculate user's total net worth from multiple sources

**Algorithm:**

```go
// File: backend/controllers/dashboardController.go

func CalculateNetWorth(userID uint) (float64, error) {
    var finance Finance
    var totalSavings float64
    var totalDebt float64

    // Get current balance
    if err := config.DB.Where("user_id = ?", userID).First(&finance).Error; err != nil {
        return 0, err
    }

    // Sum all active savings (Status = 1)
    config.DB.Model(&Savings{}).
        Where("user_id = ? AND status = 1", userID).
        Select("COALESCE(SUM(amount), 0)").
        Scan(&totalSavings)

    // Sum all active loan amounts (Status = 1)
    config.DB.Model(&Loans{}).
        Where("user_id = ? AND status = 1", userID).
        Select("COALESCE(SUM(total_amount), 0)").
        Scan(&totalDebt)

    // Net Worth = Balance + Savings - Debt
    netWorth := finance.Balance + totalSavings - totalDebt

    // Round to 2 decimal places
    return math.Round(netWorth * 100) / 100, nil
}
```

**Formula:**
```
Net Worth = Current Balance + Total Savings - Total Active Loans

Components:
- Current Balance: Finance.Balance
- Total Savings: SUM(Savings.Amount WHERE Status = 1)
- Total Active Loans: SUM(Loans.TotalAmount WHERE Status = 1)
```

**Example:**
```
User Financial Status:
- Current Balance: $5,000
- Savings Accounts:
  - Emergency Fund: $10,000 (Active)
  - Vacation Fund: $2,500 (Active)
  - Old Account: $1,000 (Matured/Withdrawn - Status ≠ 1)
- Active Loans:
  - Home Loan: $200,000 (Active)
  - Car Loan: $15,000 (Active)
  - Personal Loan: $5,000 (Paid - Status ≠ 1)

Calculation:
Net Worth = 5000 + (10000 + 2500) - (200000 + 15000)
Net Worth = 5000 + 12500 - 215000
Net Worth = -$197,500
```

---

### 5.6 Password Hashing Algorithm

**Purpose:** Securely hash passwords using bcrypt

**Implementation:**

```go
// File: backend/helper/password.go (proposed)

import "golang.org/x/crypto/bcrypt"

const BcryptCost = 10 // Cost factor for bcrypt

func HashPassword(password string) (string, error) {
    // Generate bcrypt hash
    hashedPassword, err := bcrypt.GenerateFromPassword(
        []byte(password),
        BcryptCost,
    )
    if err != nil {
        return "", err
    }

    return string(hashedPassword), nil
}

func ComparePasswords(hashedPassword string, plainPassword string) error {
    // Compare hashed password with plain text
    return bcrypt.CompareHashAndPassword(
        []byte(hashedPassword),
        []byte(plainPassword),
    )
}
```

**Algorithm Details:**
- **Algorithm:** bcrypt (Blowfish-based)
- **Cost Factor:** 10 (2^10 = 1,024 iterations)
- **Salt:** Auto-generated, 16 bytes (128 bits)
- **Output:** 60-character hash string

**Security Considerations:**
- Cost factor 10 provides ~100ms computation time
- Salt prevents rainbow table attacks
- Adaptive: can increase cost factor as hardware improves
- Resistant to brute force due to intentional slowness

**Example:**
```
Input: "MySecureP@ssw0rd"
Output: "$2a$10$N9qo8uLOickgx2ZMRZoMye.nrKOh3PmfQP4.5qGz0qGz0qGz0qGz0q"

Format: $2a$cost$salthash
- $2a: bcrypt identifier
- $10: cost factor (2^10 iterations)
- Next 22 chars: base64-encoded salt
- Remaining 31 chars: base64-encoded hash
```

---

### 5.7 JWT Token Generation Algorithm

**Purpose:** Generate secure JSON Web Tokens for authentication

**Implementation:**

```go
// File: backend/helper/jwt.go

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var JWTSecret = []byte(os.Getenv("JWT_SECRET")) // From environment

type Claims struct {
    UserID uint   `json:"user_id"`
    Email  string `json:"email"`
    jwt.RegisteredClaims
}

func GenerateJWT(userID uint, email string) (string, error) {
    // Create claims
    claims := Claims{
        UserID: userID,
        Email:  email,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            NotBefore: jwt.NewNumericDate(time.Now()),
            Issuer:    "fintrax-api",
        },
    }

    // Create token with HMAC-SHA256
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // Sign token with secret
    tokenString, err := token.SignedString(JWTSecret)
    if err != nil {
        return "", err
    }

    return tokenString, nil
}

func ValidateJWT(tokenString string) (*Claims, error) {
    // Parse token
    token, err := jwt.ParseWithClaims(
        tokenString,
        &Claims{},
        func(token *jwt.Token) (interface{}, error) {
            // Validate signing method
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method")
            }
            return JWTSecret, nil
        },
    )

    if err != nil {
        return nil, err
    }

    // Extract claims
    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }

    return nil, fmt.Errorf("invalid token")
}
```

**Token Structure:**
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "user_id": 123,
  "email": "user@example.com",
  "exp": 1700000000,
  "iat": 1699913600,
  "nbf": 1699913600,
  "iss": "fintrax-api"
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWTSecret
)
```

**Security:**
- Signing Algorithm: HMAC-SHA256
- Secret: 256-bit key from environment variable
- Expiry: 24 hours from issuance
- Validation: Signature, expiry, issuer checked

---

### 5.8 Rate Limiting Algorithm (Fixed Window Counter)

**Purpose:** Prevent abuse by limiting requests per IP address

**Implementation:**

Already documented in [middleware/rateLimit.go](#251-rate-limiter-middleware)

**Algorithm:**
```
1. Extract client IP from request
2. Get current time window (minute, 5 minutes, etc.)
3. Check if IP exists in rate limiter map
4. If exists and within window:
   - If count >= limit: Reject (429 Too Many Requests)
   - Else: Increment count, Allow request
5. If exists and window expired:
   - Reset counter to 1
   - Update window start time
   - Allow request
6. If not exists:
   - Create new entry with count = 1
   - Allow request
7. Background cleanup: Remove expired entries every 1 minute
```

**Example:**
```
Limit: 5 requests per minute
Window Start: 10:00:00

Request Timeline:
10:00:15 → Count: 1 → Allow
10:00:30 → Count: 2 → Allow
10:00:45 → Count: 3 → Allow
10:00:50 → Count: 4 → Allow
10:00:55 → Count: 5 → Allow
10:00:58 → Count: 6 → Reject (429)
10:01:05 → New window → Count: 1 → Allow
```

**Limitations:**
- Fixed window can allow 2x limit at window boundary
- Not distributed (single-instance memory)
- Alternative: Sliding window log (more accurate, higher memory)

---

### 5.9 Task Priority Sorting Algorithm

**Purpose:** Sort tasks by priority and due date

**Algorithm:**

```go
// File: backend/helper/sorting.go (proposed)

func SortTasks(tasks []Todo) []Todo {
    // Sort by priority (descending) then by EndDate (ascending)
    sort.Slice(tasks, func(i, j int) bool {
        // Higher priority comes first (5 before 1)
        if tasks[i].Priority != tasks[j].Priority {
            return tasks[i].Priority > tasks[j].Priority
        }

        // If priority same, earlier due date comes first
        return tasks[i].EndDate.Before(tasks[j].EndDate)
    })

    return tasks
}
```

**Sorting Rules:**
1. **Primary:** Priority (5 to 0, high to low)
2. **Secondary:** Due Date (earliest first)
3. **Tertiary:** Creation Date (oldest first, if dates match)

**Example:**
```
Input Tasks:
1. Task A: Priority 5, Due: 2025-12-01
2. Task B: Priority 3, Due: 2025-11-15
3. Task C: Priority 5, Due: 2025-11-20
4. Task D: Priority 3, Due: 2025-11-10

Sorted Output:
1. Task C: Priority 5, Due: 2025-11-20 (high priority, earlier)
2. Task A: Priority 5, Due: 2025-12-01 (high priority, later)
3. Task D: Priority 3, Due: 2025-11-10 (medium priority, earliest)
4. Task B: Priority 3, Due: 2025-11-15 (medium priority, later)
```

---

## 6. Component Implementation Details

This section provides detailed implementation specifications for key components, including complete controller methods, helper functions, and data flow patterns.

### 6.1 Authentication Controller Implementation

#### 6.1.1 User Registration

**Function:** `Register(c *gin.Context)`

**Purpose:** Handles new user registration with email verification via OTP

**Request Structure:**
```go
type registerRequest struct {
    Username string `json:"username" binding:"required"`
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
}
```

**Response Structure:**
```go
type registerResponse struct {
    ID       uint   `json:"user_id"`
    Username string `json:"username"`
    Email    string `json:"email"`
    Token    string `json:"token"`
}
```

**Implementation Flow:**

1. **Input Validation**
   - Bind JSON request to `registerRequest` struct
   - Gin's binding validation ensures all required fields are present
   - Returns 400 Bad Request if validation fails

2. **Duplicate User Check**
   ```go
   database.DB.Where("email = ?", req.Email).Find(&user)
   if len(user) > 0 {
       return 409 Conflict "User already exists"
   }
   ```

3. **Password Hashing**
   ```go
   hashedPassword, err := helper.HashPassword(req.Password)
   // Uses bcrypt with DefaultCost (cost factor 10)
   ```

4. **OTP Generation**
   ```go
   otp := rand.Intn(constants.MAX_OTP_LENGTH - constants.MIN_OTP_LENGTH + 1) + constants.MIN_OTP_LENGTH
   // Generates 6-digit OTP (100000-999999)
   ```

5. **Database Transaction (Atomic Operation)**
   ```go
   tx := database.DB.Begin()

   // Create user record with INACTIVE status
   newUser := models.Users{
       Username: req.Username,
       Email:    req.Email,
       Password: hashedPassword,
       Status:   constants.USER_STATUS_INACTIVE,
       OTP:      uint(otp),
       OTPTime:  time.Now(),
   }
   tx.Create(&newUser)

   // Create associated Finance record (1:1 relationship)
   finance := models.Finance{
       UserID:    newUser.ID,
       Balance:   0,
       TotalDebt: 0,
   }
   tx.Create(&finance)
   ```

6. **Email Verification Send**
   ```go
   emailBody := "Welcome to Fintrax!\n\nYour OTP for email verification is: " +
                strconv.Itoa(otp) +
                "\n\nThis OTP is valid for " +
                strconv.Itoa(constants.MAX_OTP_TIME) + " minutes."

   err := helper.SendEmail(newUser.Email, "Fintrax - Verify Your Email", emailBody)
   if err != nil {
       tx.Rollback()  // Rollback if email fails
       return 500 Internal Server Error
   }
   ```

7. **JWT Token Generation**
   ```go
   token, err := helper.CreateToken(newUser.ID)
   // Creates JWT with 24-hour expiry
   ```

8. **Transaction Commit with Panic Recovery**
   ```go
   defer func() {
       if r := recover(); r != nil {
           tx.Rollback()
           panic(r)  // Re-panic for outer error handling
       } else {
           tx.Commit()
       }
   }()
   ```

**Success Response:** 201 Created with user data and JWT token

**Error Responses:**
- 400: Invalid request body
- 409: User already exists
- 500: Password hashing failure, email send failure, or token creation failure

---

#### 6.1.2 User Login

**Function:** `Login(c *gin.Context)`

**Purpose:** Authenticates user and issues JWT token

**Request Structure:**
```go
type loginRequest struct {
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
}
```

**Response Structure:**
```go
type loginResponse struct {
    Token    string `json:"token"`
    UserID   uint   `json:"user_id"`
    Email    string `json:"email"`
    UserName string `json:"username"`
}
```

**Implementation Flow:**

1. **Input Validation**
   - Bind and validate JSON request

2. **User Lookup**
   ```go
   database.DB.Where("email = ?", req.Email).First(&user)
   if user.ID == 0 {
       return 401 Unauthorized "Invalid credentials"
   }
   ```

3. **Account Status Verification**
   ```go
   if user.Status != constants.USER_STATUS_ACTIVE {
       return 403 Forbidden "Please verify Email first"
   }
   ```

4. **Password Verification**
   ```go
   validPassword := helper.CheckPasswordHash(req.Password, user.Password)
   if !validPassword {
       return 401 Unauthorized "Invalid credentials"
   }
   ```

5. **JWT Token Generation**
   ```go
   token, err := helper.CreateToken(user.ID)
   ```

6. **Response Assembly**
   ```go
   loginResponseHandler := loginResponse{
       Token:    token,
       UserID:   user.ID,
       Email:    user.Email,
       UserName: user.Username,
   }
   ```

**Success Response:** 200 OK with JWT token and user details

**Error Responses:**
- 400: Invalid request body
- 401: Invalid credentials (user not found or wrong password)
- 403: Account not verified (email verification pending)
- 500: Token generation failure

---

#### 6.1.3 Email Verification

**Function:** `VerifyEmail(c *gin.Context)`

**Purpose:** Verifies user's email using OTP and activates account

**Request Structure:**
```go
struct {
    Email string `json:"email" binding:"required"`
    OTP   uint   `json:"OTP" binding:"required"`
}
```

**Implementation Flow:**

1. **User Lookup**
   ```go
   database.DB.Where("email = ?", req.Email).First(&user)
   ```

2. **OTP Expiry Check**
   ```go
   if user.OTP == 0 ||
      user.OTPTime.IsZero() ||
      time.Now().After(user.OTPTime.Add(time.Duration(constants.MAX_OTP_TIME) * time.Minute)) {
       return 400 Bad Request "OTP not generated or expired"
   }
   ```

3. **OTP Validation**
   ```go
   if uint(req.OTP) != user.OTP {
       return 400 Bad Request "Invalid OTP"
   }
   ```

4. **Account Activation**
   ```go
   user.Status = constants.USER_STATUS_ACTIVE
   database.DB.Save(&user)
   ```

**Success Response:** 200 OK "Email verified successfully"

**Error Responses:**
- 400: Invalid request, OTP expired, or invalid OTP
- 404: User not found

---

#### 6.1.4 OTP Generation for Password Reset

**Function:** `GenerateOTP(c *gin.Context)`

**Purpose:** Generates and sends OTP for password reset

**Request Structure:**
```go
type generateOTPRequest struct {
    Email string `json:"email" binding:"required"`
}
```

**Implementation Flow:**

1. **User Lookup**

2. **Rate Limiting Check**
   ```go
   if user.OTP != 0 &&
      time.Since(user.OTPTime) < time.Duration(constants.OTP_REGENERATION_TIME) * time.Minute {
       return 429 Too Many Requests "Please wait before generating a new one"
   }
   ```

3. **OTP Generation and Storage**
   ```go
   otp := rand.Intn(constants.MAX_OTP_LENGTH - constants.MIN_OTP_LENGTH + 1) + constants.MIN_OTP_LENGTH
   user.OTP = uint(otp)
   user.OTPTime = time.Now()
   database.DB.Save(&user)
   ```

4. **Email Send**
   ```go
   emailBody := "Your OTP for password reset is: " + strconv.Itoa(otp) +
                "\n\nThis OTP is valid for " + strconv.Itoa(constants.MAX_OTP_TIME) + " minutes."
   helper.SendEmail(user.Email, "Fintrax - OTP for Password Reset", emailBody)
   ```

**Success Response:** 200 OK with OTP (for development/testing)

**Error Responses:**
- 400: Invalid request
- 404: User not found
- 429: OTP already generated (rate limiting)
- 500: Email send failure

---

#### 6.1.5 Forgot Password

**Function:** `ForgotPassword(c *gin.Context)`

**Purpose:** Resets password using OTP verification

**Request Structure:**
```go
type forgotPasswordRequest struct {
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
    OTP      string `json:"otp" binding:"required"`
}
```

**Implementation Flow:**

1. **User Lookup**

2. **OTP Validation** (same as VerifyEmail)

3. **Password Hashing**
   ```go
   hashedPassword, err := helper.HashPassword(req.Password)
   ```

4. **Password Update**
   ```go
   user.Password = hashedPassword
   database.DB.Save(&user)
   ```

**Success Response:** 200 OK "Password updated successfully"

**Error Responses:**
- 400: Invalid request, OTP not generated, or OTP expired
- 404: User not found
- 500: Password hashing failure

---

### 6.2 Task Management Controller Implementation

#### 6.2.1 Create Task

**Function:** `CreateToDo(c *gin.Context)`

**Purpose:** Creates a new task with support for hierarchical subtasks

**Request Structure:**
```go
type todoRequest struct {
    Title       string    `json:"title" binding:"required"`
    Description string    `json:"description"`
    IsRoadmap   bool      `json:"is_roadmap" default:"false"`
    Priority    uint      `json:"priority" default:"5"`
    DueDays     uint      `json:"due_days" default:"0"`
    StartDate   time.Time `json:"start_date"`
    EndDate     time.Time `json:"end_date"`
    Status      uint      `json:"status" binding:"gte=1,lte=6" default:"1"`
    ParentID    *uint     `json:"parent_id" default:"0"`
    ProjectID   *uint     `json:"project_id"`
    RoadmapID   *uint     `json:"roadmap_id"`
}
```

**Implementation Flow:**

1. **Authentication Check**
   ```go
   userID, isExists := c.Get("user_id")
   if !isExists {
       return 401 Unauthorized
   }
   ```

2. **Task Creation**
   ```go
   todo := models.Todo{
       Task:        req.Title,
       Description: req.Description,
       IsRoadmap:   req.IsRoadmap,
       Priority:    req.Priority,
       DueDays:     req.DueDays,
       StartDate:   req.StartDate,
       EndDate:     req.EndDate,
       Status:      req.Status,
       ParentID:    req.ParentID,  // For hierarchical subtasks
       ProjectID:   req.ProjectID,
       RoadmapID:   req.RoadmapID,
       UserID:      uint(userID.(int)),
   }
   ```

3. **Database Transaction**
   ```go
   tx := database.DB.Begin()
   tx.Create(&todo)
   tx.Commit()
   ```

4. **Response Assembly**

**Success Response:** 201 Created with task details

**Error Responses:**
- 400: Invalid request body or validation failure
- 401: Unauthorized (no valid JWT)

---

#### 6.2.2 Get All Tasks with Filtering

**Function:** `GetAllToDos(c *gin.Context)`

**Purpose:** Retrieves all tasks for authenticated user with optional filtering

**Implementation Flow:**

1. **Base Query Construction**
   ```go
   query := database.DB.Where("status != ?", constants.STATUS_DELETED)
   ```

2. **Dynamic Filtering**
   ```go
   // Filter by project
   if projectID := c.Query("project_id"); projectID != "" {
       query = query.Where("project_id = ?", projectID)
   }

   // Filter by roadmap
   if roadmapID := c.Query("roadmap_id"); roadmapID != "" {
       query = query.Where("roadmap_id = ?", roadmapID)
   }
   ```

3. **Execute Query**
   ```go
   query.Find(&todos)
   ```

4. **Response Mapping**
   ```go
   response := make([]todoResponse, len(todos))
   for i, todo := range todos {
       response[i] = todoResponse{...}
   }
   ```

**Query Parameters:**
- `project_id` (optional): Filter tasks by project
- `roadmap_id` (optional): Filter tasks by roadmap

**Success Response:** 200 OK with array of tasks

---

#### 6.2.3 Update Task

**Function:** `UpdateToDo(c *gin.Context)`

**Purpose:** Updates existing task with partial update support

**Implementation Flow:**

1. **Task Lookup**
   ```go
   database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&todo)
   ```

2. **Selective Field Update**
   ```go
   if req.Title != "" {
       todo.Task = req.Title
   }
   if req.Description != "" {
       todo.Description = req.Description
   }
   if req.Priority != todo.Priority {
       todo.Priority = req.Priority
   }
   // ... additional fields
   ```

3. **Save Changes**
   ```go
   database.DB.Save(&todo)
   ```

**Success Response:** 200 OK with updated task

**Error Responses:**
- 400: Invalid request body
- 404: Task not found

---

#### 6.2.4 Soft Delete Task

**Function:** `DeleteToDo(c *gin.Context)`

**Purpose:** Soft deletes a task by marking status as DELETED

**Implementation Flow:**

1. **Task Lookup**

2. **Soft Delete**
   ```go
   todo.Status = constants.STATUS_DELETED
   todo.DeletedAt.Time = time.Now()
   todo.DeletedAt.Valid = true
   database.DB.Save(&todo)
   ```

**Note:** Uses soft delete pattern (GORM's DeletedAt) to maintain data integrity and audit trail

**Success Response:** 200 OK "Todo deleted successfully"

**Error Responses:**
- 404: Task not found

---

### 6.3 Transaction Controller Implementation

#### 6.3.1 Create Transaction

**Function:** `CreateTransaction(c *gin.Context)`

**Purpose:** Creates a new financial transaction

**Request Structure:**
```go
type transactionRequest struct {
    Source          string    `json:"source" binding:"required"`
    Amount          float64   `json:"amount" binding:"required,gt=0"`
    Type            uint      `json:"type" binding:"required,gte=1,lte=2"`  // 1=income, 2=expense
    TransactionType uint      `json:"transaction_type" binding:"gte=1,lte=5"`
    Category        string    `json:"category" binding:"required"`
    NotesID         *uint     `json:"notes_id"`
    Date            time.Time `json:"date"`
    Status          uint      `json:"status" binding:"gte=1,lte=6"`
}
```

**Implementation Flow:**

1. **Input Validation**
   - Amount must be greater than 0
   - Type must be 1 (income) or 2 (expense)
   - TransactionType must be 1-5
   - Status must be 1-6

2. **Authentication Check**
   ```go
   userID, isExists := c.Get("user_id")
   ```

3. **Default Values**
   ```go
   if req.Status == 0 {
       req.Status = constants.STATUS_NOT_STARTED
   }
   if req.Date.IsZero() {
       req.Date = time.Now()
   }
   ```

4. **Transaction Creation**
   ```go
   transaction := models.Transactions{
       Source:          req.Source,
       Amount:          req.Amount,
       Type:            req.Type,
       TransactionType: req.TransactionType,
       Category:        req.Category,
       NotesID:         req.NotesID,
       Date:            req.Date,
       UserID:          uint(userID.(int)),
       Status:          req.Status,
   }
   ```

5. **Database Transaction**
   ```go
   tx := database.DB.Begin()
   if err := tx.Create(&transaction).Error; err != nil {
       tx.Rollback()
       return 500 Internal Server Error
   }
   tx.Commit()
   ```

**Success Response:** 201 Created with transaction details

**Error Responses:**
- 400: Invalid request (validation failure)
- 401: Unauthorized
- 500: Database error

**Note:** Current implementation creates transaction record only. Balance update logic would be added separately (see Section 6.5 for atomic balance update pattern).

---

#### 6.3.2 Get All Transactions

**Function:** `GetAllTransactions(c *gin.Context)`

**Purpose:** Retrieves all transactions for authenticated user, sorted by date

**Implementation Flow:**

1. **Query with Sorting**
   ```go
   database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
       Order("date DESC").
       Find(&transactions)
   ```

2. **Response Mapping**

**Success Response:** 200 OK with array of transactions (newest first)

---

#### 6.3.3 Get Transaction Summary

**Function:** `GetTransactionSummary(c *gin.Context)`

**Purpose:** Provides aggregated transaction data by type and category

**Implementation Flow:**

1. **Aggregation Query**
   ```go
   database.DB.Model(&models.Transactions{}).
       Select("type, category, SUM(amount) as total, COUNT(*) as count").
       Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
       Group("type, category").
       Scan(&summary)
   ```

2. **Response Structure**
   ```go
   []struct {
       Type     uint    `json:"type"`
       Category string  `json:"category"`
       Total    float64 `json:"total"`
       Count    int64   `json:"count"`
   }
   ```

**Success Response:** 200 OK with aggregated data

**Use Cases:**
- Dashboard summary cards
- Category-wise expense breakdown
- Income vs. expense analysis
- Budget tracking

---

### 6.4 Dashboard Controller Implementation

#### 6.4.1 Get Dashboard Metrics

**Function:** `GetDashboard(c *gin.Context)`

**Purpose:** Aggregates and returns comprehensive dashboard metrics from multiple tables

**Implementation Flow:**

1. **Initialize Metric Variables**
   ```go
   var finance models.Finance
   var totalTodos int64
   var totalProjects int64
   var activeRoadmaps int64
   var totalSavings float64
   var totalLoans float64
   var totalIncome float64
   var totalExpense float64
   ```

2. **Parallel Metric Queries**

   **Finance Data:**
   ```go
   db.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).First(&finance)
   ```

   **Task Counts:**
   ```go
   db.Model(&models.Todo{}).
       Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
       Count(&totalTodos)
   ```

   **Project Counts:**
   ```go
   db.Model(&models.Project{}).
       Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
       Count(&totalProjects)
   ```

   **Active Roadmaps:**
   ```go
   db.Model(&models.Roadmap{}).
       Where("status = ?", 1).
       Count(&activeRoadmaps)
   ```

   **Savings Aggregation:**
   ```go
   db.Model(&models.Savings{}).
       Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
       Select("COALESCE(SUM(amount), 0)").
       Scan(&totalSavings)
   ```

   **Loans Aggregation:**
   ```go
   db.Model(&models.Loans{}).
       Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
       Select("COALESCE(SUM(total_amount), 0)").
       Scan(&totalLoans)
   ```

   **Income/Expense Aggregation:**
   ```go
   // Income (type = 1)
   db.Model(&models.Transactions{}).
       Where("type = ? AND status != ?", 1, constants.STATUS_DELETED).
       Select("COALESCE(SUM(amount), 0)").
       Scan(&totalIncome)

   // Expense (type = 2)
   db.Model(&models.Transactions{}).
       Where("type = ? AND status != ?", 2, constants.STATUS_DELETED).
       Select("COALESCE(SUM(amount), 0)").
       Scan(&totalExpense)
   ```

3. **Net Worth Calculation**
   ```go
   netWorth := finance.Balance + totalSavings - finance.TotalDebt - totalLoans
   ```

4. **Response Assembly**
   ```go
   dashboard := gin.H{
       "total_balance":   finance.Balance,
       "total_debt":      finance.TotalDebt,
       "total_savings":   totalSavings,
       "total_loans":     totalLoans,
       "total_income":    totalIncome,
       "total_expense":   totalExpense,
       "net_worth":       netWorth,
       "total_todo":      totalTodos,
       "total_projects":  totalProjects,
       "active_roadmaps": activeRoadmaps,
   }
   ```

**Success Response:** 200 OK with dashboard metrics

**Performance Considerations:**
- Uses `COALESCE(SUM(amount), 0)` to handle NULL aggregation results
- Excludes soft-deleted records (`status != STATUS_DELETED`)
- Single database connection for all queries
- Could be optimized with concurrent queries using goroutines

**Dashboard Metrics:**
- Financial: balance, debt, savings, loans, income, expense, net worth
- Productivity: total tasks, projects, active roadmaps

---

### 6.5 Helper Functions Implementation

#### 6.5.1 JWT Token Management

**Create Token:**
```go
func CreateToken(userID uint) (string, error) {
    token := jwt.NewWithClaims(
        jwt.SigningMethodHS256,
        jwt.MapClaims{
            "user_id": userID,
            "exp":     time.Now().Add(time.Hour * 24).Unix(),
        },
    )
    secretKey := []byte(os.Getenv("JWT_SECRET"))
    tokenString, err := token.SignedString(secretKey)
    return tokenString, err
}
```

**Token Details:**
- Algorithm: HS256 (HMAC with SHA-256)
- Expiry: 24 hours from creation
- Claims: `user_id` and `exp` (expiration timestamp)
- Secret: Environment variable `JWT_SECRET`

**Verify Token:**
```go
func VerifyToken(accessToken string) (int, error) {
    token, err := jwt.Parse(accessToken, func(t *jwt.Token) (interface{}, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
    })
    if err != nil {
        return 0, err
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if ok && token.Valid {
        return int(claims["user_id"].(float64)), nil
    }

    return 0, fmt.Errorf("invalid token")
}
```

**Verification Process:**
1. Parse token with secret key
2. Validate signature and expiry
3. Extract user_id from claims
4. Type assertion from float64 to int

**Error Cases:**
- Expired token
- Invalid signature
- Malformed token
- Missing claims

---

#### 6.5.2 Password Management

**Hash Password:**
```go
func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}
```

**Hash Details:**
- Algorithm: bcrypt
- Cost Factor: 10 (bcrypt.DefaultCost)
- Salt: Automatically generated per hash
- Output: 60-character hash string

**Security Features:**
- Adaptive hashing (slows down as hardware improves)
- Unique salt per password
- Computationally expensive to brute-force

**Check Password Hash:**
```go
func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

**Verification Process:**
1. Extract salt from stored hash
2. Hash input password with same salt
3. Constant-time comparison to prevent timing attacks

---

#### 6.5.3 Email Service

**Send Email:**
```go
func SendEmail(to string, subject string, body string) error {
    from := os.Getenv("EMAIL")
    password := os.Getenv("EMAIL_PASSWORD")

    // Set up authentication
    auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")

    // Send email
    err := smtp.SendMail(
        "smtp.gmail.com:587",
        auth,
        from,
        []string{to},
        []byte("Subject: " + subject + "\r\n\r\n" + body),
    )
    return err
}
```

**Email Configuration:**
- Provider: Gmail SMTP
- Server: smtp.gmail.com:587
- Authentication: SMTP PlainAuth
- Credentials: Environment variables `EMAIL` and `EMAIL_PASSWORD`

**Message Format:**
```
Subject: <subject>

<body>
```

**Use Cases:**
- OTP verification emails
- Password reset emails
- Welcome emails
- Notification emails

**Error Handling:**
- Network errors
- Authentication failures
- Invalid recipient addresses
- SMTP server errors

---

#### 6.5.4 Standardized API Response

**Response Function:**
```go
type APIResponse struct {
    Status  int         `json:"status"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Err     interface{} `json:"error,omitempty"`
}

func Response(c *gin.Context, status int, message string, data interface{}, err interface{}) {
    c.JSON(status, APIResponse{
        Status:  status,
        Message: message,
        Data:    data,
        Err:     err,
    })
}
```

**Response Structure:**
- `status`: HTTP status code (200, 201, 400, 401, 404, 500, etc.)
- `message`: Human-readable message
- `data`: Response payload (omitted if nil)
- `error`: Error details (omitted if nil)

**Example Success Response:**
```json
{
  "status": 200,
  "message": "Transaction created successfully",
  "data": {
    "id": 123,
    "amount": 1000.50,
    "type": 1
  }
}
```

**Example Error Response:**
```json
{
  "status": 400,
  "message": "Invalid request",
  "error": "amount: must be greater than 0"
}
```

**Benefits:**
- Consistent API response format across all endpoints
- Easier client-side error handling
- Clear separation of data and error information
- HTTP status code included in response body

---

### 6.6 Data Validation Patterns

#### 6.6.1 Struct-Level Validation

**Binding Tags:**
```go
type transactionRequest struct {
    Source   string  `json:"source" binding:"required"`
    Amount   float64 `json:"amount" binding:"required,gt=0"`
    Type     uint    `json:"type" binding:"required,gte=1,lte=2"`
    Category string  `json:"category" binding:"required"`
}
```

**Validation Rules:**
- `required`: Field must be present and non-zero
- `gt=0`: Greater than 0
- `gte=1,lte=2`: Greater than or equal to 1, less than or equal to 2
- `email`: Valid email format
- `min=8`: Minimum length 8

**Gin Binding Validation:**
```go
if err := c.ShouldBindJSON(&req); err != nil {
    helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
    return
}
```

---

#### 6.6.2 Database-Level Validation

**GORM Tags:**
```go
type Transactions struct {
    Amount float64 `json:"amount"`
    Type   uint    `json:"type" gorm:"default:1;check:type >= 1 AND type <= 2"`
    Status uint    `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
```

**Validation Constraints:**
- `check:type >= 1 AND type <= 2`: Database check constraint
- `default:1`: Default value if not provided
- `not null`: Field cannot be NULL
- `unique`: Value must be unique
- `size:150`: Maximum length

---

#### 6.6.3 Business Logic Validation

**OTP Expiry Validation:**
```go
if user.OTP == 0 ||
   user.OTPTime.IsZero() ||
   time.Now().After(user.OTPTime.Add(time.Duration(constants.MAX_OTP_TIME) * time.Minute)) {
    return 400 "OTP not generated or expired"
}
```

**Account Status Validation:**
```go
if user.Status != constants.USER_STATUS_ACTIVE {
    return 403 "Please verify Email first"
}
```

**Duplicate User Validation:**
```go
database.DB.Where("email = ?", req.Email).Find(&user)
if len(user) > 0 {
    return 409 "User already exists"
}
```

**Rate Limiting Validation:**
```go
if user.OTP != 0 &&
   time.Since(user.OTPTime) < time.Duration(constants.OTP_REGENERATION_TIME) * time.Minute {
    return 429 "Please wait before generating a new one"
}
```

---

### 6.7 Query Patterns

#### 6.7.1 Filtered Query Pattern

**Dynamic Filtering:**
```go
query := database.DB.Where("status != ?", constants.STATUS_DELETED)

if projectID := c.Query("project_id"); projectID != "" {
    query = query.Where("project_id = ?", projectID)
}

if roadmapID := c.Query("roadmap_id"); roadmapID != "" {
    query = query.Where("roadmap_id = ?", roadmapID)
}

query.Find(&todos)
```

**Benefits:**
- Flexible filtering based on query parameters
- Chain multiple conditions
- Clean and readable code

---

#### 6.7.2 Aggregation Query Pattern

**SUM Aggregation:**
```go
db.Model(&models.Savings{}).
    Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
    Select("COALESCE(SUM(amount), 0)").
    Scan(&totalSavings)
```

**COUNT Aggregation:**
```go
db.Model(&models.Todo{}).
    Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
    Count(&totalTodos)
```

**GROUP BY Aggregation:**
```go
database.DB.Model(&models.Transactions{}).
    Select("type, category, SUM(amount) as total, COUNT(*) as count").
    Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
    Group("type, category").
    Scan(&summary)
```

**Benefits:**
- `COALESCE(SUM(...), 0)` handles NULL results
- Efficient database-level aggregation
- Single query instead of iteration

---

#### 6.7.3 Soft Delete Pattern

**Delete Implementation:**
```go
todo.Status = constants.STATUS_DELETED
todo.DeletedAt.Time = time.Now()
todo.DeletedAt.Valid = true
database.DB.Save(&todo)
```

**Query Exclusion:**
```go
database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&todo)
```

**Benefits:**
- Data preservation for audit trail
- Ability to restore deleted records
- Historical data analysis
- Referential integrity maintained

---

## 7. Database Transaction Patterns

This section defines comprehensive database transaction patterns used throughout the application to ensure ACID compliance and data consistency.

### 7.1 ACID Properties Implementation

**Atomicity:**
- All operations within a transaction succeed or all fail
- Use `Begin()`, `Commit()`, and `Rollback()` pattern
- Ensure cleanup in error paths

**Consistency:**
- Database constraints enforce data validity
- Business rules validated before transactions
- Foreign key relationships maintained

**Isolation:**
- PostgreSQL default isolation level: Read Committed
- Prevents dirty reads, non-repeatable reads handled appropriately
- Lock contention minimized with short transaction windows

**Durability:**
- Committed transactions persist even after system failure
- PostgreSQL WAL (Write-Ahead Logging) ensures durability
- Database backups maintain recovery points

---

### 7.2 Basic Transaction Pattern

**Pattern Name:** Single Operation Transaction

**Use Case:** Creating a single record with rollback capability

**Implementation:**
```go
func CreateRecord(c *gin.Context) {
    var record models.Record

    // 1. Bind and validate input
    if err := c.ShouldBindJSON(&record); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
        return
    }

    // 2. Begin transaction
    tx := database.DB.Begin()

    // 3. Execute operation
    if err := tx.Create(&record).Error; err != nil {
        tx.Rollback()
        helper.Response(c, http.StatusInternalServerError, "Failed to create record", nil, err.Error())
        return
    }

    // 4. Commit transaction
    tx.Commit()

    helper.Response(c, http.StatusCreated, "Record created successfully", record, nil)
}
```

**Key Points:**
- Explicit error checking after each database operation
- Immediate rollback on error
- Commit only after all operations succeed

---

### 7.3 Multi-Operation Transaction Pattern

**Pattern Name:** Atomic Multi-Step Transaction

**Use Case:** User registration with associated finance record creation

**Implementation (from userController.go):**
```go
func Register(c *gin.Context) {
    // 1. Validation and preprocessing
    var req registerRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
        return
    }

    // 2. Business logic checks (outside transaction)
    var user []models.Users
    database.DB.Where("email = ?", req.Email).Find(&user)
    if len(user) > 0 {
        helper.Response(c, http.StatusConflict, "User already exists", nil, nil)
        return
    }

    hashedPassword, err := helper.HashPassword(req.Password)
    if err != nil {
        helper.Response(c, http.StatusInternalServerError, "Failed to hash password", nil, err)
        return
    }

    otp := rand.Intn(constants.MAX_OTP_LENGTH - constants.MIN_OTP_LENGTH + 1) + constants.MIN_OTP_LENGTH

    // 3. Begin transaction
    tx := database.DB.Begin()

    // 4. Operation 1: Create user
    newUser := models.Users{
        Username: req.Username,
        Email:    req.Email,
        Password: hashedPassword,
        Status:   constants.USER_STATUS_INACTIVE,
        OTP:      uint(otp),
        OTPTime:  time.Now(),
    }
    tx.Create(&newUser)

    // 5. Operation 2: Create finance record (1:1 relationship)
    finance := models.Finance{
        UserID:    newUser.ID,
        Balance:   0,
        TotalDebt: 0,
    }
    tx.Create(&finance)

    // 6. External operation (email send)
    emailBody := "Welcome to Fintrax!\n\nYour OTP for email verification is: " +
                 strconv.Itoa(otp) +
                 "\n\nThis OTP is valid for " +
                 strconv.Itoa(constants.MAX_OTP_TIME) + " minutes."

    err = helper.SendEmail(newUser.Email, "Fintrax - Verify Your Email", emailBody)
    if err != nil {
        tx.Rollback()  // Rollback if email fails
        helper.Response(c, http.StatusInternalServerError,
                       "User created but failed to send verification email", nil, err.Error())
        return
    }

    // 7. Generate JWT token
    token, err := helper.CreateToken(newUser.ID)
    if err != nil {
        tx.Rollback()
        helper.Response(c, http.StatusInternalServerError, "Failed to create token", nil, err)
        return
    }

    // 8. Commit with panic recovery
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
            panic(r)
        } else {
            tx.Commit()
        }
    }()

    response := registerResponse{
        ID:       newUser.ID,
        Username: newUser.Username,
        Email:    newUser.Email,
        Token:    token,
    }

    helper.Response(c, http.StatusCreated, "User created successfully", response, nil)
}
```

**Transaction Flow:**
1. **Validation Phase:** Check inputs and business rules BEFORE starting transaction
2. **Transaction Start:** `tx := database.DB.Begin()`
3. **Database Operations:** Create user and finance records
4. **External Operations:** Email send (with rollback on failure)
5. **Token Generation:** JWT creation (with rollback on failure)
6. **Commit:** Deferred commit with panic recovery
7. **Response:** Send success response to client

**Why External Operations Inside Transaction?**
- Email send is critical to user registration flow
- If email fails, user record should not exist (prevents orphaned accounts)
- User cannot verify email without receiving OTP
- Transaction ensures atomicity of entire registration process

---

### 7.4 Atomic Balance Update Pattern

**Pattern Name:** Dual-Record Update Transaction

**Use Case:** Creating transaction and updating user balance atomically

**Conceptual Implementation:**
```go
func CreateTransactionWithBalanceUpdate(c *gin.Context) {
    var req transactionRequest

    // 1. Validation
    if err := c.ShouldBindJSON(&req); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
        return
    }

    userID, exists := c.Get("user_id")
    if !exists {
        helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
        return
    }

    // 2. Begin transaction
    tx := database.DB.Begin()

    // 3. Operation 1: Create transaction record
    transaction := models.Transactions{
        Source:          req.Source,
        Amount:          req.Amount,
        Type:            req.Type,
        TransactionType: req.TransactionType,
        Category:        req.Category,
        Date:            req.Date,
        UserID:          uint(userID.(int)),
        Status:          req.Status,
    }

    if err := tx.Create(&transaction).Error; err != nil {
        tx.Rollback()
        helper.Response(c, http.StatusInternalServerError, "Failed to create transaction", nil, err.Error())
        return
    }

    // 4. Operation 2: Get current finance record (with row lock)
    var finance models.Finance
    if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
               Where("user_id = ?", userID).
               First(&finance).Error; err != nil {
        tx.Rollback()
        helper.Response(c, http.StatusInternalServerError, "Failed to get finance record", nil, err.Error())
        return
    }

    // 5. Calculate new balance
    var newBalance float64
    if transaction.Type == 1 { // Income
        newBalance = finance.Balance + transaction.Amount
    } else { // Expense
        newBalance = finance.Balance - transaction.Amount
    }

    // 6. Update balance
    if err := tx.Model(&finance).Update("balance", newBalance).Error; err != nil {
        tx.Rollback()
        helper.Response(c, http.StatusInternalServerError, "Failed to update balance", nil, err.Error())
        return
    }

    // 7. Commit transaction
    if err := tx.Commit().Error; err != nil {
        helper.Response(c, http.StatusInternalServerError, "Failed to commit transaction", nil, err.Error())
        return
    }

    response := transactionResponse{
        ID:     transaction.ID,
        Source: transaction.Source,
        Amount: transaction.Amount,
        Type:   transaction.Type,
    }

    helper.Response(c, http.StatusCreated, "Transaction created successfully", response, nil)
}
```

**Key Features:**
- **Row-Level Locking:** `Clauses(clause.Locking{Strength: "UPDATE"})` prevents concurrent updates
- **Atomic Update:** Both transaction record and balance updated or neither
- **Consistency:** Balance always reflects sum of transactions
- **Isolation:** Other transactions wait for lock release

**Concurrency Handling:**
```
Transaction A:                    Transaction B:
1. BEGIN                         1. BEGIN
2. INSERT transaction            2. INSERT transaction
3. SELECT finance FOR UPDATE     3. SELECT finance FOR UPDATE (WAITS)
4. UPDATE balance
5. COMMIT                        4. (Lock released, proceeds)
                                 5. UPDATE balance
                                 6. COMMIT
```

---

### 7.5 Transaction with Panic Recovery Pattern

**Pattern Name:** Deferred Commit with Panic Safety

**Use Case:** Complex operations that might panic unexpectedly

**Implementation:**
```go
func ComplexOperation(c *gin.Context) {
    tx := database.DB.Begin()

    // Deferred function ensures cleanup
    defer func() {
        if r := recover(); r != nil {
            // Panic occurred, rollback transaction
            tx.Rollback()

            // Log the panic for debugging
            log.Printf("Panic recovered in ComplexOperation: %v", r)

            // Re-panic to allow outer error handling
            panic(r)
        } else {
            // No panic, commit transaction
            tx.Commit()
        }
    }()

    // Perform operations that might panic
    tx.Create(&record1)
    tx.Create(&record2)

    // Complex operation that might panic
    result := riskyOperation()

    tx.Create(&record3)
}
```

**Benefits:**
- Guarantees transaction rollback even on unexpected panics
- Prevents partial data commits
- Maintains data consistency
- Re-panic allows outer middleware to handle error gracefully

**Panic Sources:**
- Nil pointer dereference
- Type assertion failures
- Third-party library panics
- Out-of-bounds array access

---

### 7.6 Optimistic Locking Pattern

**Pattern Name:** Version-Based Optimistic Concurrency Control

**Use Case:** Handling concurrent updates to same record

**Implementation:**
```go
// Model with version field
type Account struct {
    gorm.Model
    Balance float64
    Version uint `gorm:"default:0"`
}

func UpdateAccountWithOptimisticLock(accountID uint, newBalance float64) error {
    maxRetries := 3

    for attempt := 0; attempt < maxRetries; attempt++ {
        tx := database.DB.Begin()

        // 1. Read current record with version
        var account Account
        if err := tx.Where("id = ?", accountID).First(&account).Error; err != nil {
            tx.Rollback()
            return err
        }

        currentVersion := account.Version

        // 2. Update with version check
        result := tx.Model(&account).
                    Where("id = ? AND version = ?", accountID, currentVersion).
                    Updates(map[string]interface{}{
                        "balance": newBalance,
                        "version": currentVersion + 1,
                    })

        if result.Error != nil {
            tx.Rollback()
            return result.Error
        }

        // 3. Check if update succeeded
        if result.RowsAffected == 0 {
            // Version mismatch, retry
            tx.Rollback()
            time.Sleep(time.Millisecond * 50 * time.Duration(attempt+1)) // Exponential backoff
            continue
        }

        // 4. Commit successful update
        tx.Commit()
        return nil
    }

    return errors.New("failed to update after maximum retries")
}
```

**How It Works:**
1. Read record with current version number
2. Update record only if version hasn't changed
3. Increment version on successful update
4. Retry if version mismatch (concurrent update detected)

**Comparison with Pessimistic Locking:**

| Aspect | Optimistic Locking | Pessimistic Locking |
|--------|-------------------|---------------------|
| Performance | High (no locks) | Lower (lock contention) |
| Concurrency | High | Medium |
| Retry Logic | Required | Not needed |
| Best For | Low contention | High contention |
| Used In | Account updates | Financial transactions |

---

### 7.7 Nested Transaction Pattern (Savepoints)

**Pattern Name:** Partial Rollback with Savepoints

**Use Case:** Complex operations with multiple rollback points

**Implementation:**
```go
func ComplexOperationWithSavepoints(c *gin.Context) {
    tx := database.DB.Begin()

    // Step 1: Create main record
    tx.Create(&mainRecord)

    // Savepoint after main record
    tx.SavePoint("main_record_created")

    // Step 2: Create related records (might fail)
    for _, item := range items {
        if err := tx.Create(&item).Error; err != nil {
            // Rollback to savepoint (keep main record)
            tx.RollbackTo("main_record_created")

            // Log error but continue
            log.Printf("Failed to create item: %v", err)
            break
        }
    }

    // Step 3: Update aggregates
    tx.SavePoint("items_created")

    if err := tx.Model(&mainRecord).Update("count", len(items)).Error; err != nil {
        // Rollback to after items (keep items, retry count update)
        tx.RollbackTo("items_created")
    }

    // Final commit
    tx.Commit()
}
```

**Savepoint Use Cases:**
- Multi-step wizards
- Batch operations with partial failure tolerance
- Complex data migrations
- Import operations

---

### 7.8 Read-Only Transaction Pattern

**Pattern Name:** Consistent Read Snapshot

**Use Case:** Generating reports with consistent data view

**Implementation:**
```go
func GenerateFinancialReport(c *gin.Context) {
    userID, _ := c.Get("user_id")

    // Begin read-only transaction
    tx := database.DB.Begin()
    defer tx.Rollback() // Read-only, so rollback is safe

    // All queries see consistent snapshot
    var balance float64
    tx.Model(&models.Finance{}).
       Where("user_id = ?", userID).
       Select("balance").
       Scan(&balance)

    var totalIncome float64
    tx.Model(&models.Transactions{}).
       Where("user_id = ? AND type = ?", userID, 1).
       Select("COALESCE(SUM(amount), 0)").
       Scan(&totalIncome)

    var totalExpense float64
    tx.Model(&models.Transactions{}).
       Where("user_id = ? AND type = ?", userID, 2).
       Select("COALESCE(SUM(amount), 0)").
       Scan(&totalExpense)

    // All values from same point in time
    report := gin.H{
        "balance":       balance,
        "total_income":  totalIncome,
        "total_expense": totalExpense,
        "net_change":    totalIncome - totalExpense,
    }

    helper.Response(c, http.StatusOK, "Report generated", report, nil)
}
```

**Benefits:**
- Consistent data snapshot across multiple queries
- Prevents phantom reads
- No write locks (better performance)
- Safe for long-running analytical queries

---

### 7.9 Bulk Operation Transaction Pattern

**Pattern Name:** Batch Insert/Update

**Use Case:** Importing multiple records efficiently

**Implementation:**
```go
func BulkCreateTransactions(c *gin.Context) {
    var transactions []models.Transactions

    if err := c.ShouldBindJSON(&transactions); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
        return
    }

    tx := database.DB.Begin()

    // Batch insert (more efficient than individual inserts)
    batchSize := 100
    for i := 0; i < len(transactions); i += batchSize {
        end := i + batchSize
        if end > len(transactions) {
            end = len(transactions)
        }

        batch := transactions[i:end]
        if err := tx.Create(&batch).Error; err != nil {
            tx.Rollback()
            helper.Response(c, http.StatusInternalServerError,
                           fmt.Sprintf("Failed at batch %d", i/batchSize), nil, err.Error())
            return
        }
    }

    tx.Commit()

    helper.Response(c, http.StatusCreated,
                   fmt.Sprintf("Created %d transactions", len(transactions)), nil, nil)
}
```

**Performance Comparison:**
- Individual inserts: N round-trips to database
- Batch insert: N/batchSize round-trips
- Example: 1000 records, batch size 100 = 10 round-trips vs 1000

---

### 7.10 Transaction Isolation Levels

**Default: Read Committed**

PostgreSQL default isolation level used in Fintrax:

```go
// Implicit Read Committed isolation
tx := database.DB.Begin()
```

**Available Isolation Levels:**

1. **Read Uncommitted** (not supported in PostgreSQL)
   - Allows dirty reads
   - Not recommended

2. **Read Committed** (DEFAULT)
   - No dirty reads
   - Allows non-repeatable reads
   - Best for most use cases

3. **Repeatable Read**
   ```go
   tx := database.DB.Begin()
   tx.Exec("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ")
   ```
   - No dirty reads or non-repeatable reads
   - Allows phantom reads
   - Use for financial reports

4. **Serializable**
   ```go
   tx := database.DB.Begin()
   tx.Exec("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")
   ```
   - Full isolation
   - May cause serialization failures
   - Use for critical financial operations

**When to Use Each Level:**

| Use Case | Isolation Level | Reason |
|----------|----------------|--------|
| User registration | Read Committed | Default sufficient |
| Balance updates | Read Committed + Row Lock | Row locking provides isolation |
| Financial reports | Repeatable Read | Consistent snapshot needed |
| Double-entry accounting | Serializable | Full consistency required |

---

## 8. Error Handling Patterns

This section defines comprehensive error handling strategies to ensure robust and user-friendly error responses.

### 8.1 Error Types and Classification

**HTTP Status Code Mapping:**

```go
// Success Responses
200 OK              - Successful GET, PUT, PATCH, DELETE
201 Created         - Successful POST (resource created)
204 No Content      - Successful DELETE (no response body)

// Client Errors
400 Bad Request     - Invalid input, validation failure
401 Unauthorized    - Missing or invalid JWT token
403 Forbidden       - Valid token but insufficient permissions
404 Not Found       - Resource doesn't exist
409 Conflict        - Duplicate resource (e.g., email already exists)
422 Unprocessable   - Semantic errors (e.g., invalid state transition)
429 Too Many Requests - Rate limit exceeded

// Server Errors
500 Internal Server Error - Database errors, unexpected failures
503 Service Unavailable   - External service down (e.g., email service)
```

---

### 8.2 Validation Error Handling

#### 8.2.1 Struct-Level Validation Errors

**Pattern:**
```go
func CreateTransaction(c *gin.Context) {
    var req transactionRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        // Parse validation errors
        var validationErrors []string

        if validationErr, ok := err.(validator.ValidationErrors); ok {
            for _, fieldErr := range validationErr {
                validationErrors = append(validationErrors,
                    fmt.Sprintf("%s: %s", fieldErr.Field(), fieldErr.Tag()))
            }
        }

        helper.Response(c, http.StatusBadRequest, "Validation failed", nil, validationErrors)
        return
    }

    // Continue with validated data
}
```

**Example Error Response:**
```json
{
  "status": 400,
  "message": "Validation failed",
  "error": [
    "Amount: required",
    "Type: gte",
    "Category: required"
  ]
}
```

---

#### 8.2.2 Business Logic Validation Errors

**Pattern:**
```go
func VerifyEmail(c *gin.Context) {
    var req verifyEmailRequest

    // 1. Struct validation
    if err := c.ShouldBindJSON(&req); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
        return
    }

    // 2. User existence check
    var user models.Users
    database.DB.Where("email = ?", req.Email).First(&user)
    if user.ID == 0 {
        helper.Response(c, http.StatusNotFound, "User not found", nil, nil)
        return
    }

    // 3. Business rule: OTP expiry check
    if user.OTP == 0 || user.OTPTime.IsZero() {
        helper.Response(c, http.StatusBadRequest, "OTP not generated", nil,
                       "Please request a new OTP")
        return
    }

    if time.Now().After(user.OTPTime.Add(time.Duration(constants.MAX_OTP_TIME) * time.Minute)) {
        helper.Response(c, http.StatusBadRequest, "OTP expired", nil,
                       "OTP has expired. Please request a new one")
        return
    }

    // 4. Business rule: OTP validation
    if uint(req.OTP) != user.OTP {
        // Increment failed attempts
        user.OTPTries++
        database.DB.Save(&user)

        // Check attempt limit
        if user.OTPTries >= constants.MAX_OTP_TRIES {
            helper.Response(c, http.StatusForbidden, "Too many failed attempts", nil,
                           "Please request a new OTP")
            return
        }

        helper.Response(c, http.StatusBadRequest, "Invalid OTP", nil,
                       fmt.Sprintf("Attempts remaining: %d", constants.MAX_OTP_TRIES - user.OTPTries))
        return
    }

    // Continue with successful verification
}
```

**Error Response Examples:**

**OTP Expired:**
```json
{
  "status": 400,
  "message": "OTP expired",
  "error": "OTP has expired. Please request a new one"
}
```

**Invalid OTP:**
```json
{
  "status": 400,
  "message": "Invalid OTP",
  "error": "Attempts remaining: 2"
}
```

---

### 8.3 Database Error Handling

#### 8.3.1 Connection Errors

**Pattern:**
```go
func EnsureDatabaseConnection() error {
    if database.DB == nil {
        return errors.New("database connection not initialized")
    }

    // Test connection
    sqlDB, err := database.DB.DB()
    if err != nil {
        return fmt.Errorf("failed to get database instance: %w", err)
    }

    if err := sqlDB.Ping(); err != nil {
        return fmt.Errorf("database ping failed: %w", err)
    }

    return nil
}
```

---

#### 8.3.2 Transaction Errors

**Pattern:**
```go
func CreateWithTransaction(c *gin.Context) {
    tx := database.DB.Begin()

    // Check if transaction started successfully
    if tx.Error != nil {
        helper.Response(c, http.StatusInternalServerError,
                       "Failed to start transaction", nil, tx.Error.Error())
        return
    }

    // Perform operations
    if err := tx.Create(&record).Error; err != nil {
        tx.Rollback()

        // Check for specific errors
        if errors.Is(err, gorm.ErrDuplicatedKey) {
            helper.Response(c, http.StatusConflict, "Duplicate record", nil, err.Error())
            return
        }

        if errors.Is(err, gorm.ErrRecordNotFound) {
            helper.Response(c, http.StatusNotFound, "Related record not found", nil, err.Error())
            return
        }

        // Generic database error
        helper.Response(c, http.StatusInternalServerError,
                       "Database operation failed", nil, err.Error())
        return
    }

    // Commit transaction
    if err := tx.Commit().Error; err != nil {
        helper.Response(c, http.StatusInternalServerError,
                       "Failed to commit transaction", nil, err.Error())
        return
    }

    helper.Response(c, http.StatusCreated, "Record created successfully", record, nil)
}
```

---

#### 8.3.3 Constraint Violation Errors

**Pattern:**
```go
func handleDatabaseError(err error) (int, string, string) {
    if err == nil {
        return 0, "", ""
    }

    // Foreign key violation
    if strings.Contains(err.Error(), "foreign key constraint") {
        return http.StatusBadRequest,
               "Invalid reference",
               "Referenced record does not exist"
    }

    // Unique constraint violation
    if strings.Contains(err.Error(), "unique constraint") ||
       strings.Contains(err.Error(), "duplicate key") {
        return http.StatusConflict,
               "Duplicate record",
               "A record with this value already exists"
    }

    // Check constraint violation
    if strings.Contains(err.Error(), "check constraint") {
        return http.StatusBadRequest,
               "Invalid value",
               "Value does not meet database constraints"
    }

    // Not null violation
    if strings.Contains(err.Error(), "not null constraint") {
        return http.StatusBadRequest,
               "Missing required field",
               "A required field is missing"
    }

    // Generic database error
    return http.StatusInternalServerError,
           "Database error",
           err.Error()
}

// Usage
if err := tx.Create(&user).Error; err != nil {
    tx.Rollback()
    status, message, detail := handleDatabaseError(err)
    helper.Response(c, status, message, nil, detail)
    return
}
```

---

### 8.4 Authentication Error Handling

#### 8.4.1 JWT Token Errors

**Pattern:**
```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Extract token from header
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            helper.Response(c, http.StatusUnauthorized,
                           "Missing authorization header", nil, nil)
            c.Abort()
            return
        }

        // 2. Parse Bearer token
        parts := strings.SplitN(authHeader, " ", 2)
        if len(parts) != 2 || parts[0] != "Bearer" {
            helper.Response(c, http.StatusUnauthorized,
                           "Invalid authorization header format", nil,
                           "Expected: Bearer <token>")
            c.Abort()
            return
        }

        token := parts[1]

        // 3. Verify token
        userID, err := helper.VerifyToken(token)
        if err != nil {
            if strings.Contains(err.Error(), "expired") {
                helper.Response(c, http.StatusUnauthorized,
                               "Token expired", nil,
                               "Please login again")
            } else if strings.Contains(err.Error(), "invalid") {
                helper.Response(c, http.StatusUnauthorized,
                               "Invalid token", nil,
                               "Token verification failed")
            } else {
                helper.Response(c, http.StatusUnauthorized,
                               "Authentication failed", nil, err.Error())
            }
            c.Abort()
            return
        }

        // 4. Set user ID in context
        c.Set("user_id", userID)
        c.Next()
    }
}
```

**Error Responses:**

**Missing Token:**
```json
{
  "status": 401,
  "message": "Missing authorization header"
}
```

**Expired Token:**
```json
{
  "status": 401,
  "message": "Token expired",
  "error": "Please login again"
}
```

---

#### 8.4.2 Login Errors

**Pattern:**
```go
func Login(c *gin.Context) {
    var req loginRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
        return
    }

    // 1. User lookup (don't reveal if user exists)
    var user models.Users
    database.DB.Where("email = ?", req.Email).First(&user)
    if user.ID == 0 {
        // Generic error message for security
        helper.Response(c, http.StatusUnauthorized,
                       "Invalid credentials", nil, nil)
        return
    }

    // 2. Account status check
    if user.Status != constants.USER_STATUS_ACTIVE {
        helper.Response(c, http.StatusForbidden,
                       "Account not active", nil,
                       "Please verify your email address")
        return
    }

    // 3. Password verification (don't reveal which is wrong)
    validPassword := helper.CheckPasswordHash(req.Password, user.Password)
    if !validPassword {
        helper.Response(c, http.StatusUnauthorized,
                       "Invalid credentials", nil, nil)
        return
    }

    // Continue with successful login
}
```

**Security Considerations:**
- Use generic "Invalid credentials" message
- Don't reveal if email exists
- Don't specify if email or password is wrong
- Prevents user enumeration attacks

---

### 8.5 Rate Limiting Error Handling

**Pattern:**
```go
func RateLimitMiddleware(limiter *RateLimiter) gin.HandlerFunc {
    return func(c *gin.Context) {
        clientIP := c.ClientIP()

        if !limiter.Allow(clientIP) {
            // Get retry-after time
            retryAfter := limiter.GetRetryAfter(clientIP)

            c.Header("Retry-After", fmt.Sprintf("%d", int(retryAfter.Seconds())))
            c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", limiter.limit))
            c.Header("X-RateLimit-Remaining", "0")
            c.Header("X-RateLimit-Reset",
                    fmt.Sprintf("%d", time.Now().Add(retryAfter).Unix()))

            helper.Response(c, http.StatusTooManyRequests,
                           "Rate limit exceeded", nil,
                           fmt.Sprintf("Please try again in %d seconds", int(retryAfter.Seconds())))
            c.Abort()
            return
        }

        // Add rate limit headers to successful response
        remaining := limiter.GetRemaining(clientIP)
        c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", limiter.limit))
        c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))

        c.Next()
    }
}
```

**Error Response:**
```json
{
  "status": 429,
  "message": "Rate limit exceeded",
  "error": "Please try again in 45 seconds"
}
```

**Response Headers:**
```
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699564800
```

---

### 8.6 External Service Error Handling

#### 8.6.1 Email Service Errors

**Pattern:**
```go
func sendEmailWithRetry(to, subject, body string, maxRetries int) error {
    for attempt := 1; attempt <= maxRetries; attempt++ {
        err := helper.SendEmail(to, subject, body)

        if err == nil {
            return nil // Success
        }

        // Check if error is retryable
        if !isRetryableEmailError(err) {
            return fmt.Errorf("non-retryable email error: %w", err)
        }

        // Last attempt failed
        if attempt == maxRetries {
            return fmt.Errorf("failed after %d attempts: %w", maxRetries, err)
        }

        // Exponential backoff
        backoff := time.Duration(attempt*attempt) * time.Second
        time.Sleep(backoff)

        log.Printf("Email send attempt %d/%d failed, retrying in %v: %v",
                   attempt, maxRetries, backoff, err)
    }

    return errors.New("unexpected error in retry loop")
}

func isRetryableEmailError(err error) bool {
    errMsg := err.Error()

    // Network errors are retryable
    if strings.Contains(errMsg, "network") ||
       strings.Contains(errMsg, "timeout") ||
       strings.Contains(errMsg, "connection refused") {
        return true
    }

    // Authentication errors are not retryable
    if strings.Contains(errMsg, "authentication failed") ||
       strings.Contains(errMsg, "invalid credentials") {
        return false
    }

    // Invalid recipient is not retryable
    if strings.Contains(errMsg, "invalid recipient") {
        return false
    }

    // Default to retryable for unknown errors
    return true
}
```

**Usage in Registration:**
```go
func Register(c *gin.Context) {
    // ... user creation logic ...

    // Send email with retry
    err := sendEmailWithRetry(newUser.Email, "Fintrax - Verify Your Email", emailBody, 3)
    if err != nil {
        tx.Rollback()

        if strings.Contains(err.Error(), "non-retryable") {
            helper.Response(c, http.StatusBadRequest,
                           "Invalid email address", nil, err.Error())
        } else {
            helper.Response(c, http.StatusServiceUnavailable,
                           "Email service temporarily unavailable", nil,
                           "Please try again later")
        }
        return
    }

    // Continue with success
}
```

---

### 8.7 Panic Recovery Middleware

**Pattern:**
```go
func RecoveryMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        defer func() {
            if r := recover(); r != nil {
                // Log panic with stack trace
                stack := make([]byte, 4096)
                length := runtime.Stack(stack, false)

                log.Printf("Panic recovered: %v\n%s", r, stack[:length])

                // Send error response
                helper.Response(c, http.StatusInternalServerError,
                               "Internal server error", nil,
                               "An unexpected error occurred")

                c.Abort()
            }
        }()

        c.Next()
    }
}
```

**Registration:**
```go
router := gin.Default()
router.Use(RecoveryMiddleware())
```

---

### 8.8 Structured Error Logging

**Pattern:**
```go
type ErrorLog struct {
    Timestamp   time.Time              `json:"timestamp"`
    Level       string                 `json:"level"`
    RequestID   string                 `json:"request_id"`
    UserID      interface{}            `json:"user_id,omitempty"`
    Method      string                 `json:"method"`
    Path        string                 `json:"path"`
    StatusCode  int                    `json:"status_code"`
    Error       string                 `json:"error"`
    StackTrace  string                 `json:"stack_trace,omitempty"`
    Context     map[string]interface{} `json:"context,omitempty"`
}

func LogError(c *gin.Context, err error, context map[string]interface{}) {
    userID, _ := c.Get("user_id")
    requestID, _ := c.Get("request_id")

    errorLog := ErrorLog{
        Timestamp:  time.Now(),
        Level:      "error",
        RequestID:  requestID.(string),
        UserID:     userID,
        Method:     c.Request.Method,
        Path:       c.Request.URL.Path,
        StatusCode: c.Writer.Status(),
        Error:      err.Error(),
        Context:    context,
    }

    // Add stack trace for 500 errors
    if c.Writer.Status() >= 500 {
        stack := make([]byte, 4096)
        length := runtime.Stack(stack, false)
        errorLog.StackTrace = string(stack[:length])
    }

    // Log as JSON
    logJSON, _ := json.Marshal(errorLog)
    log.Println(string(logJSON))
}
```

**Usage:**
```go
if err := tx.Create(&user).Error; err != nil {
    tx.Rollback()

    LogError(c, err, map[string]interface{}{
        "operation": "create_user",
        "email":     req.Email,
    })

    helper.Response(c, http.StatusInternalServerError,
                   "Failed to create user", nil, nil)
    return
}
```

---

### 8.9 Error Response Standards

**Success Response Format:**
```json
{
  "status": 200,
  "message": "Operation successful",
  "data": {
    "id": 123,
    "name": "John Doe"
  }
}
```

**Error Response Format:**
```json
{
  "status": 400,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

**Complete Error Response Structure:**
```go
type ErrorResponse struct {
    Status  int          `json:"status"`
    Message string       `json:"message"`
    Error   ErrorDetails `json:"error,omitempty"`
}

type ErrorDetails struct {
    Code      string            `json:"code"`
    Details   []FieldError      `json:"details,omitempty"`
    Timestamp time.Time         `json:"timestamp"`
    RequestID string            `json:"request_id,omitempty"`
}

type FieldError struct {
    Field   string `json:"field"`
    Message string `json:"message"`
    Value   string `json:"value,omitempty"`
}
```

---
