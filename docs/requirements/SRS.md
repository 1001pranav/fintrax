# Software Requirements Specification (SRS)
## Fintrax - Integrated Productivity and Finance Management Platform

**Document Version:** 1.0
**Date:** November 13, 2025
**Status:** Approved
**Classification:** Functional & Non-Functional Requirements

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-11-01 | Product Team | Initial draft |
| 0.5 | 2025-11-07 | Engineering Team | Technical review |
| 1.0 | 2025-11-13 | Product Manager | Final approval
---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [System Features](#6-system-features)
7. [Data Requirements](#7-data-requirements)
8. [Appendices](#8-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of all functional and non-functional requirements for the Fintrax application. It is intended for:

- **Development Team:** To understand what needs to be built
- **QA Team:** To create test plans and validate implementation
- **Product Management:** To track requirements and ensure completeness
- **Stakeholders:** To review and approve the scope

### 1.2 Scope

**Product Name:** Fintrax
**Product Type:** Web-based SaaS Application
**Product Vision:** A unified platform integrating personal productivity management with comprehensive financial tracking

**In Scope:**
- User authentication and authorization
- Task and project management with hierarchical organization
- Learning roadmap creation and progress tracking
- Financial transaction recording and categorization
- Savings and loan management with calculations
- Unified dashboard with analytics
- Resource and note management
- Mobile-responsive web interface

**Out of Scope (Future Releases):**
- Native mobile applications (iOS/Android)
- Real-time collaboration features
- Bank account integration and automatic transaction import
- Multi-language support
- Offline mode
- Third-party calendar synchronization
- Advanced tax preparation features

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete operations |
| **EMI** | Equated Monthly Installment (loan payment) |
| **GORM** | Go Object-Relational Mapping library |
| **JWT** | JSON Web Token for authentication |
| **MVP** | Minimum Viable Product |
| **OTP** | One-Time Password for verification |
| **SRS** | Software Requirements Specification |
| **User** | Authenticated individual using the system |
| **Task** | An action item with title, description, and metadata |
| **Project** | A collection of related tasks |
| **Roadmap** | A structured learning path with associated tasks |
| **Transaction** | A financial record (income, expense, saving, debt, investment) |

### 1.4 References

- **Software Requirements Document (SRD):** [SRD.md](./SRD.md)
- **Requirement Gathering Document:** [Requirement_Gathering.md](./Requirement_Gathering.md)
- **Requirement Analysis Document:** [Requirement_Analysis.md](./Requirement_Analysis.md)
- **Product Status Report:** [../Product_Status_Report.md](../Product_Status_Report.md)
- **IEEE Std 830-1998:** IEEE Recommended Practice for Software Requirements Specifications

### 1.5 Overview

This SRS document is organized into the following sections:

- **Section 2:** Overall product description, user characteristics, constraints
- **Section 3:** Detailed functional requirements organized by feature
- **Section 4:** Non-functional requirements (performance, security, usability)
- **Section 5:** External interface requirements (UI, API, database)
- **Section 6:** Detailed system features with use cases
- **Section 7:** Data requirements and database specifications
- **Section 8:** Appendices with supporting information

---

## 2. Overall Description

### 2.1 Product Perspective

Fintrax is a new, self-contained web application that replaces the need for separate productivity and finance management tools. It is:

- **Web-based:** Accessible via modern web browsers (Chrome, Firefox, Safari, Edge)
- **Cloud-hosted:** Backend deployed on cloud infrastructure (AWS/GCP/Railway)
- **RESTful Architecture:** Client-server model with JSON API
- **Database-backed:** PostgreSQL for persistent data storage

**System Context:**

```
┌─────────────────────────────────────────────────────────┐
│                    External Systems                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Email Server │  │   Browser    │  │  Database    │  │
│  │ (SendGrid)   │  │  (Client)    │  │ (PostgreSQL) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          │ SMTP             │ HTTPS            │ SQL
          ▼                  ▼                  ▼
    ┌─────────────────────────────────────────────────┐
    │              Fintrax Application                │
    │  ┌───────────────┐    ┌──────────────────┐     │
    │  │   Frontend    │◄──►│     Backend      │     │
    │  │  (Next.js)    │    │   (Go + Gin)     │     │
    │  └───────────────┘    └──────────────────┘     │
    └─────────────────────────────────────────────────┘
```

### 2.2 Product Functions

**Primary Functions:**

1. **User Account Management**
   - User registration with email verification
   - Secure login with JWT authentication
   - Password reset via OTP
   - Profile management

2. **Task Management**
   - Create, edit, delete tasks
   - Organize tasks hierarchically (parent-child relationships)
   - Set task priorities, deadlines, and status
   - Attach resources (links, notes, files) to tasks

3. **Project Management**
   - Group tasks into projects
   - Visualize project progress (Kanban board, calendar view)
   - Customize project appearance (colors, icons)
   - Track project statistics

4. **Learning Roadmap Management**
   - Create learning paths with timelines
   - Associate tasks with roadmaps
   - Track progress automatically based on task completion
   - Visualize roadmap timeline

5. **Financial Management**
   - Record financial transactions (income, expenses, savings, debt, investments)
   - Track savings instruments (FD, SIP, PPF, NPS, mutual funds, gold)
   - Manage loans with EMI calculations
   - Calculate and display current balance

6. **Dashboard and Analytics**
   - Unified dashboard showing productivity and financial metrics
   - Visual charts (income vs. expense, category breakdown)
   - Recent activity feed
   - Quick action shortcuts

7. **Search and Organization**
   - Search across tasks, projects, transactions
   - Filter by status, priority, date range, category
   - Tag system for categorization
   - Notes for additional context

### 2.3 User Classes and Characteristics

#### Primary User Classes

**1. Young Professionals (25-35 years)**
- **Technical Expertise:** High
- **Domain Knowledge:** Moderate productivity/finance knowledge
- **Usage Frequency:** Daily (task management), Weekly (finance review)
- **Primary Goals:** Career advancement, financial independence, learning new skills
- **Key Features Used:** Tasks, projects, roadmaps, transaction tracking, savings

**2. Students (18-25 years)**
- **Technical Expertise:** High
- **Domain Knowledge:** Limited finance knowledge, good with productivity tools
- **Usage Frequency:** Daily (tasks, roadmaps), Monthly (finance tracking)
- **Primary Goals:** Academic success, manage limited budget, track student loans
- **Key Features Used:** Tasks, roadmaps, basic transaction tracking, loan management

**3. Freelancers/Gig Workers (25-45 years)**
- **Technical Expertise:** Medium to High
- **Domain Knowledge:** Strong understanding of project-based work, irregular income
- **Usage Frequency:** Daily (project tracking), Weekly (income/expense)
- **Primary Goals:** Manage multiple client projects, stabilize income, tax planning
- **Key Features Used:** Projects, tasks, transactions (categorized by client), savings

**4. Entrepreneurs/Small Business Owners (30-50 years)**
- **Technical Expertise:** Medium
- **Domain Knowledge:** Strong business acumen, cash flow awareness
- **Usage Frequency:** Daily (business tasks), Weekly (financial review)
- **Primary Goals:** Business growth, runway tracking, milestone achievement
- **Key Features Used:** Projects, roadmaps, comprehensive financial tracking, loans

#### Secondary User Classes

**5. Families Managing Shared Finances (Future)**
- Shared budgets and task assignments
- Multi-user collaboration (Phase 2+)

### 2.4 Operating Environment

**Client-Side Requirements:**
- **Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Screen Resolutions:**
  - Mobile: 320px - 767px (portrait and landscape)
  - Tablet: 768px - 1023px
  - Desktop: 1024px and above
- **Internet Connection:** Broadband (minimum 1 Mbps for optimal experience)
- **JavaScript:** Enabled (required for application functionality)

**Server-Side Environment:**
- **Operating System:** Linux (Ubuntu 20.04+ or equivalent)
- **Runtime:** Go 1.23+ for backend, Node.js 18+ for Next.js SSR
- **Database:** PostgreSQL 14+
- **Web Server:** Gin HTTP server (Go)
- **Hosting:** Cloud platform (AWS, GCP, Railway, Vercel)

**Network Requirements:**
- **Protocol:** HTTPS (TLS 1.2+)
- **API Format:** RESTful JSON
- **Email Delivery:** SMTP access to email service provider (SendGrid)

### 2.5 Design and Implementation Constraints

**Technical Constraints:**

1. **Technology Stack Mandate:**
   - Backend must use Go with Gin framework (existing codebase)
   - Frontend must use Next.js 15 with React 19 (existing codebase)
   - Database must be PostgreSQL (ACID compliance required)

2. **Security Requirements:**
   - All passwords must be hashed with bcrypt (cost factor ≥ 10)
   - JWT authentication required for protected endpoints
   - HTTPS mandatory for production deployment
   - Rate limiting to prevent abuse (5 login attempts/hour)

3. **Performance Constraints:**
   - API response time < 500ms for 95th percentile requests
   - Dashboard load time < 2 seconds on 3G connection
   - Support up to 10,000 tasks per user without degradation

4. **Data Privacy:**
   - GDPR compliance for EU users
   - User data must not be shared with third parties
   - Users must have ability to export and delete their data

**Business Constraints:**

5. **Budget Limitations:**
   - No budget for paid third-party APIs (bank sync, advanced analytics)
   - Minimize operational costs (favor open-source solutions)

6. **Timeline:**
   - MVP must launch within 8 months (realistic estimate)
   - Beta testing required before public launch

7. **Team Size:**
   - Development team: 2-3 developers
   - Limited QA resources (part-time tester)

**Regulatory Constraints:**

8. **Compliance:**
   - Privacy policy and terms of service required
   - Email opt-out mechanism (CAN-SPAM Act)
   - Data retention policies (7 years for financial records)

### 2.6 Assumptions and Dependencies

**Assumptions:**

1. Users have valid email addresses for registration
2. Users are comfortable with manual transaction entry (vs. bank sync)
3. Users will adopt both productivity and finance features (not just one)
4. PostgreSQL can scale to 100,000+ users with proper optimization
5. Email delivery service maintains 99%+ deliverability
6. Users prefer privacy over convenience (willing to manually enter data)

**Dependencies:**

1. **External Services:**
   - Email delivery service (SendGrid or AWS SES) for OTP and notifications
   - Cloud hosting provider (AWS/GCP/Railway/Vercel) availability
   - HTTPS certificate provider (Let's Encrypt or cloud provider)

2. **Third-Party Libraries:**
   - Gin framework (Go) for HTTP routing
   - GORM for database ORM
   - Next.js for frontend framework
   - React for UI components
   - Zustand for state management

3. **Infrastructure:**
   - PostgreSQL database server
   - Domain name registration
   - SSL/TLS certificate

---

## 3. Functional Requirements

### 3.1 User Management Module

#### FR-UM-001: User Registration

**Priority:** Must Have
**Requirement ID:** FR-UM-001

**Description:** The system shall allow new users to register by providing username, email, and password.

**Inputs:**
- Username (string, 3-50 characters, alphanumeric and underscores)
- Email (string, valid email format, max 255 characters)
- Password (string, minimum 8 characters)

**Processing:**
1. Validate input format and length
2. Check email uniqueness in database
3. Hash password using bcrypt (cost factor 10)
4. Generate 4-digit numeric OTP (1000-9999)
5. Create user record with status "Inactive"
6. Create associated Finance record (balance = 0, total_debt = 0)
7. Generate JWT token
8. Send OTP to user's email via SendGrid

**Outputs:**
- HTTP 201 Created with user details and JWT token
- OTP sent to email (production) or returned in response (development)

**Error Handling:**
- HTTP 409 Conflict if email already exists
- HTTP 400 Bad Request if validation fails
- HTTP 500 Internal Server Error if email sending fails (rollback transaction)

**Business Rules:**
- Email must be unique across all users
- Password must be at least 8 characters
- User status set to "Inactive" until email verification
- Finance record automatically created for new users
- Registration is atomic: user + finance + OTP or full rollback

**Acceptance Criteria:**
- [ ] User can register with valid email and password
- [ ] System rejects duplicate email addresses
- [ ] Password is stored as bcrypt hash, never plaintext
- [ ] OTP is sent to user's email
- [ ] Finance record is created with zero balance
- [ ] JWT token is returned for immediate authentication
- [ ] Transaction rolls back if any step fails

---

#### FR-UM-002: Email Verification

**Priority:** Must Have
**Requirement ID:** FR-UM-002

**Description:** The system shall require users to verify their email address using OTP before activating the account.

**Inputs:**
- Email (string, registered email address)
- OTP (unsigned integer, 4 digits)

**Processing:**
1. Retrieve user record by email
2. Check if OTP exists and is not expired (< 5 minutes old)
3. Compare provided OTP with stored OTP
4. Update user status to "Active" if OTP matches
5. Clear OTP from database (security)

**Outputs:**
- HTTP 200 OK with success message
- User status changed to "Active" in database

**Error Handling:**
- HTTP 404 Not Found if user does not exist
- HTTP 400 Bad Request if OTP is invalid, missing, or expired
- HTTP 400 Bad Request if user already verified

**Business Rules:**
- OTP valid for 5 minutes from generation
- Maximum 3 incorrect OTP attempts (future: account lockout)
- OTP is single-use (cleared after verification)
- User cannot access protected features until verified

**Acceptance Criteria:**
- [ ] User can verify email with correct OTP
- [ ] System rejects expired OTPs (>5 minutes old)
- [ ] System rejects incorrect OTPs
- [ ] User status changes from "Inactive" to "Active" after verification
- [ ] Verified users can access all protected features

---

#### FR-UM-003: User Login

**Priority:** Must Have
**Requirement ID:** FR-UM-003

**Description:** The system shall authenticate users with email and password, returning a JWT token for session management.

**Inputs:**
- Email (string, registered email address)
- Password (string, user's password)

**Processing:**
1. Retrieve user record by email
2. Check user status (must be "Active")
3. Verify password against stored bcrypt hash
4. Generate JWT token with user ID (24-hour expiration)
5. Return token and user details

**Outputs:**
- HTTP 200 OK with JWT token, user_id, email, username
- Token stored in client (localStorage or cookie)

**Error Handling:**
- HTTP 401 Unauthorized if email not found or password incorrect
- HTTP 403 Forbidden if user status is not "Active" (unverified email)
- HTTP 429 Too Many Requests if rate limit exceeded (5 attempts/hour)

**Business Rules:**
- JWT token expires after 24 hours
- Rate limiting: 5 failed login attempts per hour per IP
- User must have "Active" status to log in
- Password verification uses bcrypt comparison (secure)

**Acceptance Criteria:**
- [ ] User can log in with valid email and password
- [ ] System returns JWT token valid for 24 hours
- [ ] System rejects login for unverified accounts
- [ ] System rejects incorrect passwords
- [ ] Rate limiting prevents brute-force attacks
- [ ] JWT token contains user ID for authorization

---

#### FR-UM-004: Password Reset (Forgot Password)

**Priority:** Must Have
**Requirement ID:** FR-UM-004

**Description:** The system shall allow users to reset forgotten passwords using email-based OTP verification.

**Inputs:**
- Email (string, registered email address)

**Processing:**
1. Generate 4-digit OTP
2. Store OTP with timestamp in user record
3. Send OTP to user's email
4. User receives email with OTP
5. User submits email, new password, and OTP
6. System verifies OTP validity (<5 minutes)
7. System hashes new password with bcrypt
8. System updates password in database

**Outputs:**
- HTTP 200 OK with message "OTP sent to your email"
- HTTP 200 OK with message "Password updated successfully" (after reset)

**Error Handling:**
- HTTP 404 Not Found if email not registered
- HTTP 429 Too Many Requests if OTP requested within 1 minute
- HTTP 400 Bad Request if OTP is invalid or expired

**Business Rules:**
- OTP valid for 5 minutes
- Only 1 OTP generation per minute per user
- Previous OTP invalidated when new one is generated
- New password must meet strength requirements (8+ characters)

**Acceptance Criteria:**
- [ ] User can request password reset OTP
- [ ] OTP is sent to registered email
- [ ] User can reset password with valid OTP
- [ ] Old password is replaced with new hashed password
- [ ] Rate limiting prevents OTP spam

---

#### FR-UM-005: Change Password (Authenticated)

**Priority:** Should Have
**Requirement ID:** FR-UM-005

**Description:** The system shall allow authenticated users to change their password by providing old and new passwords.

**Inputs:**
- Old Password (string, current password)
- New Password (string, desired password)
- Email (string, from JWT context)

**Processing:**
1. Retrieve user from JWT token (authenticated)
2. Verify old password matches stored hash
3. Hash new password with bcrypt
4. Update password in database
5. Optionally: invalidate current JWT (force re-login)

**Outputs:**
- HTTP 200 OK with success message

**Error Handling:**
- HTTP 401 Unauthorized if old password is incorrect
- HTTP 400 Bad Request if new password doesn't meet requirements

**Business Rules:**
- User must be authenticated (JWT token required)
- Old password must be verified before changing
- New password must differ from old password
- Password strength requirements apply

**Acceptance Criteria:**
- [ ] Authenticated user can change password
- [ ] System verifies old password before allowing change
- [ ] New password is hashed with bcrypt
- [ ] User can log in with new password after change

---

### 3.2 Task Management Module

#### FR-TM-001: Create Task

**Priority:** Must Have
**Requirement ID:** FR-TM-001

**Description:** The system shall allow authenticated users to create tasks with title, description, priority, dates, and optional parent task.

**Inputs:**
- Title (string, required, 1-255 characters)
- Description (string, optional, max 1000 characters)
- Priority (integer, 1-5, default 5)
- Start Date (timestamp, optional)
- End Date (timestamp, optional)
- Due Days (unsigned integer, default 0)
- Status (integer, 1-6, default 1: Not Started)
- Parent Task ID (unsigned integer, optional, for subtasks)
- Roadmap ID (unsigned integer, optional)
- Is Roadmap (boolean, default false)

**Processing:**
1. Extract user ID from JWT token
2. Validate required fields (title)
3. Create task record in database
4. Associate with user
5. If parent task ID provided, create parent-child relationship
6. Return created task with generated ID

**Outputs:**
- HTTP 201 Created with task object (task_id, title, description, priority, dates, status)

**Error Handling:**
- HTTP 400 Bad Request if title is missing or validation fails
- HTTP 401 Unauthorized if JWT token is invalid
- HTTP 404 Not Found if parent task ID doesn't exist

**Business Rules:**
- Title is required
- Priority range: 1 (highest) to 5 (lowest)
- Status range: 1 (Not Started) to 6 (Completed)
- Subtasks can be nested infinitely (parent-child relationships)
- User can only create tasks for themselves
- Default status is "Not Started" (1)

**Acceptance Criteria:**
- [ ] User can create task with title only (minimal)
- [ ] User can set all optional fields
- [ ] User can create subtask by specifying parent task ID
- [ ] Task is associated with authenticated user
- [ ] Created task has unique ID
- [ ] Parent-child relationship is established for subtasks

---

#### FR-TM-002: View Tasks

**Priority:** Must Have
**Requirement ID:** FR-TM-002

**Description:** The system shall display all tasks belonging to the authenticated user, with optional filtering.

**Inputs:**
- User ID (from JWT token)
- Filters (optional):
  - Status (integer, 1-6)
  - Priority (integer, 1-5)
  - Is Roadmap (boolean)
  - Date Range (start date, end date)

**Processing:**
1. Query database for tasks where user_id = authenticated user
2. Exclude soft-deleted tasks (status != 5)
3. Apply optional filters if provided
4. Return task list sorted by created date (newest first)

**Outputs:**
- HTTP 200 OK with array of task objects
- Empty array if no tasks found

**Error Handling:**
- HTTP 401 Unauthorized if JWT token is invalid

**Business Rules:**
- Users can only view their own tasks
- Deleted tasks (status = 5) are hidden from list
- Tasks are sorted by created date descending
- Filtering is optional (returns all tasks if no filters)

**Acceptance Criteria:**
- [ ] User can view all their tasks
- [ ] Deleted tasks are not displayed
- [ ] User cannot view other users' tasks
- [ ] Filtering by status works correctly
- [ ] Filtering by priority works correctly
- [ ] Empty list returned if no tasks exist

---

#### FR-TM-003: Update Task

**Priority:** Must Have
**Requirement ID:** FR-TM-003

**Description:** The system shall allow users to update any field of their tasks.

**Inputs:**
- Task ID (unsigned integer, in URL path)
- Updated fields (any combination):
  - Title (string)
  - Description (string)
  - Priority (integer, 1-5)
  - Start Date (timestamp)
  - End Date (timestamp)
  - Status (integer, 1-6)
  - Parent ID (unsigned integer, nullable)

**Processing:**
1. Retrieve task by ID
2. Verify task belongs to authenticated user
3. Verify task is not deleted (status != 5)
4. Update only provided fields (partial update)
5. Save updated task to database
6. Return updated task object

**Outputs:**
- HTTP 200 OK with updated task object

**Error Handling:**
- HTTP 404 Not Found if task doesn't exist or is deleted
- HTTP 401 Unauthorized if task doesn't belong to user
- HTTP 400 Bad Request if validation fails

**Business Rules:**
- Only task owner can update the task
- Partial updates allowed (only provided fields updated)
- Cannot update deleted tasks
- Status can be changed to any valid value (1-6)
- Changing parent_id re-organizes task hierarchy

**Acceptance Criteria:**
- [ ] User can update task title
- [ ] User can update task status
- [ ] User can update any combination of fields
- [ ] User cannot update other users' tasks
- [ ] Updated task is returned with changes

---

#### FR-TM-004: Delete Task (Soft Delete)

**Priority:** Must Have
**Requirement ID:** FR-TM-004

**Description:** The system shall soft-delete tasks by setting status to "Deleted" and recording deletion timestamp.

**Inputs:**
- Task ID (unsigned integer, in URL path)

**Processing:**
1. Retrieve task by ID
2. Verify task belongs to authenticated user
3. Verify task is not already deleted
4. Set status = 5 (Deleted)
5. Set deleted_at = current timestamp
6. If task has subtasks, set their parent_id to NULL (orphan them)
7. Save updated task to database

**Outputs:**
- HTTP 200 OK with message "Task deleted successfully"

**Error Handling:**
- HTTP 404 Not Found if task doesn't exist or already deleted
- HTTP 401 Unauthorized if task doesn't belong to user

**Business Rules:**
- Soft delete (data retained for potential recovery)
- Deleted tasks hidden from normal queries
- Subtasks are orphaned (parent_id set to NULL), not deleted
- Cannot delete other users' tasks

**Acceptance Criteria:**
- [ ] User can delete their own tasks
- [ ] Task status changes to "Deleted" (5)
- [ ] Deleted_at timestamp is recorded
- [ ] Subtasks are orphaned, not deleted
- [ ] Deleted tasks do not appear in task list
- [ ] User cannot delete other users' tasks

---

#### FR-TM-005: Hierarchical Task Structure

**Priority:** Must Have
**Requirement ID:** FR-TM-005

**Description:** The system shall support parent-child task relationships with unlimited nesting depth.

**Inputs:**
- Parent Task ID (unsigned integer, when creating subtask)

**Processing:**
1. Task model has self-referencing foreign key (parent_id)
2. Subtasks can be created by setting parent_id
3. Parent task can have multiple subtasks
4. Subtasks can have their own subtasks (recursive)

**Outputs:**
- Task object with parent_id field
- Parent task can query for subtasks via relationship

**Business Rules:**
- Unlimited nesting depth allowed
- Parent task can be null (top-level task)
- Deleting parent task orphans subtasks (sets parent_id to NULL)
- Subtasks belong to the same user as parent task

**Acceptance Criteria:**
- [ ] User can create subtask under parent task
- [ ] Subtasks can have their own subtasks
- [ ] Deleting parent task orphans subtasks
- [ ] Parent-child relationship is queryable

---

### 3.3 Project Management Module

#### FR-PM-001: Create Project

**Priority:** Must Have
**Requirement ID:** FR-PM-001

**Description:** The system shall allow users to create projects to organize tasks.

**Inputs:**
- Name (string, required, 1-255 characters)
- Description (string, optional, max 1000 characters)
- Color (string, hex color code, default "#3B82F6")
- Cover Image (string, URL, optional)
- Status (integer, 1-6, default 1: Not Started)

**Processing:**
1. Validate name is provided
2. Create project record
3. Associate with authenticated user
4. Set task_count = 0 (calculated later)
5. Return created project

**Outputs:**
- HTTP 201 Created with project object (id, name, description, color, created_date)

**Error Handling:**
- HTTP 400 Bad Request if name is missing
- HTTP 401 Unauthorized if not authenticated

**Business Rules:**
- Name is required
- Default color is blue (#3B82F6)
- Task count is calculated dynamically from associated tasks
- User can create unlimited projects

**Acceptance Criteria:**
- [ ] User can create project with name only
- [ ] User can set color from predefined palette
- [ ] Created project has unique ID
- [ ] Project is associated with user

---

#### FR-PM-002: Assign Tasks to Project

**Priority:** Must Have
**Requirement ID:** FR-PM-002

**Description:** The system shall allow users to assign tasks to projects.

**Inputs:**
- Task ID (unsigned integer)
- Project ID (unsigned integer)

**Processing:**
1. Update task record with project_id
2. Task now belongs to project
3. Project task_count increments automatically

**Outputs:**
- HTTP 200 OK with updated task

**Business Rules:**
- Task can belong to one project at a time
- Task can exist without project (project_id = NULL)
- Only task owner can assign to project
- Only projects owned by user can be assigned

**Acceptance Criteria:**
- [ ] User can assign task to project
- [ ] Task can be reassigned to different project
- [ ] Task can be removed from project (set project_id = NULL)
- [ ] Project task count updates automatically

---

#### FR-PM-003: View Project Dashboard

**Priority:** Must Have
**Requirement ID:** FR-PM-003

**Description:** The system shall display project overview with task statistics.

**Inputs:**
- Project ID (unsigned integer, in URL path)

**Processing:**
1. Retrieve project by ID
2. Verify project belongs to authenticated user
3. Query tasks associated with project
4. Calculate statistics:
   - Total tasks
   - Tasks by status (todo, in-progress, done)
   - Priority distribution
5. Return project details with statistics

**Outputs:**
- HTTP 200 OK with project object and task statistics

**Business Rules:**
- Only project owner can view project
- Statistics calculated in real-time
- Deleted tasks excluded from statistics

**Acceptance Criteria:**
- [ ] User can view project details
- [ ] Task statistics are accurate
- [ ] User cannot view other users' projects

---

#### FR-PM-004: Kanban Board View

**Priority:** Should Have
**Requirement ID:** FR-PM-004

**Description:** The system shall display project tasks in Kanban board format with three columns.

**Inputs:**
- Project ID (unsigned integer)

**Processing:**
1. Retrieve all tasks for project
2. Group tasks by status:
   - Todo: status = 1 (Not Started)
   - In Progress: status = 2 (In Progress)
   - Done: status = 6 (Completed)
3. Display tasks in respective columns
4. Support drag-and-drop to change status

**Outputs:**
- Frontend Kanban board with three columns
- Tasks displayed as cards

**Business Rules:**
- Only three columns displayed (todo, in-progress, done)
- Other statuses (on-hold, cancelled) shown in separate section
- Drag-and-drop updates task status
- Real-time updates (frontend state management)

**Acceptance Criteria:**
- [ ] Tasks displayed in correct columns based on status
- [ ] User can drag task between columns
- [ ] Dragging task updates status in database
- [ ] Kanban board is responsive on mobile

---

#### FR-PM-005: Calendar View

**Priority:** Should Have
**Requirement ID:** FR-PM-005

**Description:** The system shall display project tasks on a monthly calendar based on start/end dates.

**Inputs:**
- Project ID (unsigned integer)
- Month and Year (for calendar display)

**Processing:**
1. Retrieve tasks with start_date or end_date
2. Plot tasks on calendar grid
3. Display task as event on start date
4. Show task duration if end date exists

**Outputs:**
- Frontend calendar view with tasks as events

**Business Rules:**
- Only tasks with dates are displayed on calendar
- Tasks without dates shown in separate "Unscheduled" section
- Calendar defaults to current month
- User can navigate to different months

**Acceptance Criteria:**
- [ ] Tasks with dates appear on calendar
- [ ] Task duration is visually represented
- [ ] User can click task to view details
- [ ] Calendar is responsive on mobile

---

### 3.4 Finance Management Module

#### FR-FM-001: Record Transaction

**Priority:** Must Have
**Requirement ID:** FR-FM-001

**Description:** The system shall allow users to record financial transactions (income, expense, saving, debt, investment).

**Inputs:**
- Source (string, required, max 150 characters)
- Amount (decimal, required, positive number)
- Type (integer, required, 1 or 2: 1=Income, 2=Expense)
- Transaction Type (integer, required, 1-5: Income, Expense, Saving, Debt, Investment)
- Category (string, optional, max 100 characters)
- Date (timestamp, default: current date)
- Notes (string, optional, linked to Notes table)

**Processing:**
1. Validate amount is positive
2. Create transaction record
3. Update user's Finance.balance atomically:
   - If type = 1 (Income) or transaction_type = 3 (Saving): balance += amount
   - If type = 2 (Expense) or transaction_type = 4 (Debt) or transaction_type = 5 (Investment): balance -= amount
4. Use database transaction to ensure atomicity
5. Rollback if either insert or update fails

**Outputs:**
- HTTP 201 Created with transaction object
- Updated balance reflected in Finance record

**Error Handling:**
- HTTP 400 Bad Request if amount is negative or zero
- HTTP 500 Internal Server Error if balance update fails (rollback transaction)

**Business Rules:**
- Amount must be positive decimal (max 2 decimal places)
- Transaction types: 1=Income, 2=Expense, 3=Saving, 4=Debt, 5=Investment
- Balance updated atomically with transaction creation
- Transaction is immutable once created (updates via new transaction)

**Acceptance Criteria:**
- [ ] User can record income transaction (balance increases)
- [ ] User can record expense transaction (balance decreases)
- [ ] Balance updates atomically with transaction
- [ ] Transaction creation fails if balance update fails
- [ ] Amount must be positive

---

#### FR-FM-002: View Balance

**Priority:** Must Have
**Requirement ID:** FR-FM-002

**Description:** The system shall display user's current balance and total debt.

**Inputs:**
- User ID (from JWT token)

**Processing:**
1. Retrieve Finance record for user
2. Display balance and total_debt
3. Calculate net worth: balance - total_debt

**Outputs:**
- HTTP 200 OK with balance, total_debt, net_worth

**Business Rules:**
- Each user has exactly one Finance record
- Balance calculated from transactions
- Total_debt calculated from active loans

**Acceptance Criteria:**
- [ ] User can view current balance
- [ ] User can view total debt
- [ ] Net worth is calculated correctly

---

#### FR-FM-003: Create Savings Instrument

**Priority:** Must Have
**Requirement ID:** FR-FM-003

**Description:** The system shall allow users to track savings instruments (FD, SIP, PPF, NPS, MF, Gold).

**Inputs:**
- Name (string, required, max 255 characters)
- Amount (decimal, required, initial investment)
- Rate (decimal, required, annual interest rate in %)
- Type (integer, 1-6: FD/RD, SIP, PPF, NPS, MF, Gold)

**Processing:**
1. Create savings record
2. Associate with user
3. Optionally calculate maturity value based on rate and term

**Outputs:**
- HTTP 201 Created with savings object

**Business Rules:**
- Amount is principal investment
- Rate is annual percentage (e.g., 7.5 for 7.5%)
- Savings types: 1=FD/RD, 2=SIP, 3=PPF, 4=NPS, 5=MF, 6=Gold
- User can have multiple savings instruments

**Acceptance Criteria:**
- [ ] User can create savings instrument
- [ ] Savings type is selectable
- [ ] Interest rate is stored as decimal
- [ ] Maturity calculation is accurate (if implemented)

---

#### FR-FM-004: Create Loan

**Priority:** Must Have
**Requirement ID:** FR-FM-004

**Description:** The system shall allow users to track loans with automatic EMI calculation.

**Inputs:**
- Name (string, required, max 255 characters)
- Total Amount (decimal, required, principal loan amount)
- Rate (decimal, required, annual interest rate in %)
- Term (unsigned integer, required, loan duration in months)
- Duration (unsigned integer, required, payment frequency in months)

**Processing:**
1. Calculate EMI using formula:
   ```
   EMI = P × r × (1+r)^n / ((1+r)^n - 1)
   where:
   P = Principal (total_amount)
   r = Monthly interest rate (annual_rate / 12 / 100)
   n = Term in months
   ```
2. Store calculated premium_amount (EMI)
3. Update Finance.total_debt with total_amount

**Outputs:**
- HTTP 201 Created with loan object including calculated EMI

**Business Rules:**
- EMI calculated using reducing balance method
- Rate is annual percentage
- Term is total loan duration in months
- Duration is payment frequency (usually 1 for monthly)
- Total debt increases when loan is created

**Acceptance Criteria:**
- [ ] User can create loan with amount, rate, term
- [ ] EMI is calculated correctly
- [ ] Total debt increases by loan amount
- [ ] User can view loan amortization schedule (optional)

---

#### FR-FM-005: Transaction Categorization

**Priority:** Should Have
**Requirement ID:** FR-FM-005

**Description:** The system shall allow users to categorize transactions for better tracking.

**Inputs:**
- Transaction ID (unsigned integer)
- Category (string, max 100 characters)

**Processing:**
1. Predefined categories: Housing, Food, Transportation, Entertainment, Healthcare, Education, Utilities, Shopping, Travel, Other
2. User can select from predefined or create custom category
3. Update transaction with category

**Outputs:**
- HTTP 200 OK with updated transaction

**Business Rules:**
- Category is optional
- Custom categories allowed
- Categories used for expense breakdown reports

**Acceptance Criteria:**
- [ ] User can assign category to transaction
- [ ] Predefined categories available
- [ ] User can create custom category
- [ ] Category used in reports and charts

---

### 3.5 Roadmap Management Module

#### FR-RM-001: Create Learning Roadmap

**Priority:** Should Have
**Requirement ID:** FR-RM-001

**Description:** The system shall allow users to create learning roadmaps with timeline and progress tracking.

**Inputs:**
- Name (string, required, max 255 characters)
- Start Date (timestamp, required)
- End Date (timestamp, required)

**Processing:**
1. Create roadmap record
2. Initialize progress = 0.0
3. Associate with user
4. Allow tasks to be linked to roadmap

**Outputs:**
- HTTP 201 Created with roadmap object

**Business Rules:**
- End date must be after start date
- Progress calculated as: (completed tasks / total tasks) × 100
- User can have multiple active roadmaps

**Acceptance Criteria:**
- [ ] User can create roadmap with name and dates
- [ ] Progress initializes at 0%
- [ ] Roadmap timeline is validated (end > start)

---

#### FR-RM-002: Link Tasks to Roadmap

**Priority:** Should Have
**Requirement ID:** FR-RM-002

**Description:** The system shall allow users to associate tasks with learning roadmaps.

**Inputs:**
- Task ID (unsigned integer)
- Roadmap ID (unsigned integer)

**Processing:**
1. Update task with roadmap_id
2. Recalculate roadmap progress
3. Progress = (completed tasks / total roadmap tasks) × 100

**Outputs:**
- HTTP 200 OK with updated task and roadmap progress

**Business Rules:**
- Task can belong to one roadmap
- Roadmap progress updates automatically when task status changes
- Completed tasks: status = 6 (Completed)

**Acceptance Criteria:**
- [ ] User can link task to roadmap
- [ ] Roadmap progress updates when task completed
- [ ] User can unlink task from roadmap

---

#### FR-RM-003: View Roadmap Progress

**Priority:** Should Have
**Requirement ID:** FR-RM-003

**Description:** The system shall display roadmap progress as percentage and visual timeline.

**Inputs:**
- Roadmap ID (unsigned integer)

**Processing:**
1. Query tasks linked to roadmap
2. Count completed tasks vs. total tasks
3. Calculate percentage: (completed / total) × 100
4. Display progress bar and timeline

**Outputs:**
- HTTP 200 OK with roadmap object including progress percentage

**Business Rules:**
- Progress is read-only (calculated, not set manually)
- Progress updates in real-time as tasks are completed
- Timeline shows start date, end date, and current position

**Acceptance Criteria:**
- [ ] Roadmap displays progress percentage
- [ ] Progress bar visually represents completion
- [ ] Timeline shows start, current, and end dates
- [ ] Progress updates when tasks are completed

---

### 3.6 Dashboard and Analytics Module

#### FR-DA-001: Unified Dashboard

**Priority:** Must Have
**Requirement ID:** FR-DA-001

**Description:** The system shall display a unified dashboard with financial and productivity metrics.

**Inputs:**
- User ID (from JWT token)

**Processing:**
1. Query Finance record for:
   - Total balance
   - Total debt
   - Total savings (sum of all savings)
   - Total loans (sum of all loan amounts)
2. Query Transactions for:
   - Total income (type = 1)
   - Total expense (type = 2)
3. Calculate net worth: balance + total_savings - total_debt - total_loans
4. Query Tasks for:
   - Total active tasks (status != 5)
   - Completed tasks count
5. Query Projects for total count
6. Query Roadmaps for active count (status = 1)

**Outputs:**
- HTTP 200 OK with dashboard object containing all metrics

**Business Rules:**
- Dashboard aggregates data from multiple sources
- Metrics calculated in real-time
- Deleted records excluded from counts

**Acceptance Criteria:**
- [ ] Dashboard displays total balance
- [ ] Dashboard displays total income and expense
- [ ] Dashboard displays net worth
- [ ] Dashboard displays task and project counts
- [ ] Dashboard displays active roadmap count
- [ ] All metrics are accurate and up-to-date

---

#### FR-DA-002: Financial Charts

**Priority:** Should Have
**Requirement ID:** FR-DA-002

**Description:** The system shall display visual charts for financial data analysis.

**Charts Required:**
1. **Income vs. Expense Trend (Line Chart)**
   - X-axis: Time (monthly)
   - Y-axis: Amount
   - Two lines: Income and Expense

2. **Expense Breakdown by Category (Pie Chart)**
   - Segments: Transaction categories
   - Values: Sum of expenses per category

3. **Savings Growth Over Time (Area Chart)**
   - X-axis: Time (monthly)
   - Y-axis: Total savings
   - Cumulative savings amount

**Inputs:**
- Date Range (optional, default: last 6 months)

**Processing:**
1. Query transactions within date range
2. Aggregate by month for trend charts
3. Aggregate by category for pie chart
4. Calculate cumulative savings for growth chart

**Outputs:**
- Frontend chart components with data

**Business Rules:**
- Default date range is last 6 months
- User can select custom date range
- Charts update when new transactions are added

**Acceptance Criteria:**
- [ ] Income vs. Expense chart displays correctly
- [ ] Expense breakdown pie chart shows categories
- [ ] Savings growth chart shows cumulative trend
- [ ] Charts are responsive on mobile
- [ ] Date range filter works correctly

---

#### FR-DA-003: Recent Activity Feed

**Priority:** Should Have
**Requirement ID:** FR-DA-003

**Description:** The system shall display recent user activity (tasks, transactions, projects).

**Inputs:**
- User ID (from JWT token)
- Limit (default: 20 recent items)

**Processing:**
1. Query recent tasks (created or updated)
2. Query recent transactions
3. Query recent projects
4. Merge and sort by timestamp (newest first)
5. Limit to 20 items

**Outputs:**
- HTTP 200 OK with array of activity items

**Business Rules:**
- Activity includes: task created, task completed, transaction recorded, project created
- Limited to 20 most recent items
- Sorted by timestamp descending

**Acceptance Criteria:**
- [ ] Dashboard displays recent activity
- [ ] Activity items are sorted by time (newest first)
- [ ] Activity includes tasks, transactions, projects
- [ ] Limited to 20 items

---

### 3.7 Resource and Note Management Module

#### FR-RN-001: Attach Resource to Task

**Priority:** Should Have
**Requirement ID:** FR-RN-001

**Description:** The system shall allow users to attach resources (links, audio, video, notes) to tasks.

**Inputs:**
- Task ID (unsigned integer)
- Resource Type (integer, 1-4: Link, Audio, Video, Notes)
- Link (string, URL, nullable)
- Misc ID (unsigned integer, for external references)

**Processing:**
1. Create resource record
2. Associate with task
3. Allow multiple resources per task

**Outputs:**
- HTTP 201 Created with resource object

**Business Rules:**
- Resource types: 1=Link, 2=Audio, 3=Video, 4=Notes
- Task can have multiple resources
- Link is required for type 1, optional for others
- Misc ID for integration with external systems (future)

**Acceptance Criteria:**
- [ ] User can attach link to task
- [ ] User can attach multiple resources to task
- [ ] Resource type is validated
- [ ] Resources displayed with task details

---

#### FR-RN-002: Create Note

**Priority:** Should Have
**Requirement ID:** FR-RN-002

**Description:** The system shall allow users to create notes and associate with tasks or transactions.

**Inputs:**
- Text (string, required, max 5000 characters)

**Processing:**
1. Create note record
2. Return note ID for association
3. Link note to task or transaction via foreign key

**Outputs:**
- HTTP 201 Created with note object (note_id, text)

**Business Rules:**
- Note can be associated with task or transaction
- Note is reusable (same note can be linked to multiple entities)
- Note text supports plain text (markdown in future)

**Acceptance Criteria:**
- [ ] User can create note
- [ ] Note can be linked to task
- [ ] Note can be linked to transaction
- [ ] Note text is stored correctly

---

### 3.8 Search and Filter Module

#### FR-SF-001: Global Search

**Priority:** Should Have
**Requirement ID:** FR-SF-001

**Description:** The system shall provide search functionality across tasks, projects, and transactions.

**Inputs:**
- Search Query (string, min 2 characters)
- Search Scope (optional: tasks, projects, transactions, all)

**Processing:**
1. Perform full-text search on:
   - Task: title, description
   - Project: name, description
   - Transaction: source, category
2. Return results grouped by type
3. Limit results to 50 items per type

**Outputs:**
- HTTP 200 OK with search results object:
  ```json
  {
    "tasks": [...],
    "projects": [...],
    "transactions": [...]
  }
  ```

**Business Rules:**
- Minimum search query length: 2 characters
- Case-insensitive search
- Results limited to user's own data
- Maximum 50 results per type

**Acceptance Criteria:**
- [ ] User can search across all entities
- [ ] Search is case-insensitive
- [ ] Results grouped by type
- [ ] User only sees their own data in results

---

#### FR-SF-002: Filter Tasks

**Priority:** Should Have
**Requirement ID:** FR-SF-002

**Description:** The system shall allow filtering tasks by status, priority, date range, and roadmap.

**Inputs:**
- Status (integer, 1-6, optional)
- Priority (integer, 1-5, optional)
- Date Range (start_date, end_date, optional)
- Roadmap ID (unsigned integer, optional)
- Is Roadmap (boolean, optional)

**Processing:**
1. Build query with filters
2. Apply AND logic (all filters must match)
3. Return filtered task list

**Outputs:**
- HTTP 200 OK with array of tasks matching filters

**Business Rules:**
- All filters are optional (no filters = return all tasks)
- Filters use AND logic (cumulative)
- Date range applies to start_date or end_date

**Acceptance Criteria:**
- [ ] User can filter tasks by status
- [ ] User can filter tasks by priority
- [ ] User can filter tasks by date range
- [ ] Multiple filters work together (AND logic)
- [ ] Filter results are accurate

---

### 3.9 Tag Management Module

#### FR-TG-001: Create Tag

**Priority:** Could Have
**Requirement ID:** FR-TG-001

**Description:** The system shall allow users to create custom tags for categorization.

**Inputs:**
- Name (string, required, max 50 characters)
- Color (string, hex color code, optional)

**Processing:**
1. Create tag record
2. Associate with user (user-specific tags)
3. Return created tag

**Outputs:**
- HTTP 201 Created with tag object

**Business Rules:**
- Tag names unique per user
- Tags reusable across multiple tasks
- Default color assigned if not provided

**Acceptance Criteria:**
- [ ] User can create tag
- [ ] Tag name is unique per user
- [ ] Tag can be assigned to tasks

---

#### FR-TG-002: Assign Tags to Tasks

**Priority:** Could Have
**Requirement ID:** FR-TG-002

**Description:** The system shall allow users to assign multiple tags to tasks.

**Inputs:**
- Task ID (unsigned integer)
- Tag IDs (array of unsigned integers)

**Processing:**
1. Create many-to-many relationships in TodoTags table
2. Task can have multiple tags
3. Tag can be used on multiple tasks

**Outputs:**
- HTTP 200 OK with updated task including tags

**Business Rules:**
- Many-to-many relationship (task ↔ tags)
- No duplicate tag assignments per task
- Tags filterable on task list

**Acceptance Criteria:**
- [ ] User can assign multiple tags to task
- [ ] User can remove tag from task
- [ ] User can filter tasks by tag

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### NFR-PF-001: API Response Time

**Priority:** Must Have
**Requirement ID:** NFR-PF-001

**Description:** The system shall respond to API requests within acceptable time limits.

**Requirements:**
- **95th Percentile:** < 500ms for all API endpoints
- **99th Percentile:** < 1000ms for all API endpoints
- **Average Response Time:** < 200ms

**Measurement:**
- Load testing with 1000 concurrent users
- Measured at server-side (excludes network latency)

**Acceptance Criteria:**
- [ ] 95% of API requests complete within 500ms
- [ ] Dashboard API responds within 200ms on average
- [ ] Task creation completes within 100ms

---

#### NFR-PF-002: Page Load Time

**Priority:** Must Have
**Requirement ID:** NFR-PF-002

**Description:** The system shall load web pages within acceptable time limits.

**Requirements:**
- **First Contentful Paint (FCP):** < 1.5 seconds
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **Time to Interactive (TTI):** < 3.5 seconds
- **Total Page Load:** < 2 seconds on 3G connection

**Measurement:**
- Lighthouse performance audit
- Tested on 3G connection speed (1.6 Mbps)

**Acceptance Criteria:**
- [ ] Dashboard loads within 2 seconds on 3G
- [ ] Lighthouse performance score > 90
- [ ] First paint occurs within 1.5 seconds

---

#### NFR-PF-003: Database Query Performance

**Priority:** Must Have
**Requirement ID:** NFR-PF-003

**Description:** The system shall execute database queries efficiently.

**Requirements:**
- **Simple Queries (single table):** < 10ms
- **Complex Queries (joins):** < 50ms
- **Aggregation Queries:** < 100ms
- **Dashboard Queries:** < 100ms total

**Optimization Strategies:**
- Proper indexing on frequently queried columns
- Query optimization (EXPLAIN ANALYZE)
- Connection pooling (GORM default)

**Acceptance Criteria:**
- [ ] User task list query completes within 20ms
- [ ] Dashboard aggregate queries complete within 100ms
- [ ] Database indexes created on user_id, status, dates

---

#### NFR-PF-004: Scalability

**Priority:** Should Have
**Requirement ID:** NFR-PF-004

**Description:** The system shall support growing user base and data volume.

**Requirements:**
- **Concurrent Users:** Support 1,000 concurrent users without degradation
- **User Capacity:** Support 100,000 registered users
- **Data Volume:** Support 10,000 tasks per user efficiently
- **Transaction Volume:** Support 10,000 transactions per user

**Scalability Strategies:**
- Horizontal scaling (multiple backend instances)
- Database read replicas (if needed)
- Caching frequently accessed data
- Efficient pagination (cursor-based)

**Acceptance Criteria:**
- [ ] System handles 1,000 concurrent users
- [ ] User with 10,000 tasks experiences no slowdown
- [ ] Database can scale to 100,000 users

---

#### NFR-PF-005: Frontend Bundle Size

**Priority:** Should Have
**Requirement ID:** NFR-PF-005

**Description:** The system shall minimize frontend bundle size for faster loading.

**Requirements:**
- **Initial Bundle (gzipped):** < 500KB
- **Lazy-loaded Chunks:** < 100KB each
- **Images:** Optimized (WebP, lazy loading)

**Optimization Strategies:**
- Next.js code splitting
- Tree shaking (remove unused code)
- Minification and compression
- CDN for static assets

**Acceptance Criteria:**
- [ ] Initial JavaScript bundle < 500KB gzipped
- [ ] Images use modern formats (WebP)
- [ ] Code splitting implemented for routes

---

### 4.2 Security Requirements

#### NFR-SC-001: Password Security

**Priority:** Must Have
**Requirement ID:** NFR-SC-001

**Description:** The system shall securely store and handle user passwords.

**Requirements:**
- **Hashing Algorithm:** bcrypt with cost factor ≥ 10
- **Storage:** Never store passwords in plaintext
- **Transmission:** Passwords transmitted over HTTPS only
- **Password Policy:** Minimum 8 characters (enforced)

**Implementation:**
- Go bcrypt library for hashing
- Password verification using bcrypt comparison
- HTTPS enforced in production

**Acceptance Criteria:**
- [ ] All passwords hashed with bcrypt (cost 10)
- [ ] Passwords never logged or exposed in errors
- [ ] Password transmitted over HTTPS only
- [ ] Minimum 8-character password enforced

---

#### NFR-SC-002: Authentication Security

**Priority:** Must Have
**Requirement ID:** NFR-SC-002

**Description:** The system shall use secure authentication mechanisms.

**Requirements:**
- **Algorithm:** JWT with HMAC-SHA256 (HS256)
- **Token Expiration:** 24 hours
- **Token Storage:** Client-side (localStorage or httpOnly cookie)
- **Secret Key:** Minimum 256-bit random secret
- **Protected Endpoints:** All non-auth endpoints require valid JWT

**Implementation:**
- Go JWT library for token generation/verification
- Authorization middleware on protected routes
- Secret key stored in environment variable

**Acceptance Criteria:**
- [ ] JWT tokens expire after 24 hours
- [ ] Invalid tokens rejected with 401 Unauthorized
- [ ] All protected endpoints require valid JWT
- [ ] JWT secret is strong and never exposed

---

#### NFR-SC-003: Rate Limiting

**Priority:** Must Have
**Requirement ID:** NFR-SC-003

**Description:** The system shall implement rate limiting to prevent abuse.

**Requirements:**
- **Login Attempts:** 5 attempts per hour per IP
- **OTP Generation:** 1 request per minute per user
- **General API:** 100 requests per minute per user
- **Implementation:** In-memory rate limiter with cleanup

**Rate Limit Responses:**
- HTTP 429 Too Many Requests
- Retry-After header with cooldown time

**Acceptance Criteria:**
- [ ] Login limited to 5 attempts per hour
- [ ] OTP generation limited to 1 per minute
- [ ] API rate limiting implemented
- [ ] Rate limit cleanup goroutine running

---

#### NFR-SC-004: Data Encryption

**Priority:** Must Have
**Requirement ID:** NFR-SC-004

**Description:** The system shall encrypt data in transit and at rest (where applicable).

**Requirements:**
- **In Transit:** TLS 1.2+ for all HTTPS connections
- **At Rest:** Database-level encryption (optional, depends on hosting)
- **Sensitive Fields:** OTP cleared after verification

**Implementation:**
- HTTPS certificate (Let's Encrypt or cloud provider)
- Database encryption via hosting provider (AWS RDS, GCP Cloud SQL)

**Acceptance Criteria:**
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] TLS 1.2+ used for all connections
- [ ] OTPs cleared from database after use

---

#### NFR-SC-005: Input Validation

**Priority:** Must Have
**Requirement ID:** NFR-SC-005

**Description:** The system shall validate all user inputs to prevent injection attacks.

**Requirements:**
- **SQL Injection:** GORM parameterized queries (automatic)
- **XSS Prevention:** React JSX auto-escaping (automatic)
- **Input Sanitization:** Validate length, type, format
- **Output Encoding:** Proper encoding for JSON responses

**Validation Rules:**
- Email: Valid email format
- Password: Minimum 8 characters
- Amounts: Positive decimals only
- Text fields: Maximum length enforced

**Acceptance Criteria:**
- [ ] All inputs validated on backend (never trust client)
- [ ] SQL injection prevented via GORM
- [ ] XSS prevented via React escaping
- [ ] Error messages don't expose sensitive data

---

#### NFR-SC-006: Session Management

**Priority:** Should Have
**Requirement ID:** NFR-SC-006

**Description:** The system shall manage user sessions securely.

**Requirements:**
- **Token Expiration:** 24-hour JWT expiration
- **Token Refresh:** Implement refresh token mechanism (future)
- **Logout:** Client-side token deletion
- **Revocation:** Token blacklist for logout (future)

**Implementation:**
- JWT tokens with expiration claim (exp)
- Client clears token on logout
- Future: Redis-based token blacklist

**Acceptance Criteria:**
- [ ] Tokens expire after 24 hours
- [ ] Users can log out (token cleared)
- [ ] Expired tokens rejected by backend

---

#### NFR-SC-007: Email Security

**Priority:** Must Have
**Requirement ID:** NFR-SC-007

**Description:** The system shall securely send emails and protect against email-based attacks.

**Requirements:**
- **OTP Delivery:** Secure SMTP connection (TLS)
- **Email Validation:** Verify email format before sending
- **Rate Limiting:** Prevent email spam (1 OTP per minute)
- **Unsubscribe:** Email opt-out mechanism (future)

**Implementation:**
- SendGrid API for reliable delivery
- TLS encryption for SMTP
- Rate limiting on OTP generation

**Acceptance Criteria:**
- [ ] OTP emails sent securely via TLS
- [ ] Email addresses validated before sending
- [ ] Rate limiting prevents email spam

---

### 4.3 Usability Requirements

#### NFR-US-001: Responsive Design

**Priority:** Must Have
**Requirement ID:** NFR-US-001

**Description:** The system shall provide optimal user experience across devices.

**Requirements:**
- **Mobile (320-767px):** Single column, touch-friendly UI
- **Tablet (768-1023px):** Two-column layout, collapsible sidebar
- **Desktop (1024px+):** Full sidebar, multi-column grids
- **Touch Targets:** Minimum 44×44px for mobile

**Implementation:**
- Tailwind CSS responsive utilities
- Mobile-first design approach
- Viewport meta tag for proper scaling

**Acceptance Criteria:**
- [ ] UI adapts to mobile, tablet, desktop screens
- [ ] Touch targets are 44×44px minimum on mobile
- [ ] Text is readable without zooming
- [ ] Navigation works on mobile (hamburger menu)

---

#### NFR-US-002: Accessibility (WCAG 2.1 Level AA)

**Priority:** Should Have
**Requirement ID:** NFR-US-002

**Description:** The system shall be accessible to users with disabilities.

**Requirements:**
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Keyboard Navigation:** All functions accessible via keyboard
- **Screen Readers:** ARIA labels on interactive elements
- **Focus Indicators:** Visible focus states on focusable elements
- **Alt Text:** Descriptive alt text for images

**Testing:**
- axe DevTools for accessibility audit
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS)

**Acceptance Criteria:**
- [ ] Color contrast meets WCAG AA standards
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels on buttons, forms, modals
- [ ] Focus indicators visible on tab navigation
- [ ] Images have descriptive alt text

---

#### NFR-US-003: User Feedback

**Priority:** Must Have
**Requirement ID:** NFR-US-003

**Description:** The system shall provide clear feedback for user actions.

**Requirements:**
- **Success Messages:** Confirmation after successful actions
- **Error Messages:** Clear error descriptions (not technical)
- **Loading States:** Spinners/skeletons during data fetching
- **Validation Feedback:** Inline validation errors on forms

**Implementation:**
- Toast notifications for success/error
- Skeleton loaders for async content
- Inline error messages below form fields

**Acceptance Criteria:**
- [ ] Success message displayed after task creation
- [ ] Error message displayed on failed login
- [ ] Loading spinner shown during API calls
- [ ] Form validation errors shown inline

---

#### NFR-US-004: Onboarding Experience

**Priority:** Should Have
**Requirement ID:** NFR-US-004

**Description:** The system shall provide guidance for new users.

**Requirements:**
- **First Login:** Welcome modal with quick tour
- **Tooltips:** Contextual help on complex features
- **Empty States:** Helpful prompts when no data exists
- **Tutorial:** Optional guided walkthrough

**Implementation:**
- Welcome modal on first dashboard visit
- Tooltip library (React Tooltip)
- Empty state components with call-to-action

**Acceptance Criteria:**
- [ ] New users see welcome modal
- [ ] Tooltips available on complex features
- [ ] Empty states encourage user action
- [ ] Tutorial is skippable and optional

---

#### NFR-US-005: Consistency

**Priority:** Must Have
**Requirement ID:** NFR-US-005

**Description:** The system shall maintain consistent UI patterns and terminology.

**Requirements:**
- **Design System:** Consistent colors, typography, spacing
- **Component Library:** Reusable UI components
- **Terminology:** Consistent naming (Task vs. Todo, Project vs. Board)
- **Interaction Patterns:** Similar actions work the same way

**Implementation:**
- Tailwind CSS design tokens
- Shared component library
- Style guide documentation

**Acceptance Criteria:**
- [ ] UI uses consistent color palette
- [ ] Buttons have consistent styling
- [ ] Terminology is consistent across app
- [ ] Similar actions have similar UI patterns

---

### 4.4 Reliability Requirements

#### NFR-RL-001: Availability

**Priority:** Must Have
**Requirement ID:** NFR-RL-001

**Description:** The system shall maintain high availability for users.

**Requirements:**
- **Uptime:** 99.5% monthly uptime (3.65 hours downtime/month)
- **Planned Maintenance:** Scheduled during low-traffic hours
- **Monitoring:** Health check endpoints
- **Alerting:** Automatic alerts for downtime

**Implementation:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Health check endpoint: GET /health
- Alerting via email/SMS for incidents

**Acceptance Criteria:**
- [ ] System maintains 99.5% uptime
- [ ] Health check endpoint responds within 100ms
- [ ] Downtime alerts sent within 5 minutes
- [ ] Planned maintenance communicated in advance

---

#### NFR-RL-002: Data Integrity

**Priority:** Must Have
**Requirement ID:** NFR-RL-002

**Description:** The system shall ensure data consistency and accuracy.

**Requirements:**
- **ACID Transactions:** Use database transactions for critical operations
- **Foreign Key Constraints:** Enforce referential integrity
- **Validation:** Server-side validation for all inputs
- **Atomic Operations:** Transaction + balance update is atomic

**Implementation:**
- PostgreSQL ACID guarantees
- GORM transaction support
- Database constraints (FK, CHECK, NOT NULL)

**Acceptance Criteria:**
- [ ] Financial transactions are atomic (insert + balance update)
- [ ] Foreign key constraints prevent orphaned records
- [ ] Data validation enforced on server side
- [ ] Database integrity maintained after failures

---

#### NFR-RL-003: Backup and Recovery

**Priority:** Should Have
**Requirement ID:** NFR-RL-003

**Description:** The system shall protect against data loss through regular backups.

**Requirements:**
- **Frequency:** Daily automated backups
- **Retention:** 30-day backup retention
- **Recovery Time Objective (RTO):** < 4 hours
- **Recovery Point Objective (RPO):** < 24 hours (daily backups)

**Implementation:**
- Managed database backup (AWS RDS, GCP Cloud SQL)
- Automated backup verification
- Documented recovery procedures

**Acceptance Criteria:**
- [ ] Daily backups configured and running
- [ ] Backups retained for 30 days
- [ ] Backup restoration tested successfully
- [ ] Recovery procedures documented

---

#### NFR-RL-004: Error Handling

**Priority:** Must Have
**Requirement ID:** NFR-RL-004

**Description:** The system shall handle errors gracefully without exposing sensitive information.

**Requirements:**
- **Global Error Handler:** Catch all panics in Go backend
- **Logging:** Log errors with context (not passwords/tokens)
- **User-Facing Errors:** Generic messages (not stack traces)
- **Retry Logic:** Automatic retry for transient failures (email sending)

**Implementation:**
- Gin recovery middleware
- Structured logging (log levels: INFO, WARN, ERROR)
- Generic error messages to users

**Acceptance Criteria:**
- [ ] Panics caught by recovery middleware
- [ ] Errors logged with context (user ID, endpoint)
- [ ] Users see generic error messages
- [ ] Stack traces never exposed to users

---

### 4.5 Maintainability Requirements

#### NFR-MT-001: Code Quality

**Priority:** Must Have
**Requirement ID:** NFR-MT-001

**Description:** The system shall maintain high code quality for long-term maintainability.

**Requirements:**
- **Code Style:** Follow language conventions (Go, TypeScript)
- **Linting:** Automated linting (gofmt, ESLint)
- **Code Reviews:** All changes reviewed before merging
- **Complexity:** Avoid overly complex functions (cyclomatic complexity < 10)

**Implementation:**
- gofmt for Go code formatting
- ESLint + Prettier for TypeScript
- GitHub pull request reviews
- SonarQube for code quality metrics (future)

**Acceptance Criteria:**
- [ ] All Go code formatted with gofmt
- [ ] All TypeScript code passes ESLint
- [ ] No functions exceed 100 lines (guideline)
- [ ] All pull requests reviewed before merge

---

#### NFR-MT-002: Documentation

**Priority:** Should Have
**Requirement ID:** NFR-MT-002

**Description:** The system shall have comprehensive documentation for developers and users.

**Requirements:**
- **API Documentation:** OpenAPI/Swagger specification
- **Code Comments:** Explain complex logic (not obvious code)
- **README:** Setup instructions, architecture overview
- **User Guide:** Help documentation for end users

**Implementation:**
- Swagger/OpenAPI generated from code annotations
- Inline comments for complex functions
- Comprehensive README.md files
- User help center (future)

**Acceptance Criteria:**
- [ ] API documentation accessible via /api/docs
- [ ] README includes setup instructions
- [ ] Complex functions have explanatory comments
- [ ] User guide available for common tasks

---

#### NFR-MT-003: Testing

**Priority:** Must Have
**Requirement ID:** NFR-MT-003

**Description:** The system shall have automated tests for regression prevention.

**Requirements:**
- **Unit Tests:** 80% code coverage for critical modules
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Critical user flows (login, create task, record transaction)
- **Test Automation:** Tests run on every commit (CI/CD)

**Implementation:**
- Go testing framework for backend unit tests
- Node.js test runner for frontend
- Cypress/Playwright for E2E tests
- GitHub Actions for CI/CD

**Acceptance Criteria:**
- [ ] Backend critical modules have 80% test coverage
- [ ] All API endpoints have integration tests
- [ ] E2E tests cover login and core workflows
- [ ] Tests run automatically on pull requests

---

#### NFR-MT-004: Version Control

**Priority:** Must Have
**Requirement ID:** NFR-MT-004

**Description:** The system shall use version control for all code changes.

**Requirements:**
- **Git Repository:** All code versioned in Git
- **Branching Strategy:** Feature branches, main branch protected
- **Commit Messages:** Descriptive commit messages
- **Change Log:** Document releases in CHANGELOG.md

**Implementation:**
- GitHub for repository hosting
- Branch protection rules (require reviews)
- Conventional commit messages
- Semantic versioning (vX.Y.Z)

**Acceptance Criteria:**
- [ ] All code in Git repository
- [ ] Main branch protected (requires PR)
- [ ] Commit messages describe changes
- [ ] Releases documented in CHANGELOG

---

### 4.6 Portability Requirements

#### NFR-PT-001: Browser Compatibility

**Priority:** Must Have
**Requirement ID:** NFR-PT-001

**Description:** The system shall work on modern web browsers.

**Requirements:**
- **Chrome:** Version 90 and above
- **Firefox:** Version 88 and above
- **Safari:** Version 14 and above
- **Edge:** Version 90 and above (Chromium-based)

**Testing:**
- Manual testing on each browser
- BrowserStack for automated cross-browser testing (optional)

**Acceptance Criteria:**
- [ ] Application works on Chrome 90+
- [ ] Application works on Firefox 88+
- [ ] Application works on Safari 14+
- [ ] Application works on Edge 90+
- [ ] Graceful degradation for older browsers

---

#### NFR-PT-002: Platform Independence

**Priority:** Should Have
**Requirement ID:** NFR-PT-002

**Description:** The system backend shall be deployable on multiple cloud platforms.

**Requirements:**
- **Cloud Agnostic:** No platform-specific dependencies
- **Containerization:** Docker for portable deployment
- **Database Portability:** PostgreSQL available on all platforms

**Platforms Supported:**
- AWS (EC2, RDS, Elastic Beanstalk)
- GCP (Compute Engine, Cloud SQL, App Engine)
- Railway (PaaS)
- Vercel (frontend only)

**Acceptance Criteria:**
- [ ] Backend deployable on AWS
- [ ] Backend deployable on GCP
- [ ] Backend deployable on Railway
- [ ] Frontend deployable on Vercel
- [ ] Docker image builds successfully

---

### 4.7 Compliance Requirements

#### NFR-CP-001: GDPR Compliance

**Priority:** Must Have
**Requirement ID:** NFR-CP-001

**Description:** The system shall comply with GDPR for EU users.

**Requirements:**
- **Right to Access:** Users can export their data
- **Right to Erasure:** Users can delete their accounts
- **Data Portability:** Export data in JSON format
- **Privacy Policy:** Clear privacy policy and terms of service
- **Consent:** Users consent to data collection on registration

**Implementation:**
- Account deletion endpoint (soft delete + anonymize)
- Data export endpoint (JSON download)
- Privacy policy page
- Terms of service acceptance checkbox on registration

**Acceptance Criteria:**
- [ ] Users can export all their data
- [ ] Users can delete their accounts
- [ ] Privacy policy accessible on website
- [ ] Users consent to terms on registration
- [ ] Personal data deletion within 30 days of request

---

#### NFR-CP-002: Data Retention

**Priority:** Should Have
**Requirement ID:** NFR-CP-002

**Description:** The system shall retain data according to legal and business requirements.

**Requirements:**
- **Active Data:** Indefinite retention while account active
- **Deleted Accounts:** 30-day soft delete, then permanent removal
- **Financial Records:** 7-year retention for tax/audit purposes
- **Audit Logs:** 1-year retention (login, transactions)

**Implementation:**
- Soft delete with DeletedAt timestamp
- Scheduled job to purge old deleted records
- Separate archive table for financial records

**Acceptance Criteria:**
- [ ] Deleted accounts purged after 30 days
- [ ] Financial records retained for 7 years
- [ ] Audit logs retained for 1 year
- [ ] Data retention policy documented

---

---

## 5. External Interface Requirements

### 5.1 User Interface Requirements

#### UI-001: Web Application Interface

**Description:** The system shall provide a responsive web-based user interface accessible via modern browsers.

**Components:**
1. **Authentication Pages:**
   - Login page with email/password fields
   - Registration page with username/email/password fields
   - Forgot password page with email input and OTP entry
   - Email verification page with OTP input fields

2. **Dashboard:**
   - Unified dashboard with financial and productivity widgets
   - Welcome section with user greeting
   - Financial summary cards (balance, income, expense, net worth)
   - Productivity summary cards (tasks, projects, roadmaps)
   - Recent activity feed
   - Quick action buttons

3. **Task Management Pages:**
   - Task list view with filters (status, priority, date)
   - Task creation modal with form fields
   - Task detail view with edit capability
   - Subtask display and creation

4. **Project Management Pages:**
   - Project list (grid or card view)
   - Project detail page with:
     - Kanban board (3 columns: To Do, In Progress, Done)
     - Calendar view with tasks plotted by date
     - Project settings (name, color, status)

5. **Finance Pages:**
   - Transaction list with filters (date, category, type)
   - Transaction creation form
   - Savings instrument list and creation form
   - Loan list and creation form with EMI calculation
   - Financial charts (income vs. expense, category breakdown)

6. **Roadmap Pages:**
   - Roadmap list with progress bars
   - Roadmap detail with timeline and linked tasks

7. **Settings Pages:**
   - Profile settings (username, email)
   - Password change form
   - Account deletion option

**Design Principles:**
- **Minimalist:** Clean, focused interface without clutter
- **Consistent:** Uniform color scheme, typography, spacing
- **Responsive:** Adapts to mobile, tablet, desktop screens
- **Accessible:** WCAG 2.1 Level AA compliant

**Color Palette:**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)
- Neutral: Gray shades

**Typography:**
- Font Family: System fonts (sans-serif)
- Headings: Bold, larger sizes
- Body: Regular weight, readable size (16px minimum)

---

### 5.2 API Interface Requirements

#### API-001: RESTful JSON API

**Description:** The system shall expose a RESTful API using JSON for data exchange.

**Base URL:**
- Development: `http://localhost:80/api`
- Production: `https://api.fintrax.com/api`

**Request Format:**
```http
POST /api/todo HTTP/1.1
Host: api.fintrax.com
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "title": "Complete project documentation",
  "description": "Write comprehensive SRS",
  "priority": 1,
  "status": 1
}
```

**Response Format (Success):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": 201,
  "message": "Todo created successfully",
  "data": {
    "task_id": 123,
    "title": "Complete project documentation",
    "description": "Write comprehensive SRS",
    "priority": 1,
    "status": 1,
    "created_at": "2025-11-13T10:00:00Z"
  },
  "error": null
}
```

**Response Format (Error):**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": 400,
  "message": "Invalid request",
  "data": null,
  "error": "Field 'title' is required"
}
```

**HTTP Methods:**
- `GET`: Retrieve resources
- `POST`: Create resources
- `PATCH` / `PUT`: Update resources
- `DELETE`: Delete resources (soft delete)

**Status Codes:**
- `200 OK`: Successful GET, PATCH, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing/invalid JWT
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

**Authentication:**
- Header: `Authorization: Bearer <JWT_TOKEN>`
- Required for all endpoints except:
  - POST /api/user/register
  - POST /api/user/login
  - POST /api/user/verify-email
  - POST /api/user/generate-otp
  - POST /api/user/forgot-password

---

### 5.3 Database Interface Requirements

#### DB-001: PostgreSQL Database

**Description:** The system shall use PostgreSQL as the primary data store.

**Connection Parameters:**
- Host: Configurable via `DB_HOST` environment variable
- Port: Configurable via `DB_PORT` environment variable (default: 5432)
- Database Name: Configurable via `DB_NAME` environment variable
- Username: Configurable via `DB_USER` environment variable
- Password: Configurable via `DB_PASSWORD` environment variable
- SSL Mode: Disabled for development, enabled for production

**Connection String Format:**
```
postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=disable
```

**ORM:** GORM (Go Object-Relational Mapping)

**Migration Tool:** golang-migrate

**Schema Management:**
- All schema changes via migration files (.sql)
- Up migrations for forward changes
- Down migrations for rollback
- Sequential numbering (timestamp prefix)

**Connection Pooling:**
- Managed by GORM
- Default pool settings (adjust based on load)

---

### 5.4 Email Interface Requirements

#### EMAIL-001: SMTP Email Delivery

**Description:** The system shall send transactional emails via SMTP service provider.

**Provider:** SendGrid (or AWS SES as alternative)

**Email Types:**
1. **OTP Verification (Registration):**
   - Subject: "Fintrax - Verify Your Email"
   - Body: Welcome message + OTP code + validity period

2. **OTP for Password Reset:**
   - Subject: "Fintrax - OTP for Password Reset"
   - Body: OTP code + validity period + security warning

3. **Password Changed Notification (Future):**
   - Subject: "Fintrax - Password Changed"
   - Body: Confirmation + security notice

**Email Format:**
- Plain text (HTML optional for future)
- Sender: "Fintrax <noreply@fintrax.com>"
- Reply-To: "support@fintrax.com"

**SMTP Configuration:**
- Host: `smtp.sendgrid.net`
- Port: `587` (TLS) or `465` (SSL)
- Authentication: API key or username/password
- Encryption: TLS 1.2+

**Deliverability Requirements:**
- 99%+ delivery rate
- Emails delivered within 60 seconds
- Bounce handling and logging

---

---

## 6. System Features

### 6.1 Feature: User Registration and Onboarding

**Description:** Allow new users to create accounts and get started with Fintrax.

**Priority:** Must Have

**Functional Requirements:**
- FR-UM-001: User Registration
- FR-UM-002: Email Verification

**User Flow:**
1. User navigates to registration page
2. User enters username, email, password
3. User submits registration form
4. System creates account and sends OTP to email
5. User enters OTP on verification page
6. System activates account
7. User redirected to dashboard

**Dependencies:**
- Email service (SendGrid) for OTP delivery
- JWT token generation for immediate authentication

**Acceptance Criteria:**
- User can register with valid credentials
- OTP sent to email within 60 seconds
- User can verify email with correct OTP
- Verified user can access dashboard

---

### 6.2 Feature: Task Management Workflow

**Description:** Complete task lifecycle from creation to completion.

**Priority:** Must Have

**Functional Requirements:**
- FR-TM-001: Create Task
- FR-TM-002: View Tasks
- FR-TM-003: Update Task
- FR-TM-004: Delete Task
- FR-TM-005: Hierarchical Task Structure

**User Flow:**
1. User clicks "Add Task" button
2. User fills task form (title, description, priority, dates)
3. User optionally selects parent task for subtask
4. User submits form
5. System creates task and displays in task list
6. User updates task status as work progresses
7. User marks task as completed
8. Task archived after completion (status = 6)

**Dependencies:**
- None (core feature)

**Acceptance Criteria:**
- User can create, view, update, delete tasks
- Subtasks can be created under parent tasks
- Task status can be updated via UI
- Completed tasks remain visible

---

### 6.3 Feature: Financial Transaction Tracking

**Description:** Record and track income and expenses to monitor financial health.

**Priority:** Must Have

**Functional Requirements:**
- FR-FM-001: Record Transaction
- FR-FM-002: View Balance
- FR-FM-005: Transaction Categorization

**User Flow:**
1. User navigates to Finance → Transactions
2. User clicks "Add Transaction" button
3. User selects transaction type (Income/Expense)
4. User enters source, amount, category, date
5. User submits form
6. System records transaction and updates balance
7. Updated balance displayed immediately
8. Transaction appears in transaction list

**Dependencies:**
- Finance record (created during user registration)

**Acceptance Criteria:**
- User can record income and expense transactions
- Balance updates correctly based on transaction type
- Transactions are listed with filters
- Balance is always accurate

---

### 6.4 Feature: Project-Based Organization

**Description:** Group related tasks into projects for better organization.

**Priority:** Must Have

**Functional Requirements:**
- FR-PM-001: Create Project
- FR-PM-002: Assign Tasks to Project
- FR-PM-003: View Project Dashboard

**User Flow:**
1. User creates project with name and color
2. User creates tasks and assigns to project
3. User views project detail page
4. Project displays all associated tasks
5. User can view task statistics for project
6. User can switch between Kanban and Calendar views

**Dependencies:**
- Task management module (tasks must exist)

**Acceptance Criteria:**
- User can create projects
- Tasks can be assigned to projects
- Project displays task statistics
- Kanban and Calendar views work correctly

---

### 6.5 Feature: Unified Dashboard

**Description:** Single view showing both productivity and financial metrics.

**Priority:** Must Have

**Functional Requirements:**
- FR-DA-001: Unified Dashboard
- FR-DA-002: Financial Charts
- FR-DA-003: Recent Activity Feed

**User Flow:**
1. User logs in
2. User redirected to dashboard
3. Dashboard displays:
   - Welcome message
   - Financial summary (balance, income, expense, net worth)
   - Productivity summary (tasks, projects, roadmaps)
   - Visual charts (income vs. expense trend)
   - Recent activity feed
   - Quick action buttons
4. User can click widgets to navigate to detailed pages

**Dependencies:**
- All data modules (tasks, finance, projects, roadmaps)

**Acceptance Criteria:**
- Dashboard displays all metrics accurately
- Charts render correctly
- Recent activity shows latest items
- Quick actions work (create task, record transaction)

---

---

## 7. Data Requirements

### 7.1 Logical Data Model

**Entity-Relationship Overview:**

```
Users (1) ─────────── (1) Finance
  │
  │ (1:N)
  ├─────────────────── Todos
  │                      │
  │                      │ Self-referencing (parent-child)
  │                      │ (N:1)
  │                      ├─── Roadmap
  │                      │ (1:N)
  │                      ├─── Resources
  │                      │ (1:1)
  │                      └─── Notes
  │
  │ (1:N)
  ├─────────────────── Projects
  │ (1:N)
  ├─────────────────── Transactions ─── (1:1) Notes
  │ (1:N)
  ├─────────────────── Savings
  │ (1:N)
  └─────────────────── Loans

Todos (N:M) ─────────── Tags (via TodoTags)
```

### 7.2 Data Dictionary

#### 7.2.1 Users Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user identifier |
| username | VARCHAR(255) | NOT NULL | User's display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| password | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| otp | INTEGER | NULL | One-time password for verification |
| otp_time | TIMESTAMP | NULL | OTP generation timestamp |
| otp_tries | INTEGER | DEFAULT 0 | Failed OTP attempts counter |
| status | VARCHAR(20) | DEFAULT 'Inactive' | Account status (Active, Inactive, Banned, Deleted) |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_users_email` on `email` (unique, for login queries)

---

#### 7.2.2 Finance Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique finance record ID |
| balance | DECIMAL(15,2) | NOT NULL, DEFAULT 0.00 | Current balance |
| total_debt | DECIMAL(15,2) | NOT NULL, DEFAULT 0.00 | Sum of all loans |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) | Owner user |
| status | INTEGER | DEFAULT 1, CHECK (status >= 1 AND status <= 6) | Record status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

**Indexes:**
- `idx_finance_user_id` on `user_id` (for user lookup)

**Business Rules:**
- One Finance record per user (1:1 relationship)
- Balance updated via transactions
- Total debt updated via loans

---

#### 7.2.3 Todos Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique task identifier |
| task | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | NULL | Task description (max 1000 chars) |
| is_roadmap | BOOLEAN | DEFAULT FALSE | Is this a roadmap task |
| priority | INTEGER | DEFAULT 5, CHECK (priority >= 0 AND priority <= 5) | Priority level (1=highest, 5=lowest) |
| due_days | INTEGER | DEFAULT 0 | Estimated days to complete |
| start_date | TIMESTAMP | NULL | Task start date |
| end_date | TIMESTAMP | NULL | Task end date/deadline |
| status | INTEGER | DEFAULT 1, CHECK (status >= 1 AND status <= 6) | Task status (1=Not Started...6=Completed) |
| parent_id | INTEGER | NULL, FOREIGN KEY → Todos(id) ON DELETE SET NULL | Parent task for subtasks |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) ON DELETE CASCADE | Task owner |
| roadmap_id | INTEGER | NULL, FOREIGN KEY → Roadmap(id) ON DELETE SET NULL | Associated roadmap |
| notes_id | INTEGER | NULL, FOREIGN KEY → Notes(id) ON DELETE SET NULL | Linked notes |
| project_id | INTEGER | NULL, FOREIGN KEY → Projects(id) ON DELETE SET NULL | Associated project |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_todos_user_id` on `user_id`
- `idx_todos_status` on `status`
- `idx_todos_roadmap_id` on `roadmap_id`
- `idx_todos_parent_id` on `parent_id`
- `idx_todos_project_id` on `project_id`

**Business Rules:**
- Self-referencing for parent-child relationships (unlimited nesting)
- Deleted tasks excluded from queries (status != 5)
- Status values: 1=Not Started, 2=In Progress, 3=On Hold, 4=Cancelled, 5=Deleted, 6=Completed

---

#### 7.2.4 Projects Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique project identifier |
| name | VARCHAR(255) | NOT NULL | Project name |
| description | TEXT | NULL | Project description |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | Hex color code |
| cover_image | VARCHAR(500) | NULL | Cover image URL |
| task_count | INTEGER | DEFAULT 0 | Number of tasks (calculated) |
| status | INTEGER | DEFAULT 1, CHECK (status >= 1 AND status <= 6) | Project status |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) ON DELETE CASCADE | Project owner |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_projects_user_id` on `user_id`

**Business Rules:**
- Task count calculated from associated tasks
- Color from predefined palette

---

#### 7.2.5 Transactions Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique transaction identifier |
| source | VARCHAR(150) | NOT NULL | Transaction source/description |
| amount | DECIMAL(15,2) | NOT NULL | Transaction amount (positive) |
| type | INTEGER | DEFAULT 1, CHECK (type >= 1 AND type <= 2) | 1=Income, 2=Expense |
| transaction_type | INTEGER | DEFAULT 1, CHECK (transaction_type >= 1 AND transaction_type <= 5) | 1=Income, 2=Expense, 3=Saving, 4=Debt, 5=Investment |
| category | VARCHAR(100) | NULL | Transaction category |
| date | TIMESTAMP | NOT NULL | Transaction date |
| notes_id | INTEGER | NULL, FOREIGN KEY → Notes(id) ON DELETE SET NULL | Linked notes |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) ON DELETE CASCADE | Transaction owner |
| status | INTEGER | DEFAULT 1, CHECK (status >= 1 AND status <= 6) | Record status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

**Indexes:**
- `idx_transactions_user_id` on `user_id`
- `idx_transactions_date` on `date DESC`
- `idx_transactions_type` on `transaction_type`

**Business Rules:**
- Amount must be positive
- Balance updated atomically with transaction creation

---

#### 7.2.6 Savings Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique savings identifier |
| name | VARCHAR(255) | NOT NULL | Savings instrument name |
| amount | DECIMAL(15,2) | NOT NULL | Principal amount |
| rate | DECIMAL(5,2) | NOT NULL | Annual interest rate (%) |
| type | INTEGER | DEFAULT 1, CHECK (type >= 1 AND type <= 6) | 1=FD/RD, 2=SIP, 3=PPF, 4=NPS, 5=MF, 6=Gold |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) ON DELETE CASCADE | Savings owner |
| status | INTEGER | DEFAULT 1, CHECK (status >= 1 AND status <= 6) | Record status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

**Indexes:**
- `idx_savings_user_id` on `user_id`

---

#### 7.2.7 Loans Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique loan identifier |
| name | VARCHAR(255) | NOT NULL | Loan name |
| total_amount | DECIMAL(15,2) | NOT NULL | Principal loan amount |
| rate | DECIMAL(5,2) | NOT NULL | Annual interest rate (%) |
| term | INTEGER | NOT NULL | Loan term in months |
| duration | INTEGER | NOT NULL | Payment frequency in months |
| premium_amount | DECIMAL(15,2) | NOT NULL | Monthly EMI (calculated) |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) ON DELETE CASCADE | Loan owner |
| status | INTEGER | DEFAULT 1, CHECK (status >= 1 AND status <= 6) | Record status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

**Indexes:**
- `idx_loans_user_id` on `user_id`

**Business Rules:**
- EMI calculated using formula: `P × r × (1+r)^n / ((1+r)^n - 1)`
- Total debt updated when loan created

---

#### 7.2.8 Roadmap Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique roadmap identifier |
| name | VARCHAR(255) | NOT NULL | Roadmap name |
| start_date | TIMESTAMP | NOT NULL | Roadmap start date |
| end_date | TIMESTAMP | NOT NULL | Roadmap end date |
| progress | DECIMAL(5,2) | DEFAULT 0.00 | Completion percentage (0-100) |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) ON DELETE CASCADE | Roadmap owner |
| status | INTEGER | DEFAULT 1, CHECK (status >= 1 AND status <= 6) | Record status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

**Indexes:**
- `idx_roadmap_user_id` on `user_id`

**Business Rules:**
- Progress calculated as: (completed tasks / total tasks) × 100
- End date must be after start date

---

#### 7.2.9 Resources Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique resource identifier |
| type | INTEGER | DEFAULT 1, CHECK (type >= 1 AND type <= 4) | 1=Link, 2=Audio, 3=Video, 4=Notes |
| misc_id | INTEGER | DEFAULT 0 | External system reference |
| link | VARCHAR(500) | NULL | Resource URL |
| todo_id | INTEGER | NOT NULL, FOREIGN KEY → Todos(id) ON DELETE CASCADE | Associated task |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

**Indexes:**
- `idx_resources_todo_id` on `todo_id`

---

#### 7.2.10 Notes Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique note identifier |
| text | TEXT | NOT NULL | Note content (max 5000 chars) |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

---

#### 7.2.11 Tags Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique tag identifier |
| name | VARCHAR(50) | NOT NULL | Tag name |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | Hex color code |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → Users(id) ON DELETE CASCADE | Tag owner |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Record last update time |

**Indexes:**
- `idx_tags_user_id` on `user_id`

---

#### 7.2.12 TodoTags Table (Join Table)

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique relationship identifier |
| todo_id | INTEGER | NOT NULL, FOREIGN KEY → Todos(id) ON DELETE CASCADE | Task reference |
| tag_id | INTEGER | NOT NULL, FOREIGN KEY → Tags(id) ON DELETE CASCADE | Tag reference |
| created_at | TIMESTAMP | NOT NULL | Record creation time |

**Indexes:**
- `idx_todotags_todo_id` on `todo_id`
- `idx_todotags_tag_id` on `tag_id`
- `UNIQUE (todo_id, tag_id)` to prevent duplicate assignments

---

### 7.3 Data Volume Estimates

**Initial Launch (First Year):**

| Entity | Expected Volume |
|--------|-----------------|
| Users | 10,000 - 100,000 |
| Tasks | 500,000 - 1,000,000 (avg 50-100 per user) |
| Projects | 50,000 - 200,000 (avg 5-20 per user) |
| Transactions | 200,000 - 500,000 (avg 20-50 per user) |
| Savings | 20,000 - 100,000 (avg 2-10 per user) |
| Loans | 10,000 - 50,000 (avg 1-5 per user) |
| Roadmaps | 20,000 - 100,000 (avg 2-10 per user) |

**Growth Projections (Year 3):**
- Users: 500,000+
- Tasks: 25 million+
- Transactions: 10 million+

**Database Size Estimate:**
- Year 1: ~5-10 GB
- Year 3: ~50-100 GB

---

### 7.4 Data Security and Privacy

**Sensitive Data Fields:**
- `Users.password` - bcrypt hashed, never plaintext
- `Users.otp` - cleared after verification
- `Users.email` - personally identifiable information (PII)

**Data Encryption:**
- **In Transit:** TLS 1.2+ for all API communications
- **At Rest:** Database-level encryption (optional, via cloud provider)

**Access Control:**
- Users can only access their own data (enforced by user_id filters)
- No cross-user data visibility
- Admin access requires separate authentication (future)

**Backup and Recovery:**
- Daily automated backups (managed by cloud provider)
- 30-day backup retention
- Point-in-time recovery capability

**Data Deletion:**
- Soft delete for user-facing entities (status = 5)
- Hard delete after 30-day grace period (GDPR compliance)
- Financial records retained for 7 years (legal requirement)

---

---

## 8. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **bcrypt** | Password hashing algorithm with built-in salt and configurable cost factor |
| **EMI** | Equated Monthly Installment - fixed monthly loan payment |
| **Gin** | Lightweight HTTP web framework for Go |
| **GORM** | Object-Relational Mapping library for Go |
| **JWT** | JSON Web Token - stateless authentication mechanism |
| **Kanban** | Visual project management method with columns representing workflow stages |
| **ORM** | Object-Relational Mapping - technique to query/manipulate databases using object-oriented paradigm |
| **OTP** | One-Time Password - temporary code for authentication |
| **Roadmap** | Structured learning path or project plan with timeline |
| **Soft Delete** | Marking records as deleted without physical removal from database |
| **Subtask** | Child task in a parent-child hierarchy |
| **Zustand** | State management library for React applications |

---

### Appendix B: Acronyms and Abbreviations

| Acronym | Full Form |
|---------|-----------|
| **API** | Application Programming Interface |
| **CORS** | Cross-Origin Resource Sharing |
| **CRUD** | Create, Read, Update, Delete |
| **CSS** | Cascading Style Sheets |
| **DB** | Database |
| **E2E** | End-to-End |
| **EMI** | Equated Monthly Installment |
| **GDPR** | General Data Protection Regulation |
| **HTTPS** | Hypertext Transfer Protocol Secure |
| **JSON** | JavaScript Object Notation |
| **JWT** | JSON Web Token |
| **MVP** | Minimum Viable Product |
| **ORM** | Object-Relational Mapping |
| **OTP** | One-Time Password |
| **REST** | Representational State Transfer |
| **SMTP** | Simple Mail Transfer Protocol |
| **SQL** | Structured Query Language |
| **SRS** | Software Requirements Specification |
| **SSL/TLS** | Secure Sockets Layer / Transport Layer Security |
| **UI/UX** | User Interface / User Experience |
| **WCAG** | Web Content Accessibility Guidelines |

---

### Appendix C: Requirements Traceability Matrix

| Requirement ID | Requirement Name | Priority | Implementation Status | Test Case ID |
|----------------|------------------|----------|----------------------|--------------|
| FR-UM-001 | User Registration | Must Have | ✅ Implemented | TC-UM-001 |
| FR-UM-002 | Email Verification | Must Have | ✅ Implemented | TC-UM-002 |
| FR-UM-003 | User Login | Must Have | ✅ Implemented | TC-UM-003 |
| FR-UM-004 | Password Reset | Must Have | ✅ Implemented | TC-UM-004 |
| FR-UM-005 | Change Password | Should Have | ✅ Implemented | TC-UM-005 |
| FR-TM-001 | Create Task | Must Have | ✅ Implemented | TC-TM-001 |
| FR-TM-002 | View Tasks | Must Have | ✅ Implemented | TC-TM-002 |
| FR-TM-003 | Update Task | Must Have | ✅ Implemented | TC-TM-003 |
| FR-TM-004 | Delete Task | Must Have | ✅ Implemented | TC-TM-004 |
| FR-TM-005 | Hierarchical Tasks | Must Have | ✅ Implemented | TC-TM-005 |
| FR-PM-001 | Create Project | Must Have | ✅ Implemented | TC-PM-001 |
| FR-PM-002 | Assign Tasks | Must Have | ✅ Implemented | TC-PM-002 |
| FR-PM-003 | Project Dashboard | Must Have | ⚠️ Partial | TC-PM-003 |
| FR-PM-004 | Kanban Board | Should Have | ⚠️ Partial | TC-PM-004 |
| FR-PM-005 | Calendar View | Should Have | ❌ Not Started | TC-PM-005 |
| FR-FM-001 | Record Transaction | Must Have | ✅ Implemented | TC-FM-001 |
| FR-FM-002 | View Balance | Must Have | ✅ Implemented | TC-FM-002 |
| FR-FM-003 | Create Savings | Must Have | ✅ Implemented | TC-FM-003 |
| FR-FM-004 | Create Loan | Must Have | ✅ Implemented | TC-FM-004 |
| FR-FM-005 | Categorization | Should Have | ✅ Implemented | TC-FM-005 |
| FR-RM-001 | Create Roadmap | Should Have | ✅ Implemented | TC-RM-001 |
| FR-RM-002 | Link Tasks | Should Have | ✅ Implemented | TC-RM-002 |
| FR-RM-003 | View Progress | Should Have | ✅ Implemented | TC-RM-003 |
| FR-DA-001 | Unified Dashboard | Must Have | ✅ Implemented | TC-DA-001 |
| FR-DA-002 | Financial Charts | Should Have | ❌ Not Started | TC-DA-002 |
| FR-DA-003 | Activity Feed | Should Have | ❌ Not Started | TC-DA-003 |
| NFR-PF-001 | API Response Time | Must Have | ⚠️ Testing Needed | TC-PF-001 |
| NFR-PF-002 | Page Load Time | Must Have | ⚠️ Testing Needed | TC-PF-002 |
| NFR-SC-001 | Password Security | Must Have | ✅ Implemented | TC-SC-001 |
| NFR-SC-002 | JWT Authentication | Must Have | ✅ Implemented | TC-SC-002 |
| NFR-SC-003 | Rate Limiting | Must Have | ✅ Implemented | TC-SC-003 |
| NFR-US-001 | Responsive Design | Must Have | ⚠️ Testing Needed | TC-US-001 |
| NFR-US-002 | Accessibility | Should Have | ⚠️ Partial | TC-US-002 |

**Legend:**
- ✅ Implemented: Feature complete and functional
- ⚠️ Partial: Partially implemented or needs testing
- ❌ Not Started: Not yet implemented

---

### Appendix D: Change Request Log

| CR ID | Date | Requested By | Description | Status | Impact |
|-------|------|--------------|-------------|--------|--------|
| CR-001 | 2025-11-13 | Product Team | Initial SRS creation | Approved | - |

**Change Request Process:**
1. Stakeholder submits change request with rationale
2. Product owner reviews impact on timeline, cost, scope
3. Approval/rejection decision
4. If approved, SRS updated and version incremented
5. Development team notified of changes

---

### Appendix E: Assumptions and Dependencies

**Assumptions:**
1. Users have reliable internet access (no offline mode required)
2. Users are comfortable with manual transaction entry (vs. bank sync)
3. PostgreSQL can scale to 100,000+ users with proper optimization
4. Email delivery service (SendGrid) maintains 99%+ deliverability
5. Users prefer privacy over convenience (willing to manually enter data)

**Dependencies:**
1. **External Services:**
   - Email delivery service (SendGrid/AWS SES) for OTP and notifications
   - Cloud hosting provider (AWS/GCP/Railway/Vercel) availability
   - HTTPS certificate provider (Let's Encrypt or cloud provider)
   - Domain name registration

2. **Third-Party Libraries:**
   - Gin framework (Go) for HTTP routing
   - GORM for database ORM
   - Next.js for frontend framework
   - React for UI components
   - Zustand for state management
   - bcrypt library for password hashing
   - JWT library for token generation

3. **Infrastructure:**
   - PostgreSQL database server (14+)
   - Go runtime (1.23+)
   - Node.js runtime (18+) for Next.js

---

### Appendix F: Open Issues and Risks

**Open Issues:**
1. **Frontend UI Completion:** Finance UI components not started (high priority)
2. **Testing Coverage:** Integration and E2E tests need expansion
3. **Performance Testing:** Load testing not yet conducted
4. **Accessibility Audit:** WCAG compliance not fully validated

**Risks:**
1. **Timeline Risk:** 6-month MVP timeline unrealistic (recommend 8 months)
2. **Frontend Velocity:** Frontend development slower than backend (need acceleration)
3. **User Adoption:** Risk of low adoption if finance features incomplete
4. **Performance:** Database query performance not validated at scale

**Mitigation Strategies:**
1. Extend timeline to 8 months for realistic delivery
2. Reallocate backend developer to frontend work (backend ahead of schedule)
3. Prioritize finance UI completion over nice-to-have features
4. Conduct performance testing with realistic data volumes

---

**End of Software Requirements Specification**

**Next Review Date:** December 13, 2025
**Document Owner:** Product Manager
**Distribution:** Development Team, QA Team, Stakeholders
