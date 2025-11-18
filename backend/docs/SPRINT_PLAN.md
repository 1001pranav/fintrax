# Backend Design Pattern Integration - Sprint Plan

## Overview

This sprint plan outlines a **10-week implementation roadmap** to transform the Fintrax backend from a basic MVC architecture to a production-ready, enterprise-grade system using industry-standard design patterns.

### Goals
- ✅ Eliminate 162 direct database calls via Repository Pattern
- ✅ Separate business logic via Service Layer Pattern
- ✅ Enable testability via Dependency Injection
- ✅ Reduce code duplication from 30% to <5%
- ✅ Achieve 80%+ test coverage
- ✅ Implement 11 design patterns

### Timeline
- **Duration:** 10 sprints × 1 week = 10 weeks
- **Team Size:** 1-2 developers
- **Effort:** ~40-80 hours per sprint

---

## Sprint Overview Table

| Sprint | Phase | Focus | Files | LOC | Key Pattern | Risk |
|--------|-------|-------|-------|-----|-------------|------|
| 1 | Foundation | Repository Foundation | 5-7 | 800-1000 | Repository | Low |
| 2 | Foundation | Repository Expansion | 8-10 | 1200-1500 | Repository | Low |
| 3 | Service Layer | User & Auth Services | 2-3 | 500-700 | Service Layer | Medium |
| 4 | Service Layer | Core Domain Services | 4-5 | 600-800 | Service Layer | Medium |
| 5 | Service Layer | Finance Services | 4-6 | 700-900 | Service Layer | Medium |
| 6 | DI | Dependency Injection | 1-2 | 400-600 | DI Container | High |
| 7 | Transactions | Unit of Work | 2-3 | 300-500 | Unit of Work | Medium |
| 8 | Behavioral | Strategies & Factories | 5-7 | 600-800 | Strategy/Factory | Low |
| 9 | Events | Observer Pattern | 6-8 | 700-900 | Observer | Medium |
| 10 | Structural | Builders & Adapters | 6-8 | 600-800 | Builder/Adapter | Low |

---

# Sprint 1: Repository Pattern Foundation

## Goals
- Create generic repository interface
- Implement GORM base repository
- Create repositories for User and Todo entities
- Write comprehensive unit tests
- **Zero breaking changes** to existing API

## Duration: Week 1 (40 hours)

## Tasks

### Task 1.1: Design Base Repository Interface (4 hours)
**File:** `internal/repositories/base_repository.go`

**Acceptance Criteria:**
- [ ] Generic repository interface using Go generics
- [ ] Support for CRUD operations (Create, Read, Update, Delete)
- [ ] Soft delete support built-in
- [ ] Context support for timeouts and cancellation
- [ ] Filter support for complex queries

**Code Structure:**
```go
package repositories

import (
    "context"
    "fintrax-backend/models"
)

// BaseRepository provides common CRUD operations for all entities
type BaseRepository[T any] interface {
    // Create inserts a new entity
    Create(ctx context.Context, entity *T) error

    // FindByID retrieves an entity by its ID
    FindByID(ctx context.Context, id uint) (*T, error)

    // FindAll retrieves all entities matching the filters
    // filters: map[string]interface{}{"user_id": 123, "status": "active"}
    FindAll(ctx context.Context, filters map[string]interface{}) ([]*T, error)

    // Update updates an existing entity
    Update(ctx context.Context, entity *T) error

    // SoftDelete marks an entity as deleted
    SoftDelete(ctx context.Context, id uint) error

    // HardDelete permanently deletes an entity
    HardDelete(ctx context.Context, id uint) error

    // Count returns the number of entities matching filters
    Count(ctx context.Context, filters map[string]interface{}) (int64, error)

    // Exists checks if an entity exists
    Exists(ctx context.Context, id uint) (bool, error)
}
```

---

### Task 1.2: Implement GORM Base Repository (6 hours)
**File:** `internal/repositories/gorm_base_repository.go`

**Acceptance Criteria:**
- [ ] Generic implementation of BaseRepository using GORM
- [ ] Automatic soft delete handling (status != STATUS_DELETED)
- [ ] Error handling and custom error types
- [ ] Reflection to handle generic types
- [ ] Query optimization (select specific fields)

**Code Structure:**
```go
package repositories

import (
    "context"
    "fintrax-backend/constants"
    "gorm.io/gorm"
)

type gormBaseRepository[T any] struct {
    db *gorm.DB
}

func NewGormBaseRepository[T any](db *gorm.DB) BaseRepository[T] {
    return &gormBaseRepository[T]{db: db}
}

func (r *gormBaseRepository[T]) Create(ctx context.Context, entity *T) error {
    return r.db.WithContext(ctx).Create(entity).Error
}

func (r *gormBaseRepository[T]) FindByID(ctx context.Context, id uint) (*T, error) {
    var entity T
    err := r.db.WithContext(ctx).
        Where("id = ? AND status != ?", id, constants.STATUS_DELETED).
        First(&entity).Error

    if err == gorm.ErrRecordNotFound {
        return nil, ErrNotFound
    }
    return &entity, err
}

func (r *gormBaseRepository[T]) FindAll(ctx context.Context, filters map[string]interface{}) ([]*T, error) {
    var entities []*T
    query := r.db.WithContext(ctx)

    // Apply filters
    for key, value := range filters {
        query = query.Where(key+" = ?", value)
    }

    // Exclude soft-deleted records
    query = query.Where("status != ?", constants.STATUS_DELETED)

    err := query.Find(&entities).Error
    return entities, err
}

func (r *gormBaseRepository[T]) SoftDelete(ctx context.Context, id uint) error {
    return r.db.WithContext(ctx).
        Model(new(T)).
        Where("id = ?", id).
        Updates(map[string]interface{}{
            "status":     constants.STATUS_DELETED,
            "deleted_at": gorm.DeletedAt{Time: time.Now(), Valid: true},
        }).Error
}

// ... implement other methods
```

