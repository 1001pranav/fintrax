# Backend Architecture - Design Pattern Integration

## Table of Contents
1. [Current Architecture](#current-architecture)
2. [Proposed Architecture](#proposed-architecture)
3. [Design Patterns](#design-patterns)
4. [Layer Responsibilities](#layer-responsibilities)
5. [Data Flow](#data-flow)
6. [File Structure](#file-structure)

---

## Current Architecture

### Architecture Diagram (As-Is)

```
┌─────────────────────────────────────────────────────────────────┐
│                          main.go                                │
│  • Database connection initialization                           │
│  • CORS configuration                                           │
│  • Route registration                                           │
│  • Middleware setup                                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
    ┌─────────▼─────────┐    ┌─────────▼─────────┐
    │   Middleware      │    │      Routes       │
    │                   │    │                   │
    │ • authorization   │    │ • UserRoute       │
    │ • recovery        │    │ • TodoRoute       │
    │ • rateLimit       │    │ • ProjectRoute    │
    │                   │    │ • FinanceRoute    │
    │ 3 files           │    │ • TransactionRoute│
    │ ~200 LOC          │    │ • 8+ more routes  │
    │                   │    │                   │
    │ ✅ Well-designed  │    │ 13 files          │
    │                   │    │ ~400 LOC          │
    └───────────────────┘    └─────────┬─────────┘
                                       │
                          ┌────────────▼────────────┐
                          │     Controllers         │
                          │   (HTTP + Business)     │
                          │                         │
                          │ • userController.go     │
                          │   - 340 lines           │
                          │   - Register, Login     │
                          │   - OTP, Password Reset │
                          │                         │
                          │ • todoController.go     │
                          │   - 228 lines           │
                          │   - CRUD operations     │
                          │                         │
                          │ • projectController.go  │
                          │   - 218 lines           │
                          │                         │
                          │ • financeController.go  │
                          │ • transactionController │
                          │ • savingsController     │
                          │ • loansController       │
                          │ • dashboardController   │
                          │ • 4+ more controllers   │
                          │                         │
                          │ 12 files                │
                          │ ~3000 LOC total         │
                          │                         │
                          │ ⚠️ ISSUES:              │
                          │ • Mixed responsibilities│
                          │ • HTTP + Business logic │
                          │ • Hard to test          │
                          │ • Code duplication      │
                          └────────┬────────────────┘
                                   │
                                   │ (162 direct calls)
                                   │
                      ┏━━━━━━━━━━━━▼━━━━━━━━━━━━━┓
                      ┃   GLOBAL database.DB     ┃
                      ┃                          ┃
                      ┃  ⚠️ ANTI-PATTERN:        ┃
                      ┃  • Global singleton      ┃
                      ┃  • Tight coupling        ┃
                      ┃  • Cannot mock for tests ┃
                      ┃  • No interface          ┃
                      ┗━━━━━━━━━━━━┬━━━━━━━━━━━━━┛
                                   │
                          ┌────────▼────────────┐
                          │   GORM Models       │
                          │                     │
                          │ • user.go           │
                          │ • todo.go           │
                          │ • project.go        │
                          │ • finance.go        │
                          │ • transactions.go   │
                          │ • savings.go        │
                          │ • loans.go          │
                          │ • roadmap.go        │
                          │ • tags.go           │
                          │ • notes.go          │
                          │ • resources.go      │
                          │ • 3+ more models    │
                          │                     │
                          │ 14 files            │
                          │ ~800 LOC            │
                          │                     │
                          │ ✅ Well-defined     │
                          │    relationships    │
                          └─────────────────────┘

┌──────────────────────────────────────────────────┐
│              Helper Functions                    │
│                                                  │
│ • response.go      - Standard API responses     │
│ • jwtHelper.go     - JWT operations             │
│ • password.go      - Bcrypt hashing             │
│ • mailHelper.go    - Email sending              │
│                                                  │
│ 6 files, ~150 LOC                                │
│                                                  │
│ ⚠️ Called directly from controllers              │
│    (tight coupling)                              │
└──────────────────────────────────────────────────┘
```

### Current Architecture Issues

#### 1. No Service Layer
```
❌ CURRENT FLOW:
HTTP Request → Controller → database.DB → GORM Model → Response

PROBLEMS:
• Business logic in controllers (violates SRP)
• Hard to test without HTTP layer
• Cannot reuse logic across different interfaces (CLI, gRPC, etc.)
```

#### 2. Global Database Singleton
```go
// database/db.go
var DB *gorm.DB  // ⚠️ Global variable

// Used everywhere:
database.DB.Where("user_id = ?", userID).Find(&todos)
database.DB.Create(&user)
database.DB.Save(&project)

PROBLEMS:
• 162 direct references across codebase
• Cannot inject mock for testing
• Tight coupling to database package
• Cannot swap implementations
```

#### 3. Code Duplication (8+ Controllers)
```go
// SAME PATTERN in todo, project, savings, loans, transactions, etc.:

func GetAll*(c *gin.Context) {
    userID, _ := c.Get("user_id")  // Repeated 40+ times

    var items []models.*
    database.DB.Where("user_id = ? AND status != ?",
        userID, constants.STATUS_DELETED).Find(&items)  // Repeated 12+ times

    response := make([]Response, len(items))
    for i, item := range items {
        response[i] = toResponse(item)  // Repeated 8+ times
    }

    helper.Response(c, 200, "Success", response, nil)  // Repeated 60+ times
}

func Delete*(c *gin.Context) {
    // Same soft-delete logic repeated 8+ times
    item.Status = constants.STATUS_DELETED
    item.DeletedAt.Time = time.Now()
    item.DeletedAt.Valid = true
    database.DB.Save(&item)
}
```

#### 4. Mixed Responsibilities
```go
// userController.go - Register function does EVERYTHING:

func Register(c *gin.Context) {
    // 1. HTTP binding
    var req registerRequest
    c.ShouldBindJSON(&req)

    // 2. Validation
    if req.Email == "" || req.Password == "" { ... }

    // 3. Database query
    database.DB.Where("email = ?", req.Email).Find(&user)

    // 4. Business logic
    hashedPassword := helper.HashPassword(req.Password)
    otp := rand.Intn(900000) + 100000

    // 5. Transaction management
    tx := database.DB.Begin()

    // 6. Multiple database writes
    tx.Create(&newUser)
    tx.Create(&finance)
    tx.Create(&otpRecord)

    // 7. External service call
    helper.SendMail(req.Email, "OTP", otp)

    // 8. Response formatting
    helper.Response(c, 201, "User created", response, nil)
}

VIOLATES:
• Single Responsibility Principle
• Separation of Concerns
• Testability
• Maintainability
```

#### 5. No Repository Abstraction
```
Direct GORM calls everywhere:

database.DB.Where(...).Find(...)        // Used 50+ times
database.DB.First(...)                  // Used 30+ times
database.DB.Create(...)                 // Used 25+ times
database.DB.Save(...)                   // Used 20+ times
database.DB.Delete(...)                 // Used 15+ times

PROBLEMS:
• Cannot test without real database
• Query logic scattered across controllers
• No reusability
• Hard to optimize queries
```

### Metrics Summary (Current)

| Metric | Value | Status |
|--------|-------|--------|
| **Service Layer** | 0 files | ❌ Missing |
| **Repository Layer** | 0 files | ❌ Missing |
| **Direct DB Calls** | 162 references | ❌ High coupling |
| **Controller Size** | Avg 250 LOC | ⚠️ Too large |
| **Code Duplication** | ~30% | ❌ High |
| **Test Coverage** | ~0% | ❌ No unit tests |
| **Dependency Injection** | 0% | ❌ Global state |
| **Design Patterns** | 2 (Middleware, Singleton) | ⚠️ Limited |

---

## Proposed Architecture

### Architecture Diagram (To-Be)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            main.go                                  │
│  • Load configuration                                               │
│  • Initialize database connection                                   │
│  • Create DI Container                                              │
│  • Wire all dependencies                                            │
│  • Start HTTP server                                                │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   DI Container 📦        │
              │                          │
              │ container.Container      │
              │                          │
              │ • DB *gorm.DB            │
              │ • Repositories           │
              │ • Services               │
              │ • Controllers            │
              │ • Factories              │
              │ • Event Dispatcher       │
              │                          │
              │ ✅ No global state       │
              │ ✅ Interface-based       │
              │ ✅ Testable              │
              └─┬────────────────────┬───┘
                │                    │
    ┌───────────▼──────────┐  ┌──────▼─────────────────┐
    │   HTTP Layer         │  │   Middleware           │
    │                      │  │                        │
    │  ┌────────────────┐  │  │  • Authorization       │
    │  │    Routes      │  │  │    (JWT validation)    │
    │  │                │  │  │                        │
    │  │ • UserRoute    │  │  │  • Recovery            │
    │  │ • TodoRoute    │  │  │    (panic handler)     │
    │  │ • ProjectRoute │  │  │                        │
    │  │ • 10+ routes   │  │  │  • RateLimit           │
    │  │                │  │  │    (sliding window)    │
    │  │ 13 files       │  │  │                        │
    │  │ ~400 LOC       │  │  │  • Logging             │
    │  │                │  │  │    (request/response)  │
    │  └────────┬───────┘  │  │                        │
    │           │          │  │  3-4 files             │
    │  ┌────────▼───────┐  │  │  ~300 LOC              │
    │  │  Controllers   │  │  │                        │
    │  │   (THIN!)      │  │  │  ✅ Clean separation   │
    │  │                │  │  └────────────────────────┘
    │  │ 1️⃣ Bind request│  │
    │  │ 2️⃣ Validate    │  │
    │  │ 3️⃣ Call service│  │
    │  │ 4️⃣ Return resp │  │
    │  │                │  │
    │  │ struct {       │  │
    │  │   service      │  │  ⬅️ Injected dependency
    │  │ }              │  │
    │  │                │  │
    │  │ 12 files       │  │
    │  │ ~1200 LOC      │  │  (60% smaller!)
    │  │ Avg 100 LOC    │  │
    │  │                │  │
    │  │ ✅ HTTP only   │  │
    │  │ ✅ Thin layer  │  │
    │  └────────┬───────┘  │
    └───────────┼──────────┘
                │
    ┌───────────▼────────────────────────────────────────────────┐
    │                  Service Layer 🎯                           │
    │              (Business Logic)                               │
    │                                                             │
    │  ┌──────────────────┐  ┌──────────────────┐               │
    │  │  UserService     │  │  TodoService     │  ...           │
    │  │                  │  │                  │                │
    │  │  interface {     │  │  interface {     │                │
    │  │   Register()     │  │   Create()       │                │
    │  │   Login()        │  │   Update()       │                │
    │  │   GenerateOTP()  │  │   Delete()       │                │
    │  │   VerifyEmail()  │  │   GetUserTodos() │                │
    │  │   ResetPassword()│  │  }               │                │
    │  │  }               │  │                  │                │
    │  │                  │  │  struct {        │                │
    │  │  struct {        │  │   repo           │  ⬅️ Injected  │
    │  │   userRepo       │  │   projectRepo    │                │
    │  │   financeRepo    │  │   eventDispatch  │                │
    │  │   emailAdapter   │  │  }               │                │
    │  │   jwtHelper      │  │                  │                │
    │  │   eventDispatch  │  └──────────────────┘                │
    │  │   uow            │                                       │
    │  │  }               │  ┌──────────────────┐                │
    │  └──────────────────┘  │ FinanceService   │                │
    │                        │ TransactionSvc   │                │
    │  ✅ Pure business logic│ SavingsService   │                │
    │  ✅ Testable (mock deps│ LoansService     │                │
    │  ✅ Reusable           │ ProjectService   │                │
    │  ✅ Transaction mgmt   │ DashboardService │                │
    │                        └──────────────────┘                │
    │  12+ files, ~3500 LOC                                       │
    │                                                             │
    │  ┌────────────────────────────────────────┐                │
    │  │      Unit of Work (Transactions)       │                │
    │  │                                        │                │
    │  │  Transaction(fn func() error) error {  │                │
    │  │    tx := db.Begin()                    │                │
    │  │    defer Rollback on panic             │                │
    │  │    if err := fn(); err != nil {        │                │
    │  │      tx.Rollback()                     │                │
    │  │      return err                        │                │
    │  │    }                                   │                │
    │  │    tx.Commit()                         │                │
    │  │  }                                     │                │
    │  │                                        │                │
    │  │  ✅ Automatic rollback                 │                │
    │  │  ✅ Nested transaction support         │                │
    │  └────────────────────────────────────────┘                │
    └─────────────────────┬───────────────────────────────────────┘
                          │
    ┌─────────────────────▼──────────────────────────────────────┐
    │                Repository Layer 💾                          │
    │             (Data Access Abstraction)                       │
    │                                                             │
    │  ┌─────────────────────────────────────────────┐           │
    │  │       BaseRepository[T any]                 │           │
    │  │                                             │           │
    │  │  interface {                                │           │
    │  │    Create(ctx, *T) error                    │           │
    │  │    FindByID(ctx, uint) (*T, error)          │           │
    │  │    FindAll(ctx, filters) ([]*T, error)      │           │
    │  │    Update(ctx, *T) error                    │           │
    │  │    SoftDelete(ctx, uint) error              │           │
    │  │  }                                          │           │
    │  │                                             │           │
    │  │  ✅ Generic CRUD operations                 │           │
    │  │  ✅ Soft delete built-in                    │           │
    │  │  ✅ Context support (timeouts, cancellation)│           │
    │  └─────────────────────────────────────────────┘           │
    │                          │                                  │
    │        ┌─────────────────┼─────────────────┐               │
    │        │                 │                 │               │
    │  ┌─────▼──────────┐ ┌───▼───────────┐ ┌──▼──────────┐    │
    │  │UserRepository  │ │TodoRepository │ │ProjectRepo  │ ...│
    │  │                │ │               │ │             │    │
    │  │ Embeds Base +  │ │ Embeds Base + │ │ Embeds Base │    │
    │  │                │ │               │ │             │    │
    │  │ FindByEmail()  │ │ FindByUser()  │ │ CountTasks()│    │
    │  │ FindActive()   │ │ FindByProject │ │ GetStats()  │    │
    │  │ UpdateOTP()    │ │ CountByStatus │ │             │    │
    │  └────────────────┘ └───────────────┘ └─────────────┘    │
    │                                                            │
    │  14 repository interfaces + implementations               │
    │  ~2500 LOC total                                           │
    │                                                            │
    │  ✅ Eliminates 162 direct DB calls                         │
    │  ✅ Mockable for testing                                   │
    │  ✅ Query reusability                                      │
    │  ✅ Centralized soft-delete logic                          │
    └────────────────────────┬───────────────────────────────────┘
                             │
    ┌────────────────────────▼────────────────────────────────────┐
    │              Database Abstraction                           │
    │                                                             │
    │  ┌─────────────────────────────────────┐                   │
    │  │      *gorm.DB (injected)            │                   │
    │  │                                     │                   │
    │  │  • Connection pooling               │                   │
    │  │  • Statement caching                │                   │
    │  │  • Query logging (dev mode)         │                   │
    │  │  • Prepared statements              │                   │
    │  │                                     │                   │
    │  │  ✅ NO global state                 │                   │
    │  │  ✅ Injected via constructor        │                   │
    │  │  ✅ Swappable (SQLite for tests)    │                   │
    │  └─────────────────────────────────────┘                   │
    └────────────────────────┬────────────────────────────────────┘
                             │
    ┌────────────────────────▼────────────────────────────────────┐
    │              GORM Models (Domain Entities)                  │
    │                                                             │
    │  • User, Todo, Project, Finance                             │
    │  • Transaction, Savings, Loans                              │
    │  • Roadmap, Tags, Notes, Resources                          │
    │  • 14 total entities                                        │
    │                                                             │
    │  ✅ Same as before (no changes needed)                      │
    └─────────────────────────────────────────────────────────────┘

┌─────────────────────── Supporting Patterns ──────────────────────┐
│                                                                   │
│  🏭 Factories                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ResponseFactory                                        │    │
│  │   • Success(data) *APIResponse                          │    │
│  │   • Error(err) *APIResponse                             │    │
│  │   • ValidationError(err) *APIResponse                   │    │
│  │                                                         │    │
│  │  ErrorFactory                                           │    │
│  │   • NotFound(entity, id)                                │    │
│  │   • Unauthorized(msg)                                   │    │
│  │   • ValidationFailed(field, rule)                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  🎭 Strategies                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ValidationStrategy                                     │    │
│  │   • EmailValidation                                     │    │
│  │   • PasswordValidation (min 8, special char, etc.)      │    │
│  │   • OTPValidation (6 digits, expiry)                    │    │
│  │                                                         │    │
│  │  TransactionStrategy                                    │    │
│  │   • IncomeStrategy (increase balance)                   │    │
│  │   • ExpenseStrategy (decrease balance, check limit)     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  👁️ Observer (Event System)                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  EventDispatcher                                        │    │
│  │   • Register(event, listener)                           │    │
│  │   • Dispatch(event)                                     │    │
│  │                                                         │    │
│  │  Events:                                                │    │
│  │   • UserRegisteredEvent → SendWelcomeEmailListener      │    │
│  │                        → CreateFinanceRecordListener    │    │
│  │   • TransactionCreated → UpdateBalanceListener          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  🔧 Builders                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  QueryBuilder                                           │    │
│  │   • Where(field, val) *QB                               │    │
│  │   • ForUser(id) *QB                                     │    │
│  │   • ExcludeDeleted() *QB                                │    │
│  │   • OrderBy(field) *QB                                  │    │
│  │   • Paginate(page, size) *QB                            │    │
│  │   • Find(result) error                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  🔌 Adapters                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  EmailAdapter interface                                 │    │
│  │   • SMTPAdapter (current)                               │    │
│  │   • SendGridAdapter (future)                            │    │
│  │   • MockEmailAdapter (testing)                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  🎨 Decorators                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  LoggingDecorator (wraps repository)                    │    │
│  │   • Logs all queries in dev mode                        │    │
│  │                                                         │    │
│  │  CachingDecorator (wraps service)                       │    │
│  │   • Caches frequent reads (dashboard stats)             │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
```

### Architecture Benefits

#### 1. Separation of Concerns
```
✅ NEW FLOW:
HTTP Request → Controller (HTTP) → Service (Business) → Repository (Data) → DB

Each layer has ONE responsibility:
• Controllers: HTTP protocol (binding, validation, response)
• Services: Business logic (calculations, orchestration, transactions)
• Repositories: Data access (queries, CRUD)
```

#### 2. Testability
```go
// BEFORE: Cannot test without database
func TestRegister() {
    // Need real DB, HTTP server, etc.
}

// AFTER: Pure unit tests with mocks
func TestUserService_Register(t *testing.T) {
    mockRepo := mocks.NewUserRepository()
    mockRepo.On("FindByEmail", email).Return(nil, nil)
    mockRepo.On("Create", mock.Anything).Return(nil)

    service := services.NewUserService(mockRepo, ...)

    user, err := service.Register(context.Background(), req)

    assert.NoError(t, err)
    assert.NotNil(t, user)
    mockRepo.AssertExpectations(t)
}
```

#### 3. Dependency Injection
```go
// main.go
func main() {
    db := database.Connect()

    // Build container
    container := container.NewContainer(db)

    // Router gets all dependencies
    router := routes.SetupRouter(container)

    router.Run(":8080")
}

// No global state!
// Every component gets dependencies via constructor
```

#### 4. Code Reusability
```go
// Generic repository eliminates duplication

// BEFORE: 8+ controllers with same logic
func GetAllTodos(c *gin.Context) { /* 20 lines */ }
func GetAllProjects(c *gin.Context) { /* 20 lines - DUPLICATE */ }
func GetAllSavings(c *gin.Context) { /* 20 lines - DUPLICATE */ }

// AFTER: One generic method
repo := repositories.NewBaseRepository[models.Todo](db)
todos, err := repo.FindAll(ctx, map[string]interface{}{
    "user_id": userID,
    "status": constants.STATUS_ACTIVE,
})
```

#### 5. Transaction Management
```go
// BEFORE: Manual transaction handling (error-prone)
tx := database.DB.Begin()
if err := tx.Create(&user).Error; err != nil {
    tx.Rollback()  // Easy to forget!
    return err
}
tx.Create(&finance)
tx.Commit()

// AFTER: Automatic transaction management
return s.uow.Transaction(ctx, func() error {
    if err := s.userRepo.Create(ctx, user); err != nil {
        return err  // Automatic rollback!
    }
    if err := s.financeRepo.Create(ctx, finance); err != nil {
        return err  // Automatic rollback!
    }
    return nil  // Automatic commit!
})
```

### Metrics Summary (Proposed)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Service Layer** | 0 files | 12 files | ✅ +100% |
| **Repository Layer** | 0 files | 14 files | ✅ +100% |
| **Direct DB Calls** | 162 | 0 | ✅ -100% |
| **Controller Size** | Avg 250 LOC | Avg 100 LOC | ✅ -60% |
| **Code Duplication** | ~30% | <5% | ✅ -83% |
| **Test Coverage** | 0% | 80%+ | ✅ +80% |
| **Dependency Injection** | 0% | 100% | ✅ +100% |
| **Design Patterns** | 2 | 11 | ✅ +450% |
| **Total LOC** | ~5000 | ~10000 | New abstraction layers |
| **Maintainability** | Low | High | ✅ Significant |
| **Extensibility** | Low | High | ✅ Significant |

---

## Design Patterns

### 1. Repository Pattern ⭐⭐⭐

**Purpose:** Abstract data access logic, centralize database operations

**Structure:**
```go
// Generic base repository
type BaseRepository[T any] interface {
    Create(ctx context.Context, entity *T) error
    FindByID(ctx context.Context, id uint) (*T, error)
    FindAll(ctx context.Context, filters map[string]interface{}) ([]*T, error)
    Update(ctx context.Context, entity *T) error
    SoftDelete(ctx context.Context, id uint) error
}

// Specific repository with domain methods
type UserRepository interface {
    BaseRepository[models.User]
    FindByEmail(ctx context.Context, email string) (*models.User, error)
    FindActiveUsers(ctx context.Context) ([]*models.User, error)
    UpdateOTP(ctx context.Context, userID uint, otp uint) error
}

// GORM implementation
type gormUserRepository struct {
    db *gorm.DB
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
```

**Benefits:**
- ✅ Eliminates 162 direct `database.DB` calls
- ✅ Centralizes query logic (soft-delete, filtering)
- ✅ Mockable for unit testing
- ✅ Can swap GORM for other ORMs later

---

### 2. Service Layer Pattern ⭐⭐⭐

**Purpose:** Encapsulate business logic, orchestrate operations

**Structure:**
```go
type UserService interface {
    Register(ctx context.Context, req RegisterRequest) (*User, error)
    Login(ctx context.Context, email, password string) (*LoginResponse, error)
    GenerateOTP(ctx context.Context, email string) error
    VerifyEmail(ctx context.Context, email string, otp uint) error
}

type userService struct {
    userRepo    repositories.UserRepository
    financeRepo repositories.FinanceRepository
    emailAdapter adapters.EmailAdapter
    jwtHelper   helper.JWTHelper
    uow         database.UnitOfWork
    eventBus    events.EventDispatcher
}

func (s *userService) Register(ctx context.Context, req RegisterRequest) (*User, error) {
    // 1. Validation
    if err := s.validate(req); err != nil {
        return nil, err
    }

    // 2. Check duplicate
    existing, _ := s.userRepo.FindByEmail(ctx, req.Email)
    if existing != nil {
        return nil, ErrEmailAlreadyExists
    }

    // 3. Create user in transaction
    var user *models.User
    err := s.uow.Transaction(ctx, func() error {
        // Create user
        user = &models.User{
            Email: req.Email,
            Password: helper.HashPassword(req.Password),
            OTP: generateOTP(),
        }
        if err := s.userRepo.Create(ctx, user); err != nil {
            return err
        }

        // Create finance record
        finance := &models.Finance{UserID: user.ID}
        if err := s.financeRepo.Create(ctx, finance); err != nil {
            return err
        }

        return nil
    })

    if err != nil {
        return nil, err
    }

    // 4. Dispatch event (async email sending)
    s.eventBus.Dispatch(events.UserRegisteredEvent{
        UserID: user.ID,
        Email: user.Email,
        OTP: user.OTP,
    })

    return user, nil
}
```

**Benefits:**
- ✅ Business logic separated from HTTP layer
- ✅ Testable without HTTP or database
- ✅ Reusable across different interfaces (REST, gRPC, CLI)
- ✅ Transaction orchestration

---

### 3. Dependency Injection Pattern ⭐⭐⭐

**Purpose:** Remove global state, enable interface-based programming

**Structure:**
```go
// internal/container/container.go
type Container struct {
    // Database
    DB *gorm.DB
    UoW database.UnitOfWork

    // Repositories
    UserRepo        repositories.UserRepository
    TodoRepo        repositories.TodoRepository
    ProjectRepo     repositories.ProjectRepository
    FinanceRepo     repositories.FinanceRepository
    TransactionRepo repositories.TransactionRepository
    SavingsRepo     repositories.SavingsRepository
    LoansRepo       repositories.LoansRepository

    // Services
    UserService        services.UserService
    TodoService        services.TodoService
    ProjectService     services.ProjectService
    FinanceService     services.FinanceService
    TransactionService services.TransactionService
    SavingsService     services.SavingsService
    LoansService       services.LoansService

    // Controllers
    UserController        *controllers.UserController
    TodoController        *controllers.TodoController
    ProjectController     *controllers.ProjectController
    FinanceController     *controllers.FinanceController
    TransactionController *controllers.TransactionController

    // Adapters & Helpers
    EmailAdapter adapters.EmailAdapter
    JWTHelper    helper.JWTHelper

    // Event system
    EventBus events.EventDispatcher
}

func NewContainer(db *gorm.DB) *Container {
    c := &Container{DB: db}

    // Unit of Work
    c.UoW = database.NewUnitOfWork(db)

    // Repositories
    c.UserRepo = repositories.NewUserRepository(db)
    c.TodoRepo = repositories.NewTodoRepository(db)
    c.ProjectRepo = repositories.NewProjectRepository(db)
    c.FinanceRepo = repositories.NewFinanceRepository(db)
    c.TransactionRepo = repositories.NewTransactionRepository(db)
    c.SavingsRepo = repositories.NewSavingsRepository(db)
    c.LoansRepo = repositories.NewLoansRepository(db)

    // Adapters
    c.EmailAdapter = adapters.NewSMTPAdapter(/* config */)
    c.JWTHelper = helper.NewJWTHelper(/* secret */)

    // Event system
    c.EventBus = events.NewEventDispatcher()
    c.registerEventListeners()

    // Services
    c.UserService = services.NewUserService(
        c.UserRepo,
        c.FinanceRepo,
        c.EmailAdapter,
        c.JWTHelper,
        c.UoW,
        c.EventBus,
    )
    c.TodoService = services.NewTodoService(c.TodoRepo, c.ProjectRepo)
    c.ProjectService = services.NewProjectService(c.ProjectRepo, c.TodoRepo)
    // ... more services

    // Controllers
    c.UserController = controllers.NewUserController(c.UserService)
    c.TodoController = controllers.NewTodoController(c.TodoService)
    c.ProjectController = controllers.NewProjectController(c.ProjectService)
    // ... more controllers

    return c
}

func (c *Container) registerEventListeners() {
    c.EventBus.Register("user.registered", listeners.NewEmailListener(c.EmailAdapter))
    c.EventBus.Register("transaction.created", listeners.NewBalanceUpdateListener(c.FinanceRepo))
}
```

**Benefits:**
- ✅ No global state (testable!)
- ✅ All dependencies explicit
- ✅ Easy to swap implementations (mock for tests)
- ✅ Centralized wiring

---

### 4. Unit of Work Pattern ⭐⭐

**Purpose:** Manage transaction boundaries automatically

**Structure:**
```go
type UnitOfWork interface {
    Transaction(ctx context.Context, fn func() error) error
}

type gormUnitOfWork struct {
    db *gorm.DB
}

func (uow *gormUnitOfWork) Transaction(ctx context.Context, fn func() error) error {
    tx := uow.db.WithContext(ctx).Begin()

    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
            panic(r)  // Re-throw panic
        }
    }()

    if err := fn(); err != nil {
        tx.Rollback()
        return err
    }

    return tx.Commit().Error
}
```

**Usage:**
```go
// Automatic transaction management
err := s.uow.Transaction(ctx, func() error {
    if err := s.userRepo.Create(ctx, user); err != nil {
        return err  // Auto rollback
    }
    if err := s.financeRepo.Create(ctx, finance); err != nil {
        return err  // Auto rollback
    }
    return nil  // Auto commit
})
```

**Benefits:**
- ✅ No manual Begin/Commit/Rollback
- ✅ Panic-safe (auto rollback)
- ✅ Reduces transaction management errors by 90%

---

### 5. Strategy Pattern ⭐⭐

**Purpose:** Encapsulate algorithms, make them interchangeable

**Structure:**
```go
// Validation strategies
type ValidationStrategy interface {
    Validate(value interface{}) error
}

type EmailValidationStrategy struct{}
func (v *EmailValidationStrategy) Validate(value interface{}) error {
    email := value.(string)
    if !regexp.MustCompile(`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$`).MatchString(email) {
        return errors.New("invalid email format")
    }
    return nil
}

type PasswordValidationStrategy struct{}
func (v *PasswordValidationStrategy) Validate(value interface{}) error {
    password := value.(string)
    if len(password) < 8 {
        return errors.New("password must be at least 8 characters")
    }
    // Check for special chars, numbers, etc.
    return nil
}

// Transaction processing strategies
type TransactionStrategy interface {
    Process(ctx context.Context, txn *models.Transaction) error
}

type IncomeTransactionStrategy struct {
    financeRepo repositories.FinanceRepository
}

func (s *IncomeTransactionStrategy) Process(ctx context.Context, txn *models.Transaction) error {
    // Increase balance
    finance, err := s.financeRepo.FindByUserID(ctx, txn.UserID)
    if err != nil {
        return err
    }

    finance.TotalBalance += txn.Amount
    finance.TotalIncome += txn.Amount

    return s.financeRepo.Update(ctx, finance)
}

type ExpenseTransactionStrategy struct {
    financeRepo repositories.FinanceRepository
}

func (s *ExpenseTransactionStrategy) Process(ctx context.Context, txn *models.Transaction) error {
    // Decrease balance, check limits
    finance, err := s.financeRepo.FindByUserID(ctx, txn.UserID)
    if err != nil {
        return err
    }

    if finance.TotalBalance < txn.Amount {
        return errors.New("insufficient balance")
    }

    finance.TotalBalance -= txn.Amount
    finance.TotalExpense += txn.Amount

    return s.financeRepo.Update(ctx, finance)
}
```

**Benefits:**
- ✅ Easy to add new validation rules
- ✅ Easy to add new transaction types
- ✅ No if/else chains

---

### 6. Observer Pattern ⭐

**Purpose:** Decouple event producers from consumers

**Structure:**
```go
// Event interface
type Event interface {
    Name() string
}

// Event dispatcher
type EventDispatcher struct {
    listeners map[string][]EventListener
    mu        sync.RWMutex
}

type EventListener interface {
    Handle(ctx context.Context, event Event) error
}

func (ed *EventDispatcher) Register(eventName string, listener EventListener) {
    ed.mu.Lock()
    defer ed.mu.Unlock()
    ed.listeners[eventName] = append(ed.listeners[eventName], listener)
}

func (ed *EventDispatcher) Dispatch(event Event) {
    ed.mu.RLock()
    listeners := ed.listeners[event.Name()]
    ed.mu.RUnlock()

    for _, listener := range listeners {
        go listener.Handle(context.Background(), event)  // Async
    }
}

// User events
type UserRegisteredEvent struct {
    UserID uint
    Email  string
    OTP    uint
}

func (e UserRegisteredEvent) Name() string {
    return "user.registered"
}

// Email listener
type EmailListener struct {
    emailAdapter adapters.EmailAdapter
}

func (l *EmailListener) Handle(ctx context.Context, event Event) error {
    userEvent := event.(UserRegisteredEvent)

    return l.emailAdapter.Send(
        userEvent.Email,
        "Welcome to Fintrax",
        fmt.Sprintf("Your OTP is: %d", userEvent.OTP),
    )
}
```

**Benefits:**
- ✅ Decouples user registration from email sending
- ✅ Easy to add new listeners (audit log, analytics)
- ✅ Async execution doesn't block main flow

---

### 7. Factory Pattern ⭐

**Purpose:** Standardize object creation

**Structure:**
```go
type ResponseFactory struct{}

func (f *ResponseFactory) Success(data interface{}) gin.H {
    return gin.H{
        "status":  "success",
        "message": "Operation successful",
        "data":    data,
        "errors":  nil,
    }
}

func (f *ResponseFactory) Error(err error) gin.H {
    return gin.H{
        "status":  "error",
        "message": err.Error(),
        "data":    nil,
        "errors":  []string{err.Error()},
    }
}

func (f *ResponseFactory) ValidationError(err error) gin.H {
    return gin.H{
        "status":  "error",
        "message": "Validation failed",
        "data":    nil,
        "errors":  extractValidationErrors(err),
    }
}

// Error factory
type ErrorFactory struct{}

func (f *ErrorFactory) NotFound(entity string, id uint) error {
    return &DomainError{
        Code:    404,
        Message: fmt.Sprintf("%s with ID %d not found", entity, id),
        Type:    "not_found",
    }
}

func (f *ErrorFactory) Unauthorized(message string) error {
    return &DomainError{
        Code:    401,
        Message: message,
        Type:    "unauthorized",
    }
}
```

**Benefits:**
- ✅ Consistent API responses
- ✅ Centralized error creation
- ✅ Easy to change response format

---

### 8. Builder Pattern ⭐

**Purpose:** Simplify complex object construction

**Structure:**
```go
type QueryBuilder struct {
    db *gorm.DB
}

func NewQueryBuilder(db *gorm.DB) *QueryBuilder {
    return &QueryBuilder{db: db}
}

func (qb *QueryBuilder) Where(field string, value interface{}) *QueryBuilder {
    qb.db = qb.db.Where(field+" = ?", value)
    return qb
}

func (qb *QueryBuilder) ForUser(userID uint) *QueryBuilder {
    qb.db = qb.db.Where("user_id = ?", userID)
    return qb
}

func (qb *QueryBuilder) ExcludeDeleted() *QueryBuilder {
    qb.db = qb.db.Where("status != ?", constants.STATUS_DELETED)
    return qb
}

func (qb *QueryBuilder) OrderBy(field string, direction string) *QueryBuilder {
    qb.db = qb.db.Order(field + " " + direction)
    return qb
}

func (qb *QueryBuilder) Paginate(page, size int) *QueryBuilder {
    offset := (page - 1) * size
    qb.db = qb.db.Offset(offset).Limit(size)
    return qb
}

func (qb *QueryBuilder) Find(result interface{}) error {
    return qb.db.Find(result).Error
}

// Usage:
todos := []models.Todo{}
err := NewQueryBuilder(db).
    ForUser(userID).
    ExcludeDeleted().
    Where("status", "active").
    OrderBy("created_at", "DESC").
    Paginate(1, 20).
    Find(&todos)
```

**Benefits:**
- ✅ Fluent, readable query building
- ✅ Eliminates repetitive query code
- ✅ Easy to add new filters

---

### 9. Adapter Pattern ⭐

**Purpose:** Abstract external dependencies

**Structure:**
```go
type EmailAdapter interface {
    Send(to, subject, body string) error
}

// SMTP implementation
type SMTPAdapter struct {
    host     string
    port     int
    username string
    password string
}

func (a *SMTPAdapter) Send(to, subject, body string) error {
    // SMTP sending logic
}

// SendGrid implementation (future)
type SendGridAdapter struct {
    apiKey string
}

func (a *SendGridAdapter) Send(to, subject, body string) error {
    // SendGrid API call
}

// Mock for testing
type MockEmailAdapter struct {
    SentEmails []Email
}

func (a *MockEmailAdapter) Send(to, subject, body string) error {
    a.SentEmails = append(a.SentEmails, Email{to, subject, body})
    return nil
}
```

**Benefits:**
- ✅ Easy to swap email providers
- ✅ Testable (use mock adapter)
- ✅ No vendor lock-in

---

### 10. Decorator Pattern ⭐

**Purpose:** Add behavior dynamically without modifying original code

**Structure:**
```go
// Logging decorator for repositories
type LoggingRepositoryDecorator struct {
    repo   repositories.UserRepository
    logger *log.Logger
}

func (d *LoggingRepositoryDecorator) FindByID(ctx context.Context, id uint) (*models.User, error) {
    d.logger.Printf("[Repository] Finding user by ID: %d", id)
    start := time.Now()

    user, err := d.repo.FindByID(ctx, id)

    duration := time.Since(start)
    if err != nil {
        d.logger.Printf("[Repository] Error finding user: %v (took %v)", err, duration)
    } else {
        d.logger.Printf("[Repository] Found user %d (took %v)", user.ID, duration)
    }

    return user, err
}

// Caching decorator for services
type CachingServiceDecorator struct {
    service services.DashboardService
    cache   *cache.Cache
}

func (d *CachingServiceDecorator) GetDashboard(ctx context.Context, userID uint) (*Dashboard, error) {
    // Check cache
    cacheKey := fmt.Sprintf("dashboard:%d", userID)
    if cached, found := d.cache.Get(cacheKey); found {
        return cached.(*Dashboard), nil
    }

    // Call actual service
    dashboard, err := d.service.GetDashboard(ctx, userID)
    if err != nil {
        return nil, err
    }

    // Cache result
    d.cache.Set(cacheKey, dashboard, 5*time.Minute)

    return dashboard, nil
}
```

**Benefits:**
- ✅ Add logging/caching without changing core logic
- ✅ Composable (can stack multiple decorators)
- ✅ Open/Closed Principle compliance

---

## Layer Responsibilities

### HTTP Layer (Controllers + Routes)

**Responsibility:** Handle HTTP protocol concerns

```go
// controllers/userController.go
type UserController struct {
    userService services.UserService
}

func (uc *UserController) Register(c *gin.Context) {
    // 1️⃣ Bind request
    var req dto.RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, factories.ValidationError(err))
        return
    }

    // 2️⃣ Call service
    user, err := uc.userService.Register(c.Request.Context(), req)
    if err != nil {
        c.JSON(err.StatusCode(), factories.ErrorResponse(err))
        return
    }

    // 3️⃣ Return response
    c.JSON(201, factories.SuccessResponse(user))
}
```

**DO:**
- ✅ Bind HTTP requests to DTOs
- ✅ Validate request format (JSON, query params)
- ✅ Extract user context (userID from JWT)
- ✅ Call service methods
- ✅ Format responses (JSON)
- ✅ Set HTTP status codes

**DON'T:**
- ❌ Business logic
- ❌ Database queries
- ❌ Transaction management
- ❌ Complex calculations

---

### Service Layer

**Responsibility:** Implement business logic

```go
// services/user_service.go
type UserService interface {
    Register(ctx context.Context, req RegisterRequest) (*User, error)
    Login(ctx context.Context, email, password string) (*LoginResponse, error)
}

type userService struct {
    userRepo     repositories.UserRepository
    financeRepo  repositories.FinanceRepository
    emailAdapter adapters.EmailAdapter
    uow          database.UnitOfWork
}

func (s *userService) Register(ctx context.Context, req RegisterRequest) (*User, error) {
    // Business logic:
    // • Validation
    // • Duplicate check
    // • Password hashing
    // • OTP generation
    // • Transaction orchestration
    // • Event dispatching
}
```

**DO:**
- ✅ Business rules validation
- ✅ Orchestrate multiple repository calls
- ✅ Manage transactions
- ✅ Calculations and transformations
- ✅ Dispatch domain events
- ✅ Error handling (domain errors)

**DON'T:**
- ❌ HTTP concerns (status codes, headers)
- ❌ Direct database queries (use repositories)
- ❌ Framework-specific code (Gin context)

---

### Repository Layer

**Responsibility:** Abstract data access

```go
// repositories/user_repository.go
type UserRepository interface {
    Create(ctx context.Context, user *models.User) error
    FindByID(ctx context.Context, id uint) (*models.User, error)
    FindByEmail(ctx context.Context, email string) (*models.User, error)
    Update(ctx context.Context, user *models.User) error
}

type gormUserRepository struct {
    db *gorm.DB
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
```

**DO:**
- ✅ CRUD operations
- ✅ Query building
- ✅ Soft delete logic
- ✅ Data filtering
- ✅ ORM-specific code

**DON'T:**
- ❌ Business logic
- ❌ Transactions (use UnitOfWork)
- ❌ Validation
- ❌ External service calls

---

## Data Flow

### Example: User Registration

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. HTTP Request                              │
│  POST /api/users/register                                       │
│  {                                                              │
│    "email": "user@example.com",                                 │
│    "password": "SecurePass123",                                 │
│    "name": "John Doe"                                           │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              2. Controller (HTTP Layer)                         │
│  UserController.Register(c *gin.Context)                        │
│                                                                 │
│  • Bind JSON to RegisterRequest DTO                             │
│  • Basic validation (required fields)                           │
│  • Extract context                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              3. Service Layer (Business Logic)                  │
│  UserService.Register(ctx, req)                                 │
│                                                                 │
│  Step 1: Business validation                                    │
│    • Email format check                                         │
│    • Password strength check                                    │
│                                                                 │
│  Step 2: Check duplicate (via repository)                       │
│    user, _ := s.userRepo.FindByEmail(email)                     │
│    if user != nil { return ErrEmailExists }                     │
│                                                                 │
│  Step 3: Prepare data                                           │
│    • Hash password: bcrypt(password)                            │
│    • Generate OTP: random 6 digits                              │
│                                                                 │
│  Step 4: Transaction                                            │
│    s.uow.Transaction(func() {                                   │
│      // Create user                                             │
│      s.userRepo.Create(user)                                    │
│      // Create finance record                                   │
│      s.financeRepo.Create(finance)                              │
│    })                                                           │
│                                                                 │
│  Step 5: Dispatch event                                         │
│    s.eventBus.Dispatch(UserRegisteredEvent)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌──────────────┐
│4a. UnitOfWork│ │4b. Event Bus│ │4c. Repo Layer│
│             │ │             │ │              │
│ Begin TX    │ │ Async       │ │ SQL INSERT   │
│ Execute     │ │ listeners   │ │ queries      │
│ Commit/     │ │             │ │              │
│ Rollback    │ │ • Email     │ │ GORM to DB   │
│             │ │ • Audit log │ │              │
└─────────────┘ └─────────────┘ └──────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              5. Repository Layer (Data Access)                  │
│  UserRepository.Create(user)                                    │
│                                                                 │
│  db.Create(&models.User{                                        │
│    Email: "user@example.com",                                   │
│    Password: "$2a$10$hashed...",                                │
│    OTP: 123456,                                                 │
│    Status: "pending_verification",                              │
│  })                                                             │
│                                                                 │
│  FinanceRepository.Create(finance)                              │
│                                                                 │
│  db.Create(&models.Finance{                                     │
│    UserID: user.ID,                                             │
│    TotalBalance: 0,                                             │
│  })                                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    6. Database (PostgreSQL)                     │
│  INSERT INTO users (...) VALUES (...)                           │
│  INSERT INTO finance (...) VALUES (...)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              7. Return to Service Layer                         │
│  • Transaction committed                                        │
│  • User object with ID returned                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              8. Return to Controller                            │
│  • Map User entity to UserResponse DTO                          │
│  • Exclude sensitive fields (password, OTP)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              9. HTTP Response                                   │
│  HTTP 201 Created                                               │
│  {                                                              │
│    "status": "success",                                         │
│    "message": "User registered successfully",                   │
│    "data": {                                                    │
│      "id": 123,                                                 │
│      "email": "user@example.com",                               │
│      "name": "John Doe"                                         │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              10. Async Event Processing (Parallel)              │
│                                                                 │
│  EmailListener.Handle(UserRegisteredEvent)                      │
│    • Send welcome email with OTP                                │
│    • Non-blocking, doesn't affect response time                 │
│                                                                 │
│  AuditLogListener.Handle(UserRegisteredEvent)                   │
│    • Log user registration event                                │
│    • Store in audit table                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Flow Summary

| Step | Layer | Responsibility | Pattern |
|------|-------|----------------|---------|
| 1-2 | Controller | HTTP handling | Thin Controller |
| 3 | Service | Business logic | Service Layer |
| 4a | UoW | Transaction mgmt | Unit of Work |
| 4b | Events | Async tasks | Observer |
| 4c-5 | Repository | Data access | Repository |
| 6 | Database | Persistence | - |
| 7-9 | Return path | Response | DTO/Factory |
| 10 | Listeners | Side effects | Observer |

---

## File Structure

### Proposed Directory Structure

```
backend/
├── main.go                          # Entry point, wiring
│
├── cmd/
│   └── server/
│       └── main.go                  # Alternative entry point
│
├── config/
│   ├── config.go                    # Configuration structs
│   └── env.go                       # Environment loading
│
├── internal/                        # Private application code
│   │
│   ├── container/                   # Dependency Injection
│   │   └── container.go             # DI container
│   │
│   ├── domain/                      # Domain layer
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── user_dto.go
│   │   │   ├── todo_dto.go
│   │   │   └── ...
│   │   │
│   │   └── errors/                  # Domain errors
│   │       ├── errors.go
│   │       └── error_codes.go
│   │
│   ├── repositories/                # Repository pattern
│   │   ├── base_repository.go       # Generic interface
│   │   ├── gorm_base_repository.go  # GORM implementation
│   │   ├── user_repository.go
│   │   ├── todo_repository.go
│   │   ├── project_repository.go
│   │   ├── finance_repository.go
│   │   ├── transaction_repository.go
│   │   ├── savings_repository.go
│   │   ├── loans_repository.go
│   │   ├── roadmap_repository.go
│   │   ├── resource_repository.go
│   │   ├── tag_repository.go
│   │   └── note_repository.go
│   │
│   ├── services/                    # Service layer
│   │   ├── user_service.go
│   │   ├── todo_service.go
│   │   ├── project_service.go
│   │   ├── finance_service.go
│   │   ├── transaction_service.go
│   │   ├── savings_service.go
│   │   ├── loans_service.go
│   │   ├── dashboard_service.go
│   │   ├── roadmap_service.go
│   │   └── resource_service.go
│   │
│   ├── strategies/                  # Strategy pattern
│   │   ├── validation/
│   │   │   ├── strategy.go
│   │   │   ├── email_validation.go
│   │   │   ├── password_validation.go
│   │   │   └── otp_validation.go
│   │   │
│   │   └── transaction/
│   │       ├── strategy.go
│   │       ├── income_strategy.go
│   │       └── expense_strategy.go
│   │
│   ├── factories/                   # Factory pattern
│   │   ├── response_factory.go
│   │   ├── error_factory.go
│   │   └── model_factory.go
│   │
│   ├── events/                      # Observer pattern
│   │   ├── dispatcher.go
│   │   ├── event.go
│   │   ├── user_events.go
│   │   └── transaction_events.go
│   │
│   ├── listeners/                   # Event listeners
│   │   ├── email_listener.go
│   │   ├── finance_listener.go
│   │   └── audit_listener.go
│   │
│   ├── builders/                    # Builder pattern
│   │   ├── query_builder.go
│   │   └── response_builder.go
│   │
│   ├── adapters/                    # Adapter pattern
│   │   ├── email_adapter.go
│   │   ├── smtp_adapter.go
│   │   ├── storage_adapter.go
│   │   └── cache_adapter.go
│   │
│   └── decorators/                  # Decorator pattern
│       ├── logging_decorator.go
│       ├── caching_decorator.go
│       └── metrics_decorator.go
│
├── controllers/                     # HTTP handlers (thin)
│   ├── userController.go
│   ├── todoController.go
│   ├── projectController.go
│   ├── financeController.go
│   ├── transactionController.go
│   ├── savingsController.go
│   ├── loansController.go
│   ├── dashboardController.go
│   ├── roadmapController.go
│   ├── resourceController.go
│   ├── tagController.go
│   └── noteController.go
│
├── routes/                          # Route registration
│   ├── userRoute.go
│   ├── todoRoute.go
│   ├── projectRoute.go
│   ├── financeRoute.go
│   ├── transactionRoute.go
│   ├── savingsRoute.go
│   ├── loansRoute.go
│   ├── dashboardRoute.go
│   ├── roadmapRoute.go
│   ├── resourceRoute.go
│   ├── tagRoute.go
│   ├── noteRoute.go
│   └── routes.go                    # Main route setup
│
├── middleware/                      # HTTP middleware
│   ├── authorization.go
│   ├── recovery.go
│   ├── rateLimit.go
│   └── logging.go                   # New: request logging
│
├── models/                          # GORM entities
│   ├── user.go
│   ├── todo.go
│   ├── project.go
│   ├── finance.go
│   ├── transactions.go
│   ├── Savings.go
│   ├── loans.go
│   ├── roadmap.go
│   ├── tags.go
│   ├── notes.go
│   └── resources.go
│
├── database/                        # Database connection
│   ├── db.go                        # Connection setup
│   └── unit_of_work.go              # Unit of Work pattern
│
├── helper/                          # Utilities
│   ├── response.go
│   ├── jwtHelper.go
│   ├── password.go
│   └── mailHelper.go
│
├── constants/                       # Constants
│   └── constant.go
│
├── migrations/                      # SQL migrations
│   ├── 000001_create_users.up.sql
│   ├── 000001_create_users.down.sql
│   └── ...
│
├── tests/                           # Tests
│   ├── unit/                        # Unit tests
│   │   ├── services/
│   │   ├── repositories/
│   │   └── strategies/
│   │
│   ├── integration/                 # Integration tests
│   │   └── api/
│   │
│   └── mocks/                       # Mock implementations
│       ├── mock_user_repository.go
│       ├── mock_email_adapter.go
│       └── ...
│
├── docs/                            # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md              # This file
│   └── PATTERNS.md
│
├── go.mod
├── go.sum
├── .env.example
└── README.md
```

### File Count Comparison

| Category | Before | After | Change |
|----------|--------|-------|--------|
| **Controllers** | 12 files | 12 files | Same (but thinner) |
| **Services** | 0 files | 12 files | +12 |
| **Repositories** | 0 files | 15 files | +15 |
| **Patterns** | 0 files | 20 files | +20 |
| **Total** | ~57 files | ~110 files | +53 files |

**Note:** More files but each with single responsibility, better organized, and highly testable.

---

## Migration Strategy

### Phase 1: Repository Layer (Week 1-2)
- Create base repository interface
- Implement GORM base repository
- Create specific repositories for all entities
- Write repository tests
- **No breaking changes**

### Phase 2: Service Layer (Week 3-5)
- Create service interfaces
- Implement services with business logic
- Migrate logic from controllers to services
- Write service tests
- **No breaking changes** (controllers still work)

### Phase 3: DI Container (Week 6)
- Create DI container
- Refactor controllers to use injected services
- Remove global `database.DB` references
- **Minimal breaking changes** (internal only)

### Phase 4: Advanced Patterns (Week 7-10)
- Implement remaining patterns
- Refactor for optimization
- Complete test coverage
- **No breaking changes**

---

## Conclusion

This architecture transformation will:

✅ **Improve Testability** - 0% → 80% test coverage
✅ **Reduce Duplication** - 30% → <5% code duplication
✅ **Enable Scalability** - Easy to add new features
✅ **Increase Maintainability** - Clear separation of concerns
✅ **Support Team Growth** - Well-defined layers and patterns

**Investment:** 10 weeks
**ROI:** Exponential improvement in code quality, developer productivity, and system reliability

---

**Last Updated:** 2025-11-17
**Version:** 1.0
**Author:** Architecture Team
