# High-Level Design (HLD)
## Fintrax - Integrated Productivity and Finance Management Platform

**Document Version:** 1.0
**Date:** November 13, 2025
**Status:** Approved
**Classification:** System Architecture

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-11-01 | Architecture Team | Initial draft |
| 0.5 | 2025-11-07 | Technical Lead | Architecture review |
| 1.0 | 2025-11-13 | Solution Architect | Final approval |
---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [System Components](#4-system-components)
5. [Data Architecture](#5-data-architecture)
6. [Integration Architecture](#6-integration-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Performance Architecture](#9-performance-architecture)
10. [Scalability and High Availability](#10-scalability-and-high-availability)

---

## 1. Introduction

### 1.1 Purpose

This High-Level Design (HLD) document describes the system architecture for Fintrax, an integrated productivity and finance management platform. It provides:

- **System architecture overview** with component interactions
- **Technology stack** rationale and selection criteria
- **Data flow** between system components
- **Integration points** with external services
- **Deployment topology** and infrastructure design
- **Security architecture** and data protection strategies
- **Scalability and performance** considerations

**Target Audience:**
- Solution Architects
- Technical Leads
- Development Team
- DevOps Engineers
- Security Team
- Stakeholders and Decision Makers

### 1.2 Scope

**In Scope:**
- Complete system architecture (client, server, database, external services)
- Component design and responsibilities
- Data flow diagrams
- Technology selection and justification
- Deployment architecture for production
- Security architecture and authentication flows
- Performance and scalability strategies

**Out of Scope:**
- Detailed code-level implementation (covered in LLD)
- API endpoint specifications (covered in API Contract document)
- Database table schemas (covered in Database Design document)
- UI/UX design mockups (covered in Design System document)

### 1.3 Design Principles

**Architectural Principles:**

1. **Separation of Concerns**
   - Frontend and backend are decoupled
   - Each layer has a single, well-defined responsibility
   - Clear boundaries between presentation, business logic, and data access

2. **Statelessness**
   - Backend is stateless (JWT-based authentication)
   - No server-side session storage
   - Enables horizontal scaling

3. **Security by Design**
   - Authentication and authorization at every layer
   - Input validation on server-side (never trust client)
   - Sensitive data encrypted in transit and at rest

4. **Performance First**
   - Database query optimization with proper indexing
   - Frontend code splitting and lazy loading
   - Caching strategies for frequently accessed data

5. **Fail-Safe and Resilient**
   - Graceful error handling (no crashes)
   - Database transactions for data consistency
   - Automatic retry for transient failures

6. **Scalable and Maintainable**
   - Modular architecture (easy to extend)
   - Cloud-native design (horizontal scaling)
   - Well-documented codebase

---

## 2. System Architecture Overview

### 2.1 Architectural Style

**Fintrax follows a 3-Tier Client-Server Architecture with RESTful API:**

1. **Presentation Tier:** Next.js frontend (React components, Zustand state management)
2. **Application Tier:** Go backend (Gin framework, business logic)
3. **Data Tier:** PostgreSQL database (persistent storage)

**Architecture Pattern:** **Layered Architecture with MVC-inspired structure**

```
┌──────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 Frontend (React 19)                │  │
│  │  ┌──────────────┬───────────────┬────────────────────┐    │  │
│  │  │  Pages       │  Components   │  State Management  │    │  │
│  │  │  (App Router)│  (UI Library) │  (Zustand)         │    │  │
│  │  └──────────────┴───────────────┴────────────────────┘    │  │
│  │                         │                                  │  │
│  │                         │ HTTPS/REST API (JSON)            │  │
│  └─────────────────────────┼──────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                       APPLICATION TIER                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                Go Backend (Gin Framework)                  │  │
│  │  ┌─────────────┬──────────────┬─────────────────────────┐ │  │
│  │  │  Routes     │  Middleware  │  Controllers            │ │  │
│  │  │  (Routing)  │  (Auth/CORS) │  (Business Logic)       │ │  │
│  │  └─────────────┴──────────────┴─────────────────────────┘ │  │
│  │  ┌─────────────┬──────────────┬─────────────────────────┐ │  │
│  │  │  Models     │  Helpers     │  External Integrations  │ │  │
│  │  │  (GORM ORM) │  (JWT, etc.) │  (Email Service)        │ │  │
│  │  └─────────────┴──────────────┴─────────────────────────┘ │  │
│  │                         │                                  │  │
│  │                         │ SQL Queries (GORM)               │  │
│  └─────────────────────────┼──────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                          DATA TIER                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   PostgreSQL Database                      │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Tables: Users, Finance, Todos, Projects,            │  │  │
│  │  │  Transactions, Savings, Loans, Roadmaps, etc.        │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Email Service│  │ Cloud Storage│  │  Monitoring  │            │
│  │  (SendGrid)  │  │   (AWS S3)   │  │   (Future)   │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           User/Browser                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Load Balancer / CDN                          │
│                    (Future: Cloudflare, AWS ELB)                    │
└──────────────┬──────────────────────────────┬───────────────────────┘
               │                              │
               │ Static Assets                │ API Requests
               ▼                              ▼
┌──────────────────────────┐    ┌────────────────────────────────────┐
│  Frontend Application    │    │      Backend API Server(s)         │
│  (Next.js SSR/SSG)       │    │      (Go + Gin)                    │
│  ┌────────────────────┐  │    │  ┌──────────────────────────────┐ │
│  │ React Components   │  │    │  │  HTTP Router (Gin)           │ │
│  ├────────────────────┤  │    │  ├──────────────────────────────┤ │
│  │ Zustand Store      │  │    │  │  Middleware Layer            │ │
│  ├────────────────────┤  │    │  │  - CORS                      │ │
│  │ API Client         │◄─┼────┼─►│  - JWT Authentication        │ │
│  │ (fetch)            │  │    │  │  - Rate Limiting             │ │
│  └────────────────────┘  │    │  │  - Recovery                  │ │
└──────────────────────────┘    │  ├──────────────────────────────┤ │
                                │  │  Controller Layer            │ │
                                │  │  - User Controller           │ │
                                │  │  - Task Controller           │ │
                                │  │  - Finance Controller        │ │
                                │  │  - Project Controller        │ │
                                │  ├──────────────────────────────┤ │
                                │  │  Service/Helper Layer        │ │
                                │  │  - JWT Helper                │ │
                                │  │  - Password Helper           │ │
                                │  │  - Email Helper              │ │
                                │  ├──────────────────────────────┤ │
                                │  │  Data Access Layer (GORM)    │ │
                                │  └─────────────┬────────────────┘ │
                                └────────────────┼──────────────────┘
                                                 │ SQL
                                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Schema: public                                               │  │
│  │  Tables: users, finance, todos, projects, transactions,       │  │
│  │          savings, loans, roadmaps, resources, notes, tags     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Backup & Replication
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Database Backups (Automated)                     │
│                    Retention: 30 days                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      External Integrations                          │
│  ┌──────────────────┐       ┌──────────────────┐                   │
│  │  SendGrid API    │       │  Future Services │                   │
│  │  (Email Delivery)│       │  - Calendar Sync │                   │
│  │                  │       │  - Bank APIs     │                   │
│  └──────────────────┘       └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 System Context Diagram

**Actors and External Systems:**

```
┌──────────────┐
│   End User   │
│  (Browser)   │
└──────┬───────┘
       │
       │ Interacts via
       │ Web Browser
       │
       ▼
┌──────────────────────────────────────────┐
│          Fintrax System                  │
│  ┌────────────────────────────────────┐  │
│  │  Frontend (Next.js)                │  │
│  └────────────┬───────────────────────┘  │
│               │ REST API                 │
│  ┌────────────▼───────────────────────┐  │
│  │  Backend (Go + Gin)                │  │
│  └────────────┬───────────────────────┘  │
│               │ SQL                      │
│  ┌────────────▼───────────────────────┐  │
│  │  Database (PostgreSQL)             │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
       │                    │
       │ SMTP               │ Future: OAuth, APIs
       ▼                    ▼
┌──────────────┐     ┌──────────────────┐
│  SendGrid    │     │  Future Services │
│  (Email)     │     │  - Google Cal    │
│              │     │  - Bank APIs     │
└──────────────┘     └──────────────────┘
```

**External Dependencies:**

| System | Purpose | Protocol | Criticality |
|--------|---------|----------|-------------|
| SendGrid | Email delivery (OTP, notifications) | HTTPS/SMTP | High (authentication depends on it) |
| PostgreSQL | Data persistence | TCP/IP (SQL) | Critical (entire app depends on it) |
| Cloud Provider | Hosting (AWS/GCP/Railway) | HTTPS | Critical |
| Let's Encrypt | SSL/TLS certificates | ACME Protocol | High (HTTPS required) |

---

## 3. Technology Stack

### 3.1 Technology Selection Matrix

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Frontend Framework** | Next.js | 15.x | - Server-side rendering (SEO, performance)<br>- App Router for modern routing<br>- Built-in code splitting and optimization<br>- React 19 support |
| **UI Library** | React | 19.x | - Component-based architecture<br>- Large ecosystem<br>- Excellent developer experience<br>- JSX auto-escapes (XSS prevention) |
| **State Management** | Zustand | 5.x | - Lightweight (< 1KB)<br>- Simple API<br>- No boilerplate<br>- TypeScript support |
| **Styling** | Tailwind CSS | 4.x | - Utility-first CSS<br>- Rapid development<br>- Consistent design system<br>- Small bundle size (tree-shaking) |
| **Backend Framework** | Go (Golang) | 1.23+ | - High performance (compiled language)<br>- Excellent concurrency (goroutines)<br>- Built-in HTTP server<br>- Strong typing |
| **HTTP Router** | Gin | 1.10.x | - Fast routing (40x faster than alternatives)<br>- Middleware support<br>- JSON validation<br>- Active community |
| **ORM** | GORM | 1.25.x | - PostgreSQL support<br>- Auto-migration<br>- Relationship handling<br>- SQL injection prevention |
| **Database** | PostgreSQL | 14+ | - ACID compliance<br>- JSON support (future)<br>- Excellent performance<br>- Open-source |
| **Authentication** | JWT | RFC 7519 | - Stateless authentication<br>- Scalable (no session storage)<br>- Industry standard |
| **Password Hashing** | bcrypt | - | - Adaptive cost factor<br>- Built-in salt<br>- Industry standard |
| **Email Service** | SendGrid | API v3 | - 99%+ deliverability<br>- Free tier (100 emails/day)<br>- Webhook support<br>- Scalable |
| **Migration Tool** | golang-migrate | 4.x | - Up/down migrations<br>- Version control<br>- CLI and library support |
| **Language** | TypeScript | 5.x | - Type safety<br>- Better IDE support<br>- Compile-time error detection |

### 3.2 Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js 15 (Framework)                               │  │
│  │    ├─ React 19 (UI Library)                           │  │
│  │    ├─ TypeScript 5 (Language)                         │  │
│  │    ├─ Zustand 5 (State Management)                    │  │
│  │    └─ Tailwind CSS 4 (Styling)                        │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Build Tools                                          │  │
│  │    ├─ Turbopack (Next.js bundler)                     │  │
│  │    ├─ PostCSS (CSS processing)                        │  │
│  │    └─ ESLint (Code linting)                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      BACKEND STACK                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Go 1.23+ (Language)                                  │  │
│  │    ├─ Gin 1.10 (HTTP Framework)                       │  │
│  │    ├─ GORM 1.25 (ORM)                                 │  │
│  │    ├─ JWT-go 5.2 (Authentication)                     │  │
│  │    ├─ bcrypt (Password Hashing)                       │  │
│  │    └─ godotenv (Environment Variables)                │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Development Tools                                    │  │
│  │    ├─ gofmt (Code Formatting)                         │  │
│  │    ├─ go test (Testing Framework)                     │  │
│  │    └─ golang-migrate (Database Migrations)            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      DATABASE & STORAGE                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 14+ (Relational Database)                 │  │
│  │    ├─ ACID Transactions                               │  │
│  │    ├─ Foreign Key Constraints                         │  │
│  │    └─ Indexing for Performance                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  SendGrid (Email Delivery)                            │  │
│  │  Future: AWS S3 (File Storage)                        │  │
│  │  Future: Redis (Caching)                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Alternative Technologies Considered

| Decision | Options Considered | Selected | Reason for Selection |
|----------|-------------------|----------|----------------------|
| Backend Language | Go, Node.js, Python | **Go** | Superior performance, built-in concurrency, compiled binaries |
| Frontend Framework | Next.js, Vite+React, Remix | **Next.js** | SSR/SSG out of box, excellent DX, Vercel deployment |
| Database | PostgreSQL, MySQL, MongoDB | **PostgreSQL** | ACID compliance, JSON support, strong community |
| State Management | Zustand, Redux, Jotai | **Zustand** | Simplicity, minimal boilerplate, small bundle size |
| ORM | GORM, sqlx, Ent | **GORM** | Active development, PostgreSQL support, auto-migrations |
| CSS Framework | Tailwind, Bootstrap, Styled-Components | **Tailwind** | Utility-first, tree-shaking, consistency |
| Email Service | SendGrid, AWS SES, Mailgun | **SendGrid** | Free tier, excellent deliverability, simple API |

---

## 4. System Components

### 4.1 Frontend Components

#### 4.1.1 Frontend Architecture

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth-related pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── dashboard/          # Main dashboard
│   │   ├── projects/           # Project management
│   │   │   └── [projectId]/    # Dynamic project detail
│   │   ├── tasks/              # Task management
│   │   ├── finance/            # Finance pages
│   │   │   ├── transactions/
│   │   │   ├── savings/
│   │   │   └── loans/
│   │   ├── roadmaps/           # Learning roadmaps
│   │   ├── settings/           # User settings
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable UI components
│   │   ├── Dashboard/          # Dashboard widgets
│   │   ├── Task/               # Task components
│   │   ├── Project/            # Project components
│   │   ├── Finance/            # Finance components
│   │   ├── Fields/             # Form inputs
│   │   ├── Layout/             # Layout components
│   │   └── common/             # Common UI elements
│   ├── lib/                    # Core utilities
│   │   ├── api.ts              # API client
│   │   ├── store.ts            # Zustand store
│   │   └── financeStore.ts     # Finance state
│   ├── constants/              # Constants and types
│   │   ├── interfaces.tsx      # TypeScript interfaces
│   │   └── generalConstants.tsx # App constants
│   ├── utils/                  # Utility functions
│   ├── services/               # Business logic
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

**Component Responsibilities:**

| Component | Responsibility | Key Features |
|-----------|----------------|--------------|
| **Pages (App Router)** | Route handling, page composition | SSR/SSG, data fetching, layouts |
| **Components** | Reusable UI building blocks | Stateless/stateful, props validation |
| **Store (Zustand)** | Global state management | Projects, tasks, UI state, modals |
| **API Client** | HTTP communication with backend | Fetch wrapper, error handling, auth headers |
| **Middleware** | Route protection, redirects | Auth checking (future) |
| **Services** | Business logic, data transformation | Formatting, calculations |

#### 4.1.2 State Management Architecture

**Zustand Store Structure:**

```typescript
// Global App Store
interface AppState {
  // Data
  projects: Project[];
  tasks: Task[];
  selectedProject: Project | null;
  selectedTask: Task | null;

  // UI State
  isTaskModalOpen: boolean;
  isProjectModalOpen: boolean;
  currentView: 'kanban' | 'calendar';

  // Actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // ... more actions
}

// Finance Store (separate)
interface FinanceState {
  balance: number;
  transactions: Transaction[];
  savings: Savings[];
  loans: Loan[];

  addTransaction: (transaction: Transaction) => void;
  // ... more actions
}
```

**State Management Principles:**
- **Single Source of Truth:** All app state in Zustand stores
- **Immutable Updates:** Use spread operator for state updates
- **Derived State:** Calculate values from existing state (don't duplicate)
- **Async Actions:** Fetch data in components, update store after success

### 4.2 Backend Components

#### 4.2.1 Backend Architecture

```
backend/
├── main.go                     # Application entry point
├── constants/                  # Application constants
│   ├── constant.go             # Status codes, types
│   └── request.go              # Request structures
├── controllers/                # HTTP request handlers
│   ├── userController.go       # User management
│   ├── todoController.go       # Task CRUD
│   ├── projectController.go    # Project management
│   ├── financeController.go    # Finance overview
│   ├── transactionController.go# Transaction CRUD
│   ├── savingsController.go    # Savings CRUD
│   ├── loansController.go      # Loan CRUD
│   ├── roadmapController.go    # Roadmap management
│   ├── resourceController.go   # Resource attachments
│   ├── noteController.go       # Note management
│   ├── tagController.go        # Tag system
│   └── dashboardController.go  # Dashboard aggregation
├── models/                     # GORM data models
│   ├── user.go                 # User model
│   ├── finance.go              # Finance model
│   ├── todo.go                 # Task model
│   ├── project.go              # Project model
│   ├── transactions.go         # Transaction model
│   ├── Savings.go              # Savings model
│   ├── loans.go                # Loan model
│   ├── roadmap.go              # Roadmap model
│   ├── resources.go            # Resource model
│   ├── notes.go                # Note model
│   └── tags.go                 # Tag model
├── routes/                     # Route registration
│   ├── userRoute.go            # User endpoints
│   ├── todoRoute.go            # Task endpoints
│   ├── projectRoute.go         # Project endpoints
│   ├── financeRoute.go         # Finance endpoints
│   ├── transactionRoute.go     # Transaction endpoints
│   ├── savingsRoute.go         # Savings endpoints
│   ├── loansRoute.go           # Loan endpoints
│   ├── roadmapRoute.go         # Roadmap endpoints
│   ├── resourceRoute.go        # Resource endpoints
│   ├── noteRoute.go            # Note endpoints
│   ├── tagRoute.go             # Tag endpoints
│   └── dashboard.go            # Dashboard endpoint
├── middleware/                 # HTTP middleware
│   ├── authorization.go        # JWT validation
│   ├── rateLimit.go            # Rate limiting
│   └── recovery.go             # Panic recovery
├── helper/                     # Utility functions
│   ├── jwtHelper.go            # JWT creation/verification
│   ├── password.go             # bcrypt hashing
│   ├── mailHelper.go           # Email sending
│   └── response.go             # Response formatting
├── database/                   # Database connection
│   └── db.go                   # GORM connection setup
├── migrations/                 # SQL migration files
│   ├── 000001_*.up.sql         # Up migrations
│   └── 000001_*.down.sql       # Down migrations
├── .env                        # Environment variables (gitignored)
├── .env.example                # Example env file
├── go.mod                      # Go module definition
└── go.sum                      # Dependency checksums
```

**Component Responsibilities:**

| Component | Responsibility | Key Features |
|-----------|----------------|--------------|
| **main.go** | Application bootstrap | Database connection, migration, router setup, server start |
| **Controllers** | Business logic, request handling | Validation, data processing, response formatting |
| **Models** | Data structures, ORM mapping | GORM models, relationships, validations |
| **Routes** | Endpoint registration, grouping | Route grouping, middleware application |
| **Middleware** | Cross-cutting concerns | Authentication, logging, error handling |
| **Helpers** | Reusable utilities | JWT, password, email, response formatting |
| **Database** | Database connection management | GORM initialization, connection pooling |

#### 4.2.2 Layered Architecture

**Request Flow through Layers:**

```
HTTP Request
    │
    ▼
┌─────────────────────────────────┐
│  Router (Gin)                   │ ◄─ Route matching
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Middleware Layer               │
│  ├─ CORS Middleware             │ ◄─ Cross-origin handling
│  ├─ Rate Limiter                │ ◄─ Request throttling
│  ├─ JWT Authorization           │ ◄─ Token validation
│  └─ Recovery Middleware         │ ◄─ Panic recovery
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Controller Layer               │
│  ├─ Request Validation          │ ◄─ Input validation
│  ├─ Business Logic              │ ◄─ Core functionality
│  └─ Response Formatting         │ ◄─ Standardized responses
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Data Access Layer (GORM)       │
│  ├─ Query Building              │ ◄─ SQL generation
│  ├─ Transaction Management      │ ◄─ ACID guarantees
│  └─ Relationship Loading        │ ◄─ JOIN operations
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Database (PostgreSQL)          │ ◄─ Data persistence
└─────────────────────────────────┘
             │
             ▼
HTTP Response (JSON)
```

**Layer Communication Rules:**
- Each layer communicates only with adjacent layers (no skipping)
- Upper layers depend on lower layers (not vice versa)
- Lower layers have no knowledge of upper layers
- Data transformation happens at layer boundaries

### 4.3 Database Components

**Database Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Schema: public                                       │  │
│  │                                                       │  │
│  │  Core Tables:                                         │  │
│  │  ├─ users (authentication, profiles)                 │  │
│  │  ├─ finance (balance, debt aggregation)              │  │
│  │  │                                                    │  │
│  │  Productivity Tables:                                 │  │
│  │  ├─ todos (tasks with hierarchical structure)        │  │
│  │  ├─ projects (task grouping)                         │  │
│  │  ├─ roadmaps (learning paths)                        │  │
│  │  ├─ resources (file/link attachments)                │  │
│  │  ├─ notes (text annotations)                         │  │
│  │  ├─ tags (categorization)                            │  │
│  │  └─ todo_tags (many-to-many join)                    │  │
│  │                                                       │  │
│  │  Finance Tables:                                      │  │
│  │  ├─ transactions (income/expense records)            │  │
│  │  ├─ savings (savings instruments)                    │  │
│  │  └─ loans (loan tracking with EMI)                   │  │
│  │                                                       │  │
│  │  Constraints:                                         │  │
│  │  ├─ Primary Keys (auto-increment)                    │  │
│  │  ├─ Foreign Keys (CASCADE, SET NULL)                 │  │
│  │  ├─ CHECK Constraints (data validation)              │  │
│  │  └─ UNIQUE Constraints (email, etc.)                 │  │
│  │                                                       │  │
│  │  Indexes:                                             │  │
│  │  ├─ idx_users_email (unique)                         │  │
│  │  ├─ idx_todos_user_id                                │  │
│  │  ├─ idx_todos_status                                 │  │
│  │  ├─ idx_transactions_user_id                         │  │
│  │  └─ idx_transactions_date (DESC)                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Database Design Principles:**
- **Normalized to 3NF:** Minimize data redundancy
- **Foreign Key Constraints:** Ensure referential integrity
- **Indexed Columns:** Optimize query performance (user_id, status, dates)
- **Soft Deletes:** Use deleted_at timestamp instead of hard deletes
- **Audit Timestamps:** created_at, updated_at on all tables

---

## 5. Data Architecture

### 5.1 Data Flow Diagram - User Registration

```
┌──────┐                                  ┌──────────────────┐
│Client│                                  │Backend (Go)      │
└───┬──┘                                  └─────────┬────────┘
    │                                               │
    │ POST /api/user/register                       │
    │ {username, email, password}                   │
    ├──────────────────────────────────────────────►│
    │                                               │
    │                        ┌──────────────────────┤
    │                        │ 1. Validate Input    │
    │                        └──────────────────────┤
    │                        ┌──────────────────────┤
    │                        │ 2. Check Email Unique│
    │                        │    (Query DB)        │
    │                        └──────────────────────┤
    │                        ┌──────────────────────┤
    │                        │ 3. Hash Password     │
    │                        │    (bcrypt)          │
    │                        └──────────────────────┤
    │                        ┌──────────────────────┤
    │                        │ 4. Generate OTP      │
    │                        │    (Random 1000-9999)│
    │                        └──────────────────────┤
    │                        ┌──────────────────────┤
    │                        │ 5. Begin DB Txn      │
    │                        └──────────────────────┤
    │                                               │
    │                                               ▼
    │                                  ┌─────────────────────┐
    │                                  │PostgreSQL           │
    │                                  │                     │
    │                        ┌─────────┤ INSERT users        │
    │                        │         │ (status=Inactive)   │
    │                        │         └─────────────────────┘
    │                        │         ┌─────────────────────┐
    │                        │         │ INSERT finance      │
    │                        │         │ (balance=0)         │
    │                        │         └─────────────────────┘
    │                        │                     │
    │                        │ 6. Commit Txn       │
    │                        └─────────────────────┤
    │                        ┌─────────────────────┤
    │                        │ 7. Generate JWT     │
    │                        └─────────────────────┤
    │                                               │
    │                                               ▼
    │                                  ┌─────────────────────┐
    │                                  │SendGrid API         │
    │                        ┌─────────┤ Send OTP Email      │
    │                        │         └─────────────────────┘
    │                        │                     │
    │                        │ 8. Return Response  │
    │◄───────────────────────┴─────────────────────┤
    │ 201 Created                                   │
    │ {user_id, token, ...}                         │
    │                                               │
```

### 5.2 Data Flow Diagram - Create Task with Balance Update

```
┌──────┐                                  ┌──────────────────┐
│Client│                                  │Backend (Go)      │
└───┬──┘                                  └─────────┬────────┘
    │                                               │
    │ POST /api/todo                                │
    │ Authorization: Bearer <JWT>                   │
    │ {title, description, priority, ...}           │
    ├──────────────────────────────────────────────►│
    │                                               │
    │                        ┌──────────────────────┤
    │                        │ 1. Extract JWT Token │
    │                        └──────────────────────┤
    │                        ┌──────────────────────┤
    │                        │ 2. Verify JWT        │
    │                        │    (Get user_id)     │
    │                        └──────────────────────┤
    │                        ┌──────────────────────┤
    │                        │ 3. Validate Input    │
    │                        └──────────────────────┤
    │                        ┌──────────────────────┤
    │                        │ 4. Create Task Model │
    │                        └──────────────────────┤
    │                                               │
    │                                               ▼
    │                                  ┌─────────────────────┐
    │                                  │PostgreSQL           │
    │                        ┌─────────┤ INSERT todos        │
    │                        │         │ (user_id, title,...)│
    │                        │         └─────────────────────┘
    │                        │                     │
    │                        │ 5. Return Created   │
    │◄───────────────────────┴─────────────────────┤
    │ 201 Created                                   │
    │ {task_id, title, ...}                         │
    │                                               │
```

### 5.3 Data Flow Diagram - Dashboard Aggregation

```
┌──────┐                                  ┌──────────────────┐
│Client│                                  │Backend (Go)      │
└───┬──┘                                  └─────────┬────────┘
    │                                               │
    │ GET /api/dashboard                            │
    │ Authorization: Bearer <JWT>                   │
    ├──────────────────────────────────────────────►│
    │                                               │
    │                        ┌──────────────────────┤
    │                        │ 1. Verify JWT        │
    │                        │    (Get user_id)     │
    │                        └──────────────────────┤
    │                                               │
    │                                               ▼
    │                                  ┌─────────────────────┐
    │                                  │PostgreSQL           │
    │                        ┌─────────┤ Query finance       │
    │                        │         │ WHERE user_id=?     │
    │                        │         └─────────────────────┘
    │                        │         ┌─────────────────────┐
    │                        │         │ COUNT todos         │
    │                        │         │ WHERE user_id=?     │
    │                        │         └─────────────────────┘
    │                        │         ┌─────────────────────┐
    │                        │         │ COUNT projects      │
    │                        │         │ WHERE user_id=?     │
    │                        │         └─────────────────────┘
    │                        │         ┌─────────────────────┐
    │                        │         │ COUNT roadmaps      │
    │                        │         │ WHERE status=1      │
    │                        │         └─────────────────────┘
    │                        │         ┌─────────────────────┐
    │                        │         │ SUM savings.amount  │
    │                        │         │ WHERE user_id=?     │
    │                        │         └─────────────────────┘
    │                        │         ┌─────────────────────┐
    │                        │         │ SUM loans.total_amt │
    │                        │         │ WHERE user_id=?     │
    │                        │         └─────────────────────┘
    │                        │         ┌─────────────────────┐
    │                        │         │ SUM transactions    │
    │                        │         │ (Income & Expense)  │
    │                        │         └─────────────────────┘
    │                        │                     │
    │                        │ 2. Aggregate Results│
    │                        │ 3. Calculate Net    │
    │                        │    Worth            │
    │◄───────────────────────┴─────────────────────┤
    │ 200 OK                                        │
    │ {balance, debt, income, expense,              │
    │  todos, projects, roadmaps, net_worth}        │
    │                                               │
```

### 5.4 Data Transformation

**Request/Response Transformation:**

```
Client Request (JSON)
    │
    ▼
┌─────────────────────────┐
│  API Gateway / Router   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Controller             │
│  - Bind JSON to Struct  │ ◄─ c.ShouldBindJSON(&req)
│  - Validate Fields      │ ◄─ Gin validation tags
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Business Logic         │
│  - Transform Data       │
│  - Apply Business Rules │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  GORM Model             │
│  - Map to DB Schema     │ ◄─ Struct tags (gorm:"column:...")
│  - Execute Query        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Database               │
│  - SQL Execution        │
│  - Return Rows          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  GORM Model (Result)    │
│  - Scan Rows to Struct  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Controller             │
│  - Format Response      │ ◄─ helper.Response()
│  - Add Status, Message  │
└────────────┬────────────┘
             │
             ▼
Client Response (JSON)
```

**Example Transformation:**

```go
// Request DTO (Data Transfer Object)
type CreateTaskRequest struct {
    Title       string    `json:"title" binding:"required"`
    Description string    `json:"description"`
    Priority    uint      `json:"priority" binding:"gte=1,lte=5"`
}

// Database Model
type Todo struct {
    ID          uint      `gorm:"primaryKey;autoIncrement"`
    Task        string    `gorm:"column:task;size:255"`
    Description string    `gorm:"size:1000"`
    Priority    uint      `gorm:"default:5;check:priority >= 1 AND priority <= 5"`
    UserID      uint      `gorm:"not null"`
    CreatedAt   time.Time
}

// Response DTO
type TaskResponse struct {
    TaskID      uint      `json:"task_id"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    Priority    uint      `json:"priority"`
    CreatedAt   time.Time `json:"created_at"`
}

// Transformation Flow:
// CreateTaskRequest → Todo (DB Insert) → TaskResponse → JSON
```

---

## 6. Integration Architecture

### 6.1 External Service Integrations

```
┌─────────────────────────────────────────────────────────────┐
│                    Fintrax Backend                          │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ HTTPS/SMTP
                ▼
┌─────────────────────────────────────────────────────────────┐
│                  SendGrid Email Service                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  API: v3/mail/send                                    │  │
│  │  Auth: Bearer <API_KEY>                               │  │
│  │  Purpose: OTP delivery, notifications                 │  │
│  │  SLA: 99%+ deliverability, <60s delivery             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

Future Integrations:
┌─────────────────────────────────────────────────────────────┐
│                  Cloud Storage (AWS S3)                     │
│  Purpose: File uploads (receipts, attachments)              │
│  Protocol: HTTPS (AWS SDK)                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Calendar APIs (Google, Outlook)              │
│  Purpose: Task synchronization                              │
│  Protocol: OAuth 2.0 + REST                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Banking APIs (Plaid)                       │
│  Purpose: Transaction import (Phase 3)                      │
│  Protocol: HTTPS REST API                                   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Email Integration Details

**SendGrid Integration Architecture:**

```go
// Email Helper (mailHelper.go)
package helper

import (
    "github.com/sendgrid/sendgrid-go"
    "github.com/sendgrid/sendgrid-go/helpers/mail"
)

func SendEmail(to, subject, body string) error {
    from := mail.NewEmail("Fintrax", "noreply@fintrax.com")
    toEmail := mail.NewEmail("User", to)
    message := mail.NewSingleEmail(from, subject, toEmail, body, body)

    client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
    response, err := client.Send(message)

    if err != nil {
        log.Printf("Email send failed: %v", err)
        return err
    }

    if response.StatusCode >= 400 {
        return fmt.Errorf("SendGrid error: %d", response.StatusCode)
    }

    return nil
}
```

**Email Flow:**

```
User Action (Register/Reset Password)
    │
    ▼
Controller generates OTP
    │
    ▼
Call helper.SendEmail(userEmail, subject, body)
    │
    ▼
SendGrid API Request
    │
    ├─ Success (202 Accepted)
    │  └─ Email queued for delivery
    │     └─ User receives email (<60s)
    │
    └─ Failure (4xx/5xx)
       └─ Log error
       └─ Rollback user creation
       └─ Return error to client
```

### 6.3 API Integration Patterns

**Retry Logic for Transient Failures:**

```go
func SendEmailWithRetry(to, subject, body string) error {
    maxRetries := 3
    backoff := time.Second

    for i := 0; i < maxRetries; i++ {
        err := SendEmail(to, subject, body)
        if err == nil {
            return nil
        }

        // Retry on transient errors
        if isTransientError(err) {
            time.Sleep(backoff)
            backoff *= 2 // Exponential backoff
            continue
        }

        // Don't retry on permanent errors
        return err
    }

    return fmt.Errorf("failed after %d retries", maxRetries)
}

func isTransientError(err error) bool {
    // Network errors, 5xx server errors
    return strings.Contains(err.Error(), "timeout") ||
           strings.Contains(err.Error(), "500") ||
           strings.Contains(err.Error(), "503")
}
```

---

## 7. Security Architecture

### 7.1 Authentication Flow

**JWT-Based Authentication:**

```
┌──────────┐                                    ┌─────────────┐
│  Client  │                                    │   Backend   │
└────┬─────┘                                    └──────┬──────┘
     │                                                 │
     │ 1. POST /api/user/login                        │
     │    {email, password}                            │
     ├────────────────────────────────────────────────►│
     │                                                 │
     │                                  ┌──────────────┤
     │                                  │ 2. Query User│
     │                                  │    by Email  │
     │                                  └──────────────┤
     │                                  ┌──────────────┤
     │                                  │ 3. Verify    │
     │                                  │    Password  │
     │                                  │    (bcrypt)  │
     │                                  └──────────────┤
     │                                  ┌──────────────┤
     │                                  │ 4. Generate  │
     │                                  │    JWT Token │
     │                                  │    (HS256)   │
     │                                  └──────────────┤
     │◄────────────────────────────────────────────────┤
     │ {token, user_id, email, username}               │
     │                                                 │
     │ 5. Store Token in localStorage                  │
     │                                                 │
     │ 6. Subsequent Requests                          │
     │    Authorization: Bearer <TOKEN>                │
     ├────────────────────────────────────────────────►│
     │                                                 │
     │                                  ┌──────────────┤
     │                                  │ 7. Extract   │
     │                                  │    Token from│
     │                                  │    Header    │
     │                                  └──────────────┤
     │                                  ┌──────────────┤
     │                                  │ 8. Verify    │
     │                                  │    JWT       │
     │                                  │    Signature │
     │                                  └──────────────┤
     │                                  ┌──────────────┤
     │                                  │ 9. Extract   │
     │                                  │    user_id   │
     │                                  │    from Token│
     │                                  └──────────────┤
     │                                  ┌──────────────┤
     │                                  │ 10. Process  │
     │                                  │     Request  │
     │                                  └──────────────┤
     │◄────────────────────────────────────────────────┤
     │ {status, message, data}                         │
     │                                                 │
```

**JWT Token Structure:**

```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "user_id": 42,
  "iat": 1699876543,  // Issued at (Unix timestamp)
  "exp": 1699962943   // Expiration (24 hours later)
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
```

### 7.2 Authorization Middleware

**Authorization Flow:**

```go
// middleware/authorization.go
func Authorization() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Extract Authorization header
        authHeader := c.GetHeader("Authorization")

        // 2. Check Bearer prefix
        if !strings.HasPrefix(authHeader, "Bearer ") {
            helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
            c.Abort()
            return
        }

        // 3. Extract token
        token := strings.TrimSpace(authHeader[7:])

        // 4. Verify token and extract user_id
        userID, err := helper.VerifyToken(token)
        if err != nil {
            helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
            c.Abort()
            return
        }

        // 5. Set user_id in context for downstream handlers
        c.Set("user_id", userID)

        // 6. Continue to next handler
        c.Next()
    }
}
```

### 7.3 Rate Limiting Architecture

**Rate Limiter Implementation:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Rate Limiter (In-Memory)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Data Structure: map[IP]*ClientRequests               │  │
│  │                                                       │  │
│  │  ClientRequests {                                     │  │
│  │    count: int                 # Number of requests    │  │
│  │    firstSeen: time.Time       # Window start time     │  │
│  │  }                                                    │  │
│  │                                                       │  │
│  │  Cleanup Goroutine:                                   │  │
│  │  - Runs every 1 minute                                │  │
│  │  - Removes expired entries (>window duration)         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

Rate Limit Tiers:
┌─────────────────────────────────────────────────────────────┐
│  General API: 100 requests per minute per user              │
│  Auth Endpoints: 5 requests per minute per IP               │
│  OTP Generation: 3 requests per 5 minutes per user          │
└─────────────────────────────────────────────────────────────┘
```

**Rate Limit Decision Flow:**

```
Request from IP
    │
    ▼
Check map[IP]
    │
    ├─ IP Not Found
    │  └─ Create entry {count: 1, firstSeen: now}
    │  └─ Allow request
    │
    └─ IP Exists
       │
       ├─ Time window expired? (now - firstSeen > window)
       │  └─ Reset entry {count: 1, firstSeen: now}
       │  └─ Allow request
       │
       └─ Within time window
          │
          ├─ count >= limit?
          │  └─ Reject with 429 Too Many Requests
          │
          └─ count < limit
             └─ Increment count
             └─ Allow request
```

### 7.4 Data Security

**Encryption at Rest and in Transit:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Data in Transit (TLS)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Client ◄─── HTTPS (TLS 1.2+) ───► Backend           │  │
│  │  - Certificate: Let's Encrypt / Cloud Provider       │  │
│  │  - Cipher Suites: Strong encryption only             │  │
│  │  - HSTS: Enforce HTTPS                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Data at Rest (Database)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Encryption:                               │  │
│  │  - Managed Database: Encryption enabled by provider  │  │
│  │  - Self-Hosted: pgcrypto extension (future)          │  │
│  │                                                       │  │
│  │  Application-Level Encryption:                        │  │
│  │  - Passwords: bcrypt hashing (cost 10)               │  │
│  │  - Sensitive Fields: Cleared after use (OTP)         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Password Security:**

```
Plain Password (user input)
    │
    ▼
bcrypt.GenerateFromPassword(password, cost=10)
    │
    ├─ Generate random salt (16 bytes)
    ├─ Hash password with salt (2^10 iterations)
    └─ Return hashed password (60 characters)
    │
    ▼
Store in Database (users.password column)

Login Verification:
    │
    ▼
bcrypt.CompareHashAndPassword(hashedPassword, inputPassword)
    │
    ├─ Extract salt from hashed password
    ├─ Hash input password with same salt
    └─ Compare hashes (constant-time comparison)
    │
    ▼
Return true/false
```

---

## 8. Deployment Architecture

### 8.1 Production Deployment Topology

**Recommended Cloud Architecture (AWS Example):**

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                               │
│                    fintrax.com                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              CloudFront (CDN) / CloudFlare                      │
│              - Static asset caching                             │
│              - DDoS protection                                  │
│              - SSL/TLS termination                              │
└─────────────┬──────────────────────┬────────────────────────────┘
              │                      │
              │ Static Assets        │ API Requests
              ▼                      ▼
┌──────────────────────┐  ┌──────────────────────────────────────┐
│   Vercel (Frontend)  │  │   Application Load Balancer (ALB)   │
│   - Next.js SSR/SSG  │  │   - Health checks                    │
│   - Edge functions   │  │   - SSL termination                  │
│   - Auto-scaling     │  │   - Route to backend instances       │
└──────────────────────┘  └────────────┬─────────────────────────┘
                                       │
                                       ▼
                          ┌────────────────────────────────────────┐
                          │    Auto Scaling Group                  │
                          │  ┌──────────────┬──────────────────┐   │
                          │  │  EC2 Instance│  EC2 Instance    │   │
                          │  │  (Backend 1) │  (Backend 2)     │   │
                          │  │  Go + Gin    │  Go + Gin        │   │
                          │  └──────────────┴──────────────────┘   │
                          │  Min: 1, Max: 10, Desired: 2           │
                          └────────────┬───────────────────────────┘
                                       │
                                       │ SQL Queries
                                       ▼
                          ┌────────────────────────────────────────┐
                          │   RDS PostgreSQL (Multi-AZ)            │
                          │   ┌──────────────┬──────────────────┐  │
                          │   │  Primary DB  │  Standby Replica │  │
                          │   │  (Read/Write)│  (Failover)      │  │
                          │   └──────────────┴──────────────────┘  │
                          │   - Automated backups (30 days)        │
                          │   - Point-in-time recovery             │
                          │   - Encryption at rest                 │
                          └────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  SendGrid    │  │  CloudWatch  │  │  S3 (Future) │          │
│  │  (Email)     │  │  (Monitoring)│  │  (Storage)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Alternative Deployment: Railway/Render (Simpler PaaS)

**Simplified PaaS Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Internet / DNS                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────┴──────────┐
                │                      │
                ▼                      ▼
┌──────────────────────┐  ┌──────────────────────────────────────┐
│   Vercel             │  │   Railway / Render                   │
│   (Frontend)         │  │   ┌────────────────────────────────┐ │
│   - Auto SSL         │  │   │  Backend Service (Go)          │ │
│   - Global CDN       │  │   │  - Auto SSL                    │ │
│   - Auto scaling     │  │   │  - Auto deploy (Git push)      │ │
└──────────────────────┘  │   │  - Health checks               │ │
                          │   │  - Environment variables       │ │
                          │   └────────────┬───────────────────┘ │
                          │                │                     │
                          │                ▼                     │
                          │   ┌────────────────────────────────┐ │
                          │   │  PostgreSQL Database           │ │
                          │   │  - Managed service             │ │
                          │   │  - Automated backups           │ │
                          │   │  - Connection pooling          │ │
                          │   └────────────────────────────────┘ │
                          └──────────────────────────────────────┘
```

**Advantages of PaaS:**
- Faster setup (no infrastructure management)
- Lower operational costs
- Automatic SSL certificates
- Built-in CI/CD (Git push to deploy)
- Managed databases with backups

**Disadvantages:**
- Less control over infrastructure
- Potentially higher costs at scale
- Vendor lock-in

### 8.3 Deployment Process

**CI/CD Pipeline (GitHub Actions Example):**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Backend Tests
        run: |
          cd backend
          go test ./...
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm install
          npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

**Deployment Steps:**

```
Developer pushes to main branch
    │
    ▼
GitHub Actions triggered
    │
    ├─ Run tests (backend + frontend)
    │  │
    │  ├─ Tests pass? ────► Continue
    │  └─ Tests fail? ────► Stop, notify developer
    │
    ├─ Build backend (Go binary)
    ├─ Build frontend (Next.js production build)
    │
    ├─ Deploy backend to Railway/Render
    │  └─ Run database migrations
    │
    └─ Deploy frontend to Vercel
       └─ Invalidate CDN cache

Production is live with new changes
```

### 8.4 Environment Management

**Environment Variables:**

```bash
# Backend (.env)
DB_HOST=production-db.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=fintrax_user
DB_PASSWORD=<STRONG_PASSWORD>
DB_NAME=fintrax_prod
JWT_SECRET=<256-BIT-RANDOM-SECRET>
GIN_MODE=release
SENDGRID_API_KEY=<SENDGRID_KEY>

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.fintrax.com/api
```

**Environment-Specific Configurations:**

| Environment | Database | Backend URL | Frontend URL | GIN_MODE |
|-------------|----------|-------------|--------------|----------|
| **Development** | localhost:5432 | localhost:80 | localhost:3000 | debug |
| **Staging** | staging-db.cloud | staging-api.fintrax.com | staging.fintrax.com | release |
| **Production** | prod-db.cloud | api.fintrax.com | fintrax.com | release |

---

## 9. Performance Architecture

### 9.1 Database Performance Optimization

**Indexing Strategy:**

```sql
-- User lookups (login, authentication)
CREATE INDEX idx_users_email ON users(email);

-- Task queries (most frequent)
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_roadmap_id ON todos(roadmap_id);
CREATE INDEX idx_todos_parent_id ON todos(parent_id);
CREATE INDEX idx_todos_project_id ON todos(project_id);

-- Transaction queries (date-based filtering common)
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);

-- Finance lookups
CREATE INDEX idx_finance_user_id ON finance(user_id);

-- Project queries
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Composite index for common query pattern
CREATE INDEX idx_todos_user_status ON todos(user_id, status);
```

**Query Optimization Techniques:**

1. **Use EXPLAIN ANALYZE:**
```sql
EXPLAIN ANALYZE
SELECT * FROM todos
WHERE user_id = 42 AND status != 5
ORDER BY created_at DESC
LIMIT 50;
```

2. **Avoid N+1 Queries:**
```go
// Bad: N+1 Query Problem
todos := []models.Todo{}
db.Find(&todos)
for _, todo := range todos {
    db.Model(&todo).Association("Resources").Find(&todo.Resources)
}

// Good: Eager Loading
todos := []models.Todo{}
db.Preload("Resources").Find(&todos)
```

3. **Use Pagination:**
```go
// Limit results to avoid loading thousands of records
db.Where("user_id = ?", userID).
   Limit(50).
   Offset(page * 50).
   Find(&todos)
```

### 9.2 Frontend Performance Optimization

**Code Splitting Strategy:**

```typescript
// Lazy load heavy components
const Kanban = dynamic(() => import('@/components/Task/Kanban'), {
  loading: () => <Skeleton />,
  ssr: false // Disable SSR for client-only components
});

const FinancialCharts = dynamic(() => import('@/components/Finance/Charts'), {
  loading: () => <LoadingSpinner />,
});
```

**Bundle Size Optimization:**

```
Initial Bundle:
├─ app/layout.js           50 KB
├─ app/page.js             20 KB
├─ chunks/framework.js    120 KB (React, Next.js)
├─ chunks/main.js          80 KB (App code)
└─ Total Initial:         ~270 KB (gzipped: ~90 KB)

Lazy Loaded Bundles:
├─ dashboard.js            30 KB
├─ kanban.js               25 KB
├─ charts.js               40 KB (Chart.js library)
└─ Total Lazy:            ~95 KB (loaded on demand)
```

**Caching Strategy:**

```typescript
// API Response Caching (SWR pattern)
import useSWR from 'swr';

const { data, error } = useSWR('/api/todo', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minute
});

// Static Asset Caching (Next.js Config)
// next.config.ts
export default {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  compress: true, // Gzip compression
};
```

### 9.3 Backend Performance Optimization

**Connection Pooling:**

```go
// Database connection pool (GORM default)
sqlDB, _ := db.DB()
sqlDB.SetMaxIdleConns(10)
sqlDB.SetMaxOpenConns(100)
sqlDB.SetConnMaxLifetime(time.Hour)
```

**Goroutine Concurrency:**

```go
// Concurrent dashboard queries
func GetDashboard(c *gin.Context) {
    userID := c.Get("user_id").(int)

    var finance models.Finance
    var totalTodos, totalProjects int64
    var wg sync.WaitGroup

    // Run queries concurrently
    wg.Add(3)

    go func() {
        defer wg.Done()
        db.Where("user_id = ?", userID).First(&finance)
    }()

    go func() {
        defer wg.Done()
        db.Model(&models.Todo{}).Where("user_id = ?", userID).Count(&totalTodos)
    }()

    go func() {
        defer wg.Done()
        db.Model(&models.Project{}).Where("user_id = ?", userID).Count(&totalProjects)
    }()

    wg.Wait()

    // Return aggregated results
}
```

### 9.4 Performance Monitoring

**Key Performance Indicators (KPIs):**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **API Response Time (p95)** | < 500ms | Prometheus + Grafana |
| **API Response Time (p99)** | < 1000ms | Application logging |
| **Page Load Time (FCP)** | < 1.5s | Lighthouse, Web Vitals |
| **Page Load Time (LCP)** | < 2.5s | Real User Monitoring (RUM) |
| **Database Query Time** | < 100ms | PostgreSQL slow query log |
| **Error Rate** | < 0.1% | Sentry error tracking |
| **Uptime** | > 99.5% | UptimeRobot, Pingdom |

**Monitoring Stack (Future):**

```
Application Metrics
    │
    ▼
┌─────────────────────────┐
│  Prometheus             │ ◄─ Metrics scraping
│  - API response times   │
│  - Error rates          │
│  - Request counts       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Grafana                │ ◄─ Visualization
│  - Dashboards           │
│  - Alerts               │
└─────────────────────────┘

Error Tracking
    │
    ▼
┌─────────────────────────┐
│  Sentry                 │ ◄─ Error reporting
│  - Stack traces         │
│  - User context         │
└─────────────────────────┘

Logs
    │
    ▼
┌─────────────────────────┐
│  CloudWatch / ELK       │ ◄─ Log aggregation
│  - Application logs     │
│  - Access logs          │
└─────────────────────────┘
```

---

## 10. Scalability and High Availability

### 10.1 Horizontal Scaling Strategy

**Stateless Backend Design:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                            │
│                    (Round Robin)                            │
└──────────┬──────────────┬──────────────┬───────────────────┘
           │              │              │
           ▼              ▼              ▼
     ┌─────────┐    ┌─────────┐    ┌─────────┐
     │Backend 1│    │Backend 2│    │Backend 3│
     │(Go+Gin) │    │(Go+Gin) │    │(Go+Gin) │
     └────┬────┘    └────┬────┘    └────┬────┘
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  Database   │
                  │ (PostgreSQL)│
                  └─────────────┘
```

**Why Stateless Works:**
- No server-side sessions (JWT tokens in client)
- Each request can go to any backend instance
- Easy to add/remove instances based on load
- No session synchronization needed

### 10.2 Database Scaling

**Vertical Scaling (Phase 1):**
- Increase PostgreSQL instance size (CPU, RAM)
- Add more storage (SSD)
- Optimize queries and indexes

**Horizontal Scaling (Phase 2):**

```
┌──────────────────────────────────────────────────────────┐
│                  Application Tier                        │
│            (Multiple Backend Instances)                  │
└───────┬────────────────────────────┬─────────────────────┘
        │                            │
        │ Writes                     │ Reads
        ▼                            ▼
┌────────────────┐          ┌────────────────────┐
│  Primary DB    │          │  Read Replica 1    │
│  (Read/Write)  │──Repl───►│  (Read Only)       │
└────────────────┘          └────────────────────┘
                            ┌────────────────────┐
                            │  Read Replica 2    │
                    ────────►│  (Read Only)       │
                            └────────────────────┘
```

**Read/Write Splitting:**
```go
// Write to primary
db.Create(&todo)

// Read from replica (future implementation)
readDB := getReadReplica()
readDB.Where("user_id = ?", userID).Find(&todos)
```

### 10.3 Caching Strategy (Future)

**Redis Cache Layer:**

```
┌──────────────────────────────────────────────────────────┐
│                  Application Tier                        │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   Redis Cache    │ ◄─ Hot data (sessions, counters)
              │   TTL: 5-60 min  │
              └────────┬─────────┘
                       │ Cache miss
                       ▼
              ┌──────────────────┐
              │   PostgreSQL     │ ◄─ Persistent storage
              │   (Source of     │
              │    Truth)        │
              └──────────────────┘
```

**Caching Candidates:**
- User profile data (after login)
- Dashboard aggregations (refresh every 5 minutes)
- Project task counts (invalidate on task create/delete)
- Frequently accessed task lists

### 10.4 High Availability Architecture

**Multi-AZ Deployment (Production):**

```
┌─────────────────────────────────────────────────────────────┐
│                      Availability Zone 1                    │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │  Backend       │  │  Primary DB    │                     │
│  │  Instance 1    │  │  (Active)      │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Availability Zone 2                    │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │  Backend       │  │  Standby DB    │                     │
│  │  Instance 2    │  │  (Failover)    │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

**Failover Scenarios:**

| Failure | Impact | Recovery |
|---------|--------|----------|
| **Single Backend Instance Failure** | No impact (load balancer routes to healthy instances) | Auto-healing (restart instance) |
| **Primary DB Failure** | Brief downtime (30-120s) | Automatic failover to standby replica |
| **Entire AZ Failure** | Degraded performance | Traffic routed to other AZ |
| **Database Corruption** | Data loss risk | Restore from latest backup (RPO: 24h) |

**Backup Strategy:**

```
Daily Automated Backups
    │
    ├─ Full Database Snapshot (1 AM UTC)
    │  └─ Retention: 30 days
    │
    ├─ Transaction Log Backup (Continuous)
    │  └─ Enables point-in-time recovery
    │
    └─ Backup Testing (Weekly)
       └─ Restore to staging environment
```

### 10.5 Disaster Recovery Plan

**Recovery Time Objective (RTO):** 4 hours
**Recovery Point Objective (RPO):** 24 hours

**DR Procedure:**

```
Disaster Detected
    │
    ▼
1. Assess Impact
    │
    ├─ Application Down?
    │  └─ Restart services, check logs
    │
    ├─ Database Corrupted?
    │  └─ Restore from latest backup
    │
    └─ Data Center Failure?
       └─ Failover to secondary region (future)

2. Restore Service
    │
    ├─ Spin up new infrastructure (Terraform/CloudFormation)
    ├─ Restore database from backup
    ├─ Run database migrations (if needed)
    ├─ Deploy latest application version
    └─ Update DNS to point to new infrastructure

3. Verify Functionality
    │
    ├─ Run smoke tests (login, create task, record transaction)
    ├─ Check data integrity
    └─ Monitor error rates

4. Communicate
    │
    ├─ Notify users via status page
    └─ Post-mortem document
```

---

## Appendix A: Technology Comparison

### A.1 Backend Framework Comparison

| Framework | Language | Performance | Scalability | Ecosystem | Learning Curve |
|-----------|----------|-------------|-------------|-----------|----------------|
| **Gin (Go)** | Go | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Express (Node.js) | JavaScript | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| FastAPI (Python) | Python | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Spring Boot (Java) | Java | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

**Selection: Gin (Go)** for performance, concurrency, and compiled binaries.

### A.2 Database Comparison

| Database | Type | ACID | JSON Support | Scalability | Cost |
|----------|------|------|--------------|-------------|------|
| **PostgreSQL** | SQL | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐ | Free (OSS) |
| MySQL | SQL | ✅ Yes | ⚠️ Limited | ⭐⭐⭐⭐ | Free (OSS) |
| MongoDB | NoSQL | ⚠️ Limited | ✅ Native | ⭐⭐⭐⭐⭐ | Free (OSS) |
| DynamoDB | NoSQL | ⚠️ Limited | ✅ Native | ⭐⭐⭐⭐⭐ | Pay-per-use |

**Selection: PostgreSQL** for ACID compliance, relational data, and cost.

---

## Appendix B: Deployment Checklist

**Pre-Launch Checklist:**

- [ ] Backend
  - [ ] All tests passing (unit, integration)
  - [ ] Environment variables configured
  - [ ] Database migrations applied
  - [ ] HTTPS enabled
  - [ ] Rate limiting configured
  - [ ] Error logging enabled
  - [ ] Health check endpoint working

- [ ] Frontend
  - [ ] Production build successful
  - [ ] Environment variables configured
  - [ ] API base URL points to production
  - [ ] SSL certificate valid
  - [ ] Lighthouse score > 90

- [ ] Database
  - [ ] Backups enabled (automated daily)
  - [ ] Connection pooling configured
  - [ ] Indexes created on all tables
  - [ ] Replica lag monitored (if applicable)

- [ ] Security
  - [ ] JWT secret is strong (256-bit)
  - [ ] All passwords bcrypt hashed
  - [ ] CORS configured for frontend domain only
  - [ ] Security headers enabled (CSP, HSTS)
  - [ ] Rate limiting tested

- [ ] Monitoring
  - [ ] Uptime monitoring configured
  - [ ] Error tracking (Sentry) enabled
  - [ ] Log aggregation working
  - [ ] Alerts configured for critical errors

---

**End of High-Level Design Document**

**Next Steps:**
1. Review and approve HLD
2. Create Low-Level Design (LLD) document
3. Create API Contract specifications
4. Create Database Design document
5. Begin implementation based on approved design

**Document Owner:** Solution Architect
**Review Date:** December 13, 2025