**Testing:**
```go
// internal/repositories/gorm_base_repository_test.go
func TestGormBaseRepository_Create(t *testing.T) {
    db := setupTestDB(t)
    repo := NewGormBaseRepository[models.User](db)

    user := &models.User{Email: "test@example.com"}
    err := repo.Create(context.Background(), user)

    assert.NoError(t, err)
    assert.NotZero(t, user.ID)
}
```

---

### Task 1.3: Create User Repository (6 hours)
**File:** `internal/repositories/user_repository.go`

**Acceptance Criteria:**
- [ ] Embeds BaseRepository for common operations
- [ ] Domain-specific methods (FindByEmail, UpdateOTP, etc.)
- [ ] Unit tests with mocked database

**Code Structure:**
```go
package repositories

import (
    "context"
    "fintrax-backend/models"
)

// UserRepository extends BaseRepository with user-specific operations
type UserRepository interface {
    BaseRepository[models.User]

    // FindByEmail finds a user by email address
    FindByEmail(ctx context.Context, email string) (*models.User, error)

    // FindActiveUsers returns all non-deleted users
    FindActiveUsers(ctx context.Context) ([]*models.User, error)

    // UpdateOTP updates the OTP for a user
    UpdateOTP(ctx context.Context, userID uint, otp uint) error

    // VerifyEmail marks user as verified
    VerifyEmail(ctx context.Context, userID uint) error

    // UpdatePassword updates user password
    UpdatePassword(ctx context.Context, userID uint, hashedPassword string) error
}

type gormUserRepository struct {
    BaseRepository[models.User]
    db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
    return &gormUserRepository{
        BaseRepository: NewGormBaseRepository[models.User](db),
        db:             db,
    }
}

func (r *gormUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
    var user models.User
    err := r.db.WithContext(ctx).
        Where("email = ? AND status != ?", email, constants.STATUS_DELETED).
        First(&user).Error

    if err == gorm.ErrRecordNotFound {
        return nil, ErrUserNotFound
    }
    return &user, err
}

func (r *gormUserRepository) FindActiveUsers(ctx context.Context) ([]*models.User, error) {
    var users []*models.User
    err := r.db.WithContext(ctx).
        Where("status = ?", constants.STATUS_ACTIVE).
        Find(&users).Error
    return users, err
}

func (r *gormUserRepository) UpdateOTP(ctx context.Context, userID uint, otp uint) error {
    return r.db.WithContext(ctx).
        Model(&models.User{}).
        Where("id = ?", userID).
        Update("otp", otp).Error
}
```

---

### Task 1.4: Create Todo Repository (6 hours)
**File:** `internal/repositories/todo_repository.go`

**Acceptance Criteria:**
- [ ] Todo-specific methods (FindByUser, FindByProject, etc.)
- [ ] Support for filtering by status, priority, project
- [ ] Methods for counting todos by various criteria

**Code Structure:**
```go
package repositories

import (
    "context"
    "fintrax-backend/models"
)

type TodoRepository interface {
    BaseRepository[models.Todo]

    // FindByUserID returns all todos for a user
    FindByUserID(ctx context.Context, userID uint) ([]*models.Todo, error)

    // FindByProjectID returns all todos for a project
    FindByProjectID(ctx context.Context, projectID uint) ([]*models.Todo, error)

    // FindByStatus returns todos with specific status
    FindByStatus(ctx context.Context, userID uint, status string) ([]*models.Todo, error)

    // CountByProject counts todos in a project
    CountByProject(ctx context.Context, projectID uint) (int64, error)

    // CountByStatus counts todos by status
    CountByStatus(ctx context.Context, userID uint, status string) (int64, error)

    // FindSubtasks returns subtasks of a parent todo
    FindSubtasks(ctx context.Context, parentID uint) ([]*models.Todo, error)
}

type gormTodoRepository struct {
    BaseRepository[models.Todo]
    db *gorm.DB
}

func NewTodoRepository(db *gorm.DB) TodoRepository {
    return &gormTodoRepository{
        BaseRepository: NewGormBaseRepository[models.Todo](db),
        db:             db,
    }
}

func (r *gormTodoRepository) FindByUserID(ctx context.Context, userID uint) ([]*models.Todo, error) {
    var todos []*models.Todo
    err := r.db.WithContext(ctx).
        Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
        Order("created_at DESC").
        Find(&todos).Error
    return todos, err
}

func (r *gormTodoRepository) CountByProject(ctx context.Context, projectID uint) (int64, error) {
    var count int64
    err := r.db.WithContext(ctx).
        Model(&models.Todo{}).
        Where("project_id = ? AND status != ?", projectID, constants.STATUS_DELETED).
        Count(&count).Error
    return count, err
}
```

---

### Task 1.5: Write Unit Tests (12 hours)

**Files:**
- `internal/repositories/gorm_base_repository_test.go`
- `internal/repositories/user_repository_test.go`
- `internal/repositories/todo_repository_test.go`

**Acceptance Criteria:**
- [ ] Test coverage > 80%
- [ ] Use in-memory SQLite for tests
- [ ] Test all CRUD operations
- [ ] Test error cases (not found, duplicate, etc.)
- [ ] Test soft delete behavior
- [ ] Test context cancellation

**Example Test:**
```go
package repositories_test

import (
    "context"
    "testing"
    "fintrax-backend/internal/repositories"
    "fintrax-backend/models"
    "github.com/stretchr/testify/assert"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    assert.NoError(t, err)

    // Auto migrate models
    db.AutoMigrate(&models.User{}, &models.Todo{})

    return db
}

func TestUserRepository_Create(t *testing.T) {
    db := setupTestDB(t)
    repo := repositories.NewUserRepository(db)

    user := &models.User{
        Email:    "test@example.com",
        Password: "hashedpassword",
        Name:     "Test User",
    }

    err := repo.Create(context.Background(), user)

    assert.NoError(t, err)
    assert.NotZero(t, user.ID)
}

func TestUserRepository_FindByEmail(t *testing.T) {
    db := setupTestDB(t)
    repo := repositories.NewUserRepository(db)

    // Create user
    user := &models.User{Email: "test@example.com"}
    repo.Create(context.Background(), user)

    // Find by email
    found, err := repo.FindByEmail(context.Background(), "test@example.com")

    assert.NoError(t, err)
    assert.Equal(t, user.Email, found.Email)
}

func TestUserRepository_FindByEmail_NotFound(t *testing.T) {
    db := setupTestDB(t)
    repo := repositories.NewUserRepository(db)

    found, err := repo.FindByEmail(context.Background(), "nonexistent@example.com")

    assert.Error(t, err)
    assert.Nil(t, found)
    assert.Equal(t, repositories.ErrUserNotFound, err)
}

func TestUserRepository_SoftDelete(t *testing.T) {
    db := setupTestDB(t)
    repo := repositories.NewUserRepository(db)

    user := &models.User{Email: "test@example.com"}
    repo.Create(context.Background(), user)

    // Soft delete
    err := repo.SoftDelete(context.Background(), user.ID)
    assert.NoError(t, err)

    // Should not be found
    found, err := repo.FindByID(context.Background(), user.ID)
    assert.Error(t, err)
    assert.Nil(t, found)
}
```

---

### Task 1.6: Documentation (2 hours)

**File:** `internal/repositories/README.md`

**Content:**
- Repository pattern explanation
- Usage examples
- Best practices
- Common pitfalls

---

### Task 1.7: Code Review & Integration (4 hours)
- [ ] Self-review all code
- [ ] Run tests: `go test ./internal/repositories/... -v`
- [ ] Check test coverage: `go test ./internal/repositories/... -cover`
- [ ] Ensure no breaking changes
- [ ] Commit with conventional commit message

---

## Deliverables

### Code Files
1. `internal/repositories/base_repository.go` (~150 LOC)
2. `internal/repositories/gorm_base_repository.go` (~300 LOC)
3. `internal/repositories/user_repository.go` (~200 LOC)
4. `internal/repositories/todo_repository.go` (~200 LOC)
5. `internal/repositories/errors.go` (~50 LOC)

### Test Files
1. `internal/repositories/gorm_base_repository_test.go` (~200 LOC)
2. `internal/repositories/user_repository_test.go` (~300 LOC)
3. `internal/repositories/todo_repository_test.go` (~300 LOC)

### Documentation
1. `internal/repositories/README.md`

**Total:** 5-7 files, ~800-1000 LOC

---

## Success Criteria
- ✅ All tests pass (`go test ./internal/repositories/...`)
- ✅ Test coverage > 80%
- ✅ No breaking changes to existing API
- ✅ Zero direct database calls in repositories (all via GORM)
- ✅ Code reviewed and documented

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Generic repository too complex | Medium | Low | Keep it simple, add features incrementally |
| Performance overhead | Medium | Low | Benchmark critical paths |
| Test database setup issues | Low | Medium | Use in-memory SQLite for tests |

---

# Sprint 2: Repository Pattern Expansion

## Goals
- Create repositories for all remaining entities (12 models)
- Ensure consistency across all repositories
- Complete test coverage for all repositories
- **Zero breaking changes** to existing API

## Duration: Week 2 (40 hours)

## Tasks

### Task 2.1: Create Project Repository (4 hours)
**File:** `internal/repositories/project_repository.go`

**Acceptance Criteria:**
- [ ] Project-specific methods (FindByUser, GetStats, etc.)
- [ ] Methods for counting tasks by project
- [ ] Unit tests (80%+ coverage)

**Code Structure:**
```go
type ProjectRepository interface {
    BaseRepository[models.Project]

    FindByUserID(ctx context.Context, userID uint) ([]*models.Project, error)
    GetProjectStats(ctx context.Context, projectID uint) (*ProjectStats, error)
    CountTasksByProject(ctx context.Context, projectID uint) (int64, error)
}

type ProjectStats struct {
    TotalTasks     int64
    CompletedTasks int64
    PendingTasks   int64
    OverdueTasks   int64
}
```

---

### Task 2.2: Create Finance Repository (4 hours)
**File:** `internal/repositories/finance_repository.go`

**Acceptance Criteria:**
- [ ] Methods for finding finance record by user
- [ ] Methods for updating balance fields
- [ ] Aggregation methods (total income, expenses)

**Code Structure:**
```go
type FinanceRepository interface {
    BaseRepository[models.Finance]

    FindByUserID(ctx context.Context, userID uint) (*models.Finance, error)
    UpdateBalance(ctx context.Context, userID uint, amount float64) error
    GetFinanceSummary(ctx context.Context, userID uint) (*FinanceSummary, error)
}

type FinanceSummary struct {
    TotalBalance  float64
    TotalIncome   float64
    TotalExpense  float64
    TotalSavings  float64
    TotalLoans    float64
}
```

---

### Task 2.3: Create Transaction Repository (4 hours)
**File:** `internal/repositories/transaction_repository.go`

**Acceptance Criteria:**
- [ ] Methods for filtering by type (income/expense)
- [ ] Methods for filtering by category
- [ ] Date range filtering
- [ ] Aggregation methods (sum by type, category)

**Code Structure:**
```go
type TransactionRepository interface {
    BaseRepository[models.Transaction]

    FindByUserID(ctx context.Context, userID uint) ([]*models.Transaction, error)
    FindByType(ctx context.Context, userID uint, txnType string) ([]*models.Transaction, error)
    FindByCategory(ctx context.Context, userID uint, category string) ([]*models.Transaction, error)
    FindByDateRange(ctx context.Context, userID uint, startDate, endDate time.Time) ([]*models.Transaction, error)
    SumByType(ctx context.Context, userID uint, txnType string) (float64, error)
    GetTransactionSummary(ctx context.Context, userID uint) (*TransactionSummary, error)
}
```

---

### Task 2.4: Create Savings Repository (3 hours)
**File:** `internal/repositories/savings_repository.go`

**Code Structure:**
```go
type SavingsRepository interface {
    BaseRepository[models.Savings]

    FindByUserID(ctx context.Context, userID uint) ([]*models.Savings, error)
    FindActiveGoals(ctx context.Context, userID uint) ([]*models.Savings, error)
    GetTotalSavings(ctx context.Context, userID uint) (float64, error)
}
```

---

### Task 2.5: Create Loans Repository (3 hours)
**File:** `internal/repositories/loans_repository.go`

**Code Structure:**
```go
type LoansRepository interface {
    BaseRepository[models.Loans]

    FindByUserID(ctx context.Context, userID uint) ([]*models.Loans, error)
    FindActiveLoans(ctx context.Context, userID uint) ([]*models.Loans, error)
    GetTotalLoans(ctx context.Context, userID uint) (float64, error)
    GetLoansSummary(ctx context.Context, userID uint) (*LoansSummary, error)
}
```

---

### Task 2.6: Create Roadmap Repository (3 hours)
**File:** `internal/repositories/roadmap_repository.go`

---

### Task 2.7: Create Resource Repository (3 hours)
**File:** `internal/repositories/resource_repository.go`

---

### Task 2.8: Create Tag Repository (2 hours)
**File:** `internal/repositories/tag_repository.go`

---

### Task 2.9: Create Note Repository (2 hours)
**File:** `internal/repositories/note_repository.go`

---

### Task 2.10: Write Unit Tests for All New Repositories (10 hours)

**Coverage:**
- [ ] Test all CRUD operations
- [ ] Test domain-specific methods
- [ ] Test error cases
- [ ] Test edge cases (empty results, duplicates)
- [ ] Achieve 80%+ coverage for each repository

---

### Task 2.11: Documentation & Code Review (2 hours)
- [ ] Update README with all new repositories
- [ ] Add usage examples
- [ ] Code review
- [ ] Integration testing

---

## Deliverables

### Code Files (8-10 files)
1. `project_repository.go` (~150 LOC)
2. `finance_repository.go` (~150 LOC)
3. `transaction_repository.go` (~200 LOC)
4. `savings_repository.go` (~150 LOC)
5. `loans_repository.go` (~150 LOC)
6. `roadmap_repository.go` (~150 LOC)
7. `resource_repository.go` (~150 LOC)
8. `tag_repository.go` (~100 LOC)
9. `note_repository.go` (~100 LOC)

### Test Files (8-10 files, ~800 LOC)

**Total:** 8-10 files, ~1200-1500 LOC

---

## Success Criteria
- ✅ All 14 models have repository interfaces
- ✅ All tests pass with 80%+ coverage
- ✅ Consistent API across all repositories
- ✅ Zero breaking changes
- ✅ Documentation complete

---

# Sprint 3: Service Layer - User & Auth

## Goals
- Create UserService with all authentication logic
- Move business logic from UserController to UserService
- Enable unit testing of auth logic without HTTP layer
- Reduce UserController from 340 LOC to ~100 LOC

## Duration: Week 3 (40 hours)

## Tasks

### Task 3.1: Design UserService Interface (3 hours)
**File:** `internal/services/user_service.go`

**Acceptance Criteria:**
- [ ] Interface defines all user operations
- [ ] Clear method signatures with context support
- [ ] Custom error types for domain errors

**Code Structure:**
```go
package services

import (
    "context"
    "fintrax-backend/internal/repositories"
    "fintrax-backend/models"
)

// UserService handles user-related business logic
type UserService interface {
    // Register creates a new user account
    Register(ctx context.Context, req RegisterRequest) (*UserResponse, error)

    // Login authenticates a user and returns JWT token
    Login(ctx context.Context, email, password string) (*LoginResponse, error)

    // GenerateOTP generates and emails OTP for verification
    GenerateOTP(ctx context.Context, email string) error

    // VerifyEmail verifies user email with OTP
    VerifyEmail(ctx context.Context, email string, otp uint) error

    // ForgotPassword initiates password reset process
    ForgotPassword(ctx context.Context, email string) error

    // ResetPassword resets user password with OTP
    ResetPassword(ctx context.Context, email string, otp uint, newPassword string) error

    // GetProfile returns user profile
    GetProfile(ctx context.Context, userID uint) (*UserResponse, error)
}

// DTOs
type RegisterRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=8"`
    Name     string `json:"name" binding:"required"`
}

type LoginResponse struct {
    User  *UserResponse `json:"user"`
    Token string        `json:"token"`
}

type UserResponse struct {
    ID    uint   `json:"id"`
    Email string `json:"email"`
    Name  string `json:"name"`
}
```

---

### Task 3.2: Implement UserService (10 hours)
**File:** `internal/services/user_service_impl.go`

**Acceptance Criteria:**
- [ ] All business logic from UserController moved here
- [ ] Dependency injection (repositories, helpers)
- [ ] Proper error handling with domain errors
- [ ] Password hashing, OTP generation
- [ ] Email sending (later will use events)

**Code Structure:**
```go
package services

import (
    "context"
    "errors"
    "math/rand"
    "time"
    "fintrax-backend/constants"
    "fintrax-backend/helper"
    "fintrax-backend/internal/repositories"
    "fintrax-backend/models"
)

type userService struct {
    userRepo     repositories.UserRepository
    financeRepo  repositories.FinanceRepository
    jwtSecret    string
}

func NewUserService(
    userRepo repositories.UserRepository,
    financeRepo repositories.FinanceRepository,
    jwtSecret string,
) UserService {
    return &userService{
        userRepo:    userRepo,
        financeRepo: financeRepo,
        jwtSecret:   jwtSecret,
    }
}

func (s *userService) Register(ctx context.Context, req RegisterRequest) (*UserResponse, error) {
    // 1. Validate request
    if err := s.validateRegisterRequest(req); err != nil {
        return nil, err
    }

    // 2. Check if user already exists
    existing, _ := s.userRepo.FindByEmail(ctx, req.Email)
    if existing != nil {
        return nil, ErrEmailAlreadyExists
    }

    // 3. Hash password
    hashedPassword := helper.HashPassword(req.Password)

    // 4. Generate OTP
    otp := s.generateOTP()

    // 5. Create user
    user := &models.User{
        Email:    req.Email,
        Password: hashedPassword,
        Name:     req.Name,
        OTP:      otp,
        Status:   constants.STATUS_PENDING_VERIFICATION,
    }

    if err := s.userRepo.Create(ctx, user); err != nil {
        return nil, err
    }

    // 6. Create finance record
    finance := &models.Finance{
        UserID:       user.ID,
        TotalBalance: 0,
        TotalIncome:  0,
        TotalExpense: 0,
    }

    if err := s.financeRepo.Create(ctx, finance); err != nil {
        // Rollback user creation (for now, will use UoW later)
        s.userRepo.SoftDelete(ctx, user.ID)
        return nil, err
    }

    // 7. Send OTP email
    if err := s.sendOTPEmail(user.Email, otp); err != nil {
        // Log error but don't fail registration
        // TODO: Use event system in Sprint 9
    }

    return s.toUserResponse(user), nil
}

func (s *userService) Login(ctx context.Context, email, password string) (*LoginResponse, error) {
    // 1. Find user
    user, err := s.userRepo.FindByEmail(ctx, email)
    if err != nil {
        return nil, ErrInvalidCredentials
    }

    // 2. Verify password
    if !helper.VerifyPassword(password, user.Password) {
        return nil, ErrInvalidCredentials
    }

    // 3. Check if email is verified
    if user.Status == constants.STATUS_PENDING_VERIFICATION {
        return nil, ErrEmailNotVerified
    }

    // 4. Generate JWT token
    token, err := helper.GenerateJWT(user.ID, s.jwtSecret)
    if err != nil {
        return nil, err
    }

    return &LoginResponse{
        User:  s.toUserResponse(user),
        Token: token,
    }, nil
}

func (s *userService) VerifyEmail(ctx context.Context, email string, otp uint) error {
    user, err := s.userRepo.FindByEmail(ctx, email)
    if err != nil {
        return ErrUserNotFound
    }

    if user.OTP != otp {
        return ErrInvalidOTP
    }

    // Update user status
    user.Status = constants.STATUS_ACTIVE
    user.OTP = 0

    return s.userRepo.Update(ctx, user)
}

func (s *userService) generateOTP() uint {
    rand.Seed(time.Now().UnixNano())
    return uint(rand.Intn(900000) + 100000) // 6-digit OTP
}

func (s *userService) sendOTPEmail(email string, otp uint) error {
    subject := "Email Verification - Fintrax"
    body := fmt.Sprintf("Your OTP for email verification is: %d", otp)
    return helper.SendMail(email, subject, body)
}

func (s *userService) toUserResponse(user *models.User) *UserResponse {
    return &UserResponse{
        ID:    user.ID,
        Email: user.Email,
        Name:  user.Name,
    }
}

// Custom errors
var (
    ErrEmailAlreadyExists = errors.New("email already exists")
    ErrInvalidCredentials = errors.New("invalid email or password")
    ErrEmailNotVerified   = errors.New("email not verified")
    ErrUserNotFound       = errors.New("user not found")
    ErrInvalidOTP         = errors.New("invalid OTP")
)
```

---

### Task 3.3: Refactor UserController to Use Service (6 hours)
**File:** `controllers/userController.go`

**Acceptance Criteria:**
- [ ] Controller becomes thin (only HTTP handling)
- [ ] All business logic removed
- [ ] Uses injected UserService
- [ ] Maintains same API contracts
- [ ] Reduced from 340 LOC to ~100 LOC

**Code Structure:**
```go
package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "fintrax-backend/internal/services"
    "fintrax-backend/helper"
)

type UserController struct {
    userService services.UserService
}

func NewUserController(userService services.UserService) *UserController {
    return &UserController{
        userService: userService,
    }
}

func (uc *UserController) Register(c *gin.Context) {
    var req services.RegisterRequest

    // 1. Bind request
    if err := c.ShouldBindJSON(&req); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, []string{err.Error()})
        return
    }

    // 2. Call service
    user, err := uc.userService.Register(c.Request.Context(), req)
    if err != nil {
        // Map service errors to HTTP status codes
        statusCode := http.StatusInternalServerError
        if err == services.ErrEmailAlreadyExists {
            statusCode = http.StatusConflict
        }
        helper.Response(c, statusCode, err.Error(), nil, nil)
        return
    }

    // 3. Return response
    helper.Response(c, http.StatusCreated, "User registered successfully", user, nil)
}

func (uc *UserController) Login(c *gin.Context) {
    var req struct {
        Email    string `json:"email" binding:"required"`
        Password string `json:"password" binding:"required"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        helper.Response(c, http.StatusBadRequest, "Invalid request", nil, []string{err.Error()})
        return
    }

    loginResp, err := uc.userService.Login(c.Request.Context(), req.Email, req.Password)
    if err != nil {
        statusCode := http.StatusUnauthorized
        if err == services.ErrEmailNotVerified {
            statusCode = http.StatusForbidden
        }
        helper.Response(c, statusCode, err.Error(), nil, nil)
        return
    }

    helper.Response(c, http.StatusOK, "Login successful", loginResp, nil)
}

// Similar pattern for other methods...
```

**Before vs After:**
```
BEFORE (340 LOC):
- HTTP binding
- Validation
- Database queries
- Business logic
- Transaction management
- Email sending
- Response formatting

AFTER (~100 LOC):
- HTTP binding
- Call service method
- Map errors to status codes
- Response formatting
```

---

### Task 3.4: Write UserService Unit Tests (12 hours)

**File:** `internal/services/user_service_test.go`

**Acceptance Criteria:**
- [ ] Test all service methods
- [ ] Use mocked repositories (no real database)
- [ ] Test success cases
- [ ] Test error cases (duplicate email, invalid credentials, etc.)
- [ ] Test edge cases
- [ ] 80%+ coverage

**Code Structure:**
```go
package services_test

import (
    "context"
    "testing"
    "fintrax-backend/internal/repositories"
    "fintrax-backend/internal/services"
    "fintrax-backend/models"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

// Mock repository
type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) Create(ctx context.Context, user *models.User) error {
    args := m.Called(ctx, user)
    return args.Error(0)
}

func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
    args := m.Called(ctx, email)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*models.User), args.Error(1)
}

// Tests
func TestUserService_Register_Success(t *testing.T) {
    mockUserRepo := new(MockUserRepository)
    mockFinanceRepo := new(MockFinanceRepository)

    service := services.NewUserService(mockUserRepo, mockFinanceRepo, "secret")

    // Setup expectations
    mockUserRepo.On("FindByEmail", mock.Anything, "test@example.com").Return(nil, nil)
    mockUserRepo.On("Create", mock.Anything, mock.AnythingOfType("*models.User")).Return(nil)
    mockFinanceRepo.On("Create", mock.Anything, mock.AnythingOfType("*models.Finance")).Return(nil)

    // Execute
    req := services.RegisterRequest{
        Email:    "test@example.com",
        Password: "password123",
        Name:     "Test User",
    }
    user, err := service.Register(context.Background(), req)

    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, user)
    assert.Equal(t, "test@example.com", user.Email)
    mockUserRepo.AssertExpectations(t)
    mockFinanceRepo.AssertExpectations(t)
}

func TestUserService_Register_EmailAlreadyExists(t *testing.T) {
    mockUserRepo := new(MockUserRepository)
    mockFinanceRepo := new(MockFinanceRepository)
    service := services.NewUserService(mockUserRepo, mockFinanceRepo, "secret")

    // User already exists
    existingUser := &models.User{ID: 1, Email: "test@example.com"}
    mockUserRepo.On("FindByEmail", mock.Anything, "test@example.com").Return(existingUser, nil)

    req := services.RegisterRequest{
        Email:    "test@example.com",
        Password: "password123",
        Name:     "Test User",
    }
    user, err := service.Register(context.Background(), req)

    assert.Error(t, err)
    assert.Nil(t, user)
    assert.Equal(t, services.ErrEmailAlreadyExists, err)
}

func TestUserService_Login_Success(t *testing.T) {
    mockUserRepo := new(MockUserRepository)
    mockFinanceRepo := new(MockFinanceRepository)
    service := services.NewUserService(mockUserRepo, mockFinanceRepo, "secret")

    hashedPassword := helper.HashPassword("password123")
    user := &models.User{
        ID:       1,
        Email:    "test@example.com",
        Password: hashedPassword,
        Status:   constants.STATUS_ACTIVE,
    }

    mockUserRepo.On("FindByEmail", mock.Anything, "test@example.com").Return(user, nil)

    loginResp, err := service.Login(context.Background(), "test@example.com", "password123")

    assert.NoError(t, err)
    assert.NotNil(t, loginResp)
    assert.NotEmpty(t, loginResp.Token)
    assert.Equal(t, uint(1), loginResp.User.ID)
}

func TestUserService_Login_InvalidPassword(t *testing.T) {
    mockUserRepo := new(MockUserRepository)
    mockFinanceRepo := new(MockFinanceRepository)
    service := services.NewUserService(mockUserRepo, mockFinanceRepo, "secret")

    hashedPassword := helper.HashPassword("password123")
    user := &models.User{
        ID:       1,
        Email:    "test@example.com",
        Password: hashedPassword,
    }

    mockUserRepo.On("FindByEmail", mock.Anything, "test@example.com").Return(user, nil)

    loginResp, err := service.Login(context.Background(), "test@example.com", "wrongpassword")

    assert.Error(t, err)
    assert.Nil(t, loginResp)
    assert.Equal(t, services.ErrInvalidCredentials, err)
}
```

---

### Task 3.5: Integration Testing (4 hours)
- [ ] Test UserController with real UserService
- [ ] Test full registration flow (HTTP → Controller → Service → Repository → DB)
- [ ] Ensure existing API contracts maintained
- [ ] No breaking changes

---

### Task 3.6: Documentation (2 hours)
**File:** `internal/services/README.md`

---

### Task 3.7: Code Review & Refactoring (3 hours)
- [ ] Review all code
- [ ] Run tests
- [ ] Check coverage
- [ ] Refactor as needed

---

## Deliverables

### Code Files
1. `internal/services/user_service.go` (interface, ~100 LOC)
2. `internal/services/user_service_impl.go` (implementation, ~400 LOC)
3. `internal/services/errors.go` (custom errors, ~50 LOC)
4. Refactored `controllers/userController.go` (~100 LOC, down from 340)

### Test Files
1. `internal/services/user_service_test.go` (~400 LOC)
2. `tests/mocks/mock_user_repository.go` (~100 LOC)

**Total:** 2-3 new files, ~500-700 LOC, ~170 LOC removed from controller

---

## Success Criteria
- ✅ UserController reduced from 340 LOC to ~100 LOC
- ✅ All business logic in UserService
- ✅ UserService testable without HTTP layer
- ✅ All tests pass (80%+ coverage)
- ✅ Existing API contracts maintained
- ✅ Zero breaking changes

---

# Sprint 4: Service Layer - Todo & Project

## Goals
- Create TodoService and ProjectService
- Move CRUD and business logic from controllers
- Reduce controller sizes by 60%

## Duration: Week 4 (40 hours)

## Tasks

### Task 4.1: Create TodoService (10 hours)
**Files:**
- `internal/services/todo_service.go`
- `internal/services/todo_service_impl.go`

**Methods:**
- CreateTodo
- GetUserTodos
- GetTodo
- UpdateTodo
- DeleteTodo
- GetTodosByProject
- GetTodosByStatus

---

### Task 4.2: Create ProjectService (10 hours)
**Files:**
- `internal/services/project_service.go`
- `internal/services/project_service_impl.go`

**Methods:**
- CreateProject
- GetUserProjects
- GetProject
- UpdateProject
- DeleteProject
- GetProjectStats

---

### Task 4.3: Refactor TodoController (4 hours)
- Reduce from 228 LOC to ~80 LOC

---

### Task 4.4: Refactor ProjectController (4 hours)
- Reduce from 218 LOC to ~80 LOC

---

### Task 4.5: Write Unit Tests (10 hours)
- TodoService tests
- ProjectService tests
- Mock repositories

---

### Task 4.6: Documentation & Review (2 hours)

---

## Deliverables
- 4-5 new files
- ~600-800 LOC
- ~200 LOC removed from controllers

---

# Sprint 5: Service Layer - Finance Domain

## Goals
- Create services for Finance, Transaction, Savings, Loans
- Move aggregation and calculation logic
- Complete service layer for all domains

## Duration: Week 5 (40 hours)

## Tasks

### Task 5.1: Create FinanceService (8 hours)
**Methods:**
- GetFinance
- UpdateFinance
- GetFinanceSummary
- CalculateTotalBalance

---

### Task 5.2: Create TransactionService (10 hours)
**Methods:**
- CreateTransaction
- GetUserTransactions
- GetTransaction
- UpdateTransaction
- DeleteTransaction
- GetTransactionSummary
- GetTransactionsByType
- GetTransactionsByCategory

---

### Task 5.3: Create SavingsService (6 hours)
**Methods:**
- CreateSavingsGoal
- GetUserSavings
- UpdateSavingsGoal
- DeleteSavingsGoal
- GetTotalSavings

---

### Task 5.4: Create LoansService (6 hours)
**Methods:**
- CreateLoan
- GetUserLoans
- UpdateLoan
- DeleteLoan
- GetLoansSummary

---

### Task 5.5: Refactor Controllers (6 hours)
- FinanceController
- TransactionController
- SavingsController
- LoansController

---

### Task 5.6: Write Tests (4 hours)

---

## Deliverables
- 4-6 new files
- ~700-900 LOC

---

# Sprint 6: Dependency Injection Container

## Goals
- Create DI container
- Wire all dependencies
- Eliminate global `database.DB`
- Enable full testability

## Duration: Week 6 (50 hours - most critical sprint)

## Tasks

### Task 6.1: Design Container Structure (4 hours)
**File:** `internal/container/container.go`

**Code Structure:**
```go
package container

import (
    "fintrax-backend/database"
    "fintrax-backend/internal/repositories"
    "fintrax-backend/internal/services"
    "fintrax-backend/controllers"
    "gorm.io/gorm"
)

type Container struct {
    // Database
    DB *gorm.DB

    // Repositories
    UserRepo        repositories.UserRepository
    TodoRepo        repositories.TodoRepository
    ProjectRepo     repositories.ProjectRepository
    FinanceRepo     repositories.FinanceRepository
    TransactionRepo repositories.TransactionRepository
    SavingsRepo     repositories.SavingsRepository
    LoansRepo       repositories.LoansRepository
    // ... all 14 repositories

    // Services
    UserService        services.UserService
    TodoService        services.TodoService
    ProjectService     services.ProjectService
    FinanceService     services.FinanceService
    TransactionService services.TransactionService
    // ... all services

    // Controllers
    UserController        *controllers.UserController
    TodoController        *controllers.TodoController
    ProjectController     *controllers.ProjectController
    FinanceController     *controllers.FinanceController
    TransactionController *controllers.TransactionController
    // ... all controllers
}

func NewContainer(db *gorm.DB) *Container {
    c := &Container{DB: db}

    // Initialize repositories
    c.initRepositories()

    // Initialize services
    c.initServices()

    // Initialize controllers
    c.initControllers()

    return c
}

func (c *Container) initRepositories() {
    c.UserRepo = repositories.NewUserRepository(c.DB)
    c.TodoRepo = repositories.NewTodoRepository(c.DB)
    c.ProjectRepo = repositories.NewProjectRepository(c.DB)
    // ... all repositories
}

func (c *Container) initServices() {
    c.UserService = services.NewUserService(c.UserRepo, c.FinanceRepo, jwtSecret)
    c.TodoService = services.NewTodoService(c.TodoRepo, c.ProjectRepo)
    // ... all services
}

func (c *Container) initControllers() {
    c.UserController = controllers.NewUserController(c.UserService)
    c.TodoController = controllers.NewTodoController(c.TodoService)
    // ... all controllers
}
```

---

### Task 6.2: Refactor All Controllers (20 hours)
- Convert all 12 controllers from functions to structs
- Add constructor functions accepting services
- Remove all `database.DB` references

**Pattern:**
```go
// BEFORE
package controllers

import "fintrax-backend/database"

func GetAllToDos(c *gin.Context) {
    database.DB.Find(&todos)  // Global state!
}

// AFTER
package controllers

import "fintrax-backend/internal/services"

type TodoController struct {
    todoService services.TodoService
}

func NewTodoController(todoService services.TodoService) *TodoController {
    return &TodoController{todoService: todoService}
}

func (tc *TodoController) GetAllToDos(c *gin.Context) {
    todos, err := tc.todoService.GetUserTodos(c.Request.Context(), userID)
}
```

---

### Task 6.3: Update All Route Files (8 hours)
- Update all 13 route files to use container
- Pass controller instances instead of function references

**Pattern:**
```go
// BEFORE
func UserRoute(route *gin.Engine) {
    route.POST("/register", controllers.Register)
}

// AFTER
func UserRoute(route *gin.Engine, container *container.Container) {
    route.POST("/register", container.UserController.Register)
}
```

---

### Task 6.4: Update main.go (4 hours)
**File:** `main.go`

```go
func main() {
    // Initialize database
    database.Connect()
    db := database.DB

    // Create container
    container := container.NewContainer(db)

    // Setup router
    router := gin.Default()

    // Register routes with container
    routes.UserRoute(router, container)
    routes.TodoRoute(router, container)
    // ... all routes

    router.Run(":8080")
}
```

---

### Task 6.5: Integration Testing (10 hours)
- Test full application with DI
- Ensure all endpoints work
- Test with mock implementations
- Regression testing

---

### Task 6.6: Remove Global Database (2 hours)
- Remove `database.DB` global variable
- Update database package
- Verify no global references remain

---

### Task 6.7: Documentation (2 hours)

---

## Deliverables
- 1-2 new files (container)
- ~30 files modified (controllers, routes, main.go)
- ~400-600 LOC for container
- ~500 LOC removed (global references)

---

## Success Criteria
- ✅ Zero global `database.DB` references
- ✅ All dependencies injected
- ✅ Application starts without errors
- ✅ All tests pass
- ✅ Can swap implementations for testing

---

## Risks
⚠️ **HIGH RISK SPRINT** - Most changes across codebase

**Mitigation:**
- Commit frequently
- Test after each controller refactor
- Feature flag if possible
- Thorough regression testing

---

# Sprint 7-10: Advanced Patterns

_(Detailed breakdown similar to above for remaining sprints)_

## Sprint 7: Unit of Work Pattern
- Implement UnitOfWork interface
- Update services to use transactions
- Remove manual transaction management

## Sprint 8: Strategy & Factory Patterns
- Validation strategies
- Transaction type strategies
- Response factories
- Error factories

## Sprint 9: Observer Pattern (Event System)
- Event dispatcher
- User events
- Transaction events
- Email listener
- Audit listener

## Sprint 10: Builder, Adapter & Decorator
- Query builder
- Email adapter
- Logging decorator
- Caching decorator
- Performance optimization

---

# Testing Strategy

## Unit Tests
- **Target:** 80%+ coverage
- **Framework:** Go testing + testify
- **Mocking:** testify/mock

**Coverage by Layer:**
- Repositories: 85%+
- Services: 80%+
- Controllers: 60%+ (integration tests cover the rest)

## Integration Tests
- **Target:** All API endpoints
- **Database:** In-memory SQLite or Docker PostgreSQL
- **Framework:** httptest + testify

## Test Organization
```
tests/
├── unit/
│   ├── repositories/
│   ├── services/
│   └── strategies/
├── integration/
│   └── api/
└── mocks/
```

---

# Deployment Strategy

## Backwards Compatibility
- All sprints maintain API contracts
- No breaking changes until Sprint 6 (internal only)
- Feature flags for gradual rollout

## Rollback Plan
- Git tags at each sprint completion
- Database migrations are reversible
- Can rollback to any sprint

## Performance Monitoring
- Benchmark before/after each sprint
- Profile critical paths
- Monitor response times

---

# Risk Management

## High-Risk Areas

### Sprint 6 (DI Container) - HIGH RISK
**Risk:** Breaking changes across entire codebase
**Mitigation:**
- Extensive testing before merge
- Code review
- Deploy to staging first
- Rollback plan ready

### Sprint 7 (Unit of Work) - MEDIUM RISK
**Risk:** Transaction management errors
**Mitigation:**
- Thorough testing of rollback scenarios
- Test nested transactions
- Monitor database connection pool

### Sprint 9 (Event System) - MEDIUM RISK
**Risk:** Async event handling failures
**Mitigation:**
- Error handling in listeners
- Dead letter queue for failed events
- Monitoring and alerting

## Low-Risk Areas
- Sprints 1-2: Repository layer (additive only)
- Sprint 8: Strategies and factories (encapsulated)
- Sprint 10: Builders and adapters (optional)

---

# Success Metrics

## Code Quality Metrics

| Metric | Before | Target | Measurement |
|--------|--------|--------|-------------|
| **Test Coverage** | 0% | 80%+ | `go test -cover` |
| **Code Duplication** | 30% | <5% | Code analysis tools |
| **Cyclomatic Complexity** | 15+ avg | <10 avg | `gocyclo` |
| **Direct DB Calls** | 162 | 0 | `grep -r "database.DB"` |
| **Avg Controller Size** | 250 LOC | <100 LOC | `wc -l` |
| **Avg Service Size** | N/A | 200-300 LOC | `wc -l` |

## Architecture Metrics

| Metric | Before | Target |
|--------|--------|--------|
| **Service Layer** | 0 files | 12+ files |
| **Repository Layer** | 0 files | 14+ files |
| **Design Patterns** | 2 | 11 |
| **Dependency Injection** | 0% | 100% |

## Performance Metrics

| Metric | Target |
|--------|--------|
| **API Response Time** | ±5% (no degradation) |
| **Database Queries** | Reduce N+1 queries |
| **Memory Usage** | Optimize via pooling |

---

# Timeline Summary

```
Week 1  [████████████████████] Sprint 1: Repository Foundation
Week 2  [████████████████████] Sprint 2: Repository Expansion
Week 3  [████████████████████] Sprint 3: User Service
Week 4  [████████████████████] Sprint 4: Todo/Project Service
Week 5  [████████████████████] Sprint 5: Finance Services
Week 6  [████████████████████] Sprint 6: DI Container ⚠️
Week 7  [████████████████████] Sprint 7: Unit of Work
Week 8  [████████████████████] Sprint 8: Strategies
Week 9  [████████████████████] Sprint 9: Events
Week 10 [████████████████████] Sprint 10: Builders/Adapters

Total: 10 weeks (2.5 months)
```

---

# Conclusion

This sprint plan provides a **systematic, low-risk approach** to transforming the Fintrax backend into a production-ready system.

**Key Principles:**
- ✅ Incremental changes (no big-bang rewrites)
- ✅ Backwards compatibility maintained
- ✅ Testing at every step
- ✅ Clear success criteria
- ✅ Rollback plan for each sprint

**Expected Outcomes:**
- 🎯 80%+ test coverage
- 🎯 Zero technical debt
- 🎯 Highly maintainable codebase
- 🎯 Production-ready architecture
- 🎯 Team velocity increase

**Investment:** 10 weeks
**ROI:** Exponential improvement in code quality and developer productivity

---

**Document Version:** 1.0
**Last Updated:** 2025-11-17
**Next Review:** After Sprint 2 completion
