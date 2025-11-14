package controllers

import (
	"encoding/json"
	"fintrax-backend/constants"
	"fintrax-backend/database"
	"fintrax-backend/models"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupDashboardTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto-migrate all models
	database.DB.AutoMigrate(
		&models.Finance{},
		&models.Savings{},
		&models.Loans{},
		&models.Transactions{},
		&models.Todo{},
		&models.Project{},
		&models.Roadmap{},
		&models.Users{},
	)
}

func TestGetDashboard(t *testing.T) {
	setupDashboardTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("successfully fetches comprehensive dashboard data", func(t *testing.T) {
		userID := 1

		// Create finance data
		finance := models.Finance{
			Balance:   15000.00,
			TotalDebt: 3000.00,
			UserID:    uint(userID),
			Status:    1,
		}
		database.DB.Create(&finance)

		// Create savings
		savings1 := models.Savings{
			Name:         "Emergency Fund",
			Amount:       5000.00,
			TargetAmount: 10000.00,
			Rate:         3.0,
			UserID:       uint(userID),
			Status:       constants.STATUS_IN_PROGRESS,
		}
		savings2 := models.Savings{
			Name:         "Vacation",
			Amount:       2000.00,
			TargetAmount: 5000.00,
			Rate:         2.0,
			UserID:       uint(userID),
			Status:       constants.STATUS_IN_PROGRESS,
		}
		database.DB.Create(&savings1)
		database.DB.Create(&savings2)

		// Create loans
		loan := models.Loans{
			Name:          "Home Loan",
			TotalAmount:   100000.00,
			Rate:          4.5,
			Term:          1,
			Duration:      240,
			PremiumAmount: 500.00,
			UserID:        uint(userID),
			Status:        constants.STATUS_IN_PROGRESS,
		}
		database.DB.Create(&loan)

		// Create transactions
		income := models.Transactions{
			Source:   "Salary",
			Amount:   75000.00,
			Type:     1,
			Category: "Income",
			Date:     time.Now(),
			UserID:   uint(userID),
			Status:   constants.STATUS_NOT_STARTED,
		}
		expense1 := models.Transactions{
			Source:   "Groceries",
			Amount:   5000.00,
			Type:     2,
			Category: "Food",
			Date:     time.Now(),
			UserID:   uint(userID),
			Status:   constants.STATUS_NOT_STARTED,
		}
		expense2 := models.Transactions{
			Source:   "Utilities",
			Amount:   3000.00,
			Type:     2,
			Category: "Bills",
			Date:     time.Now(),
			UserID:   uint(userID),
			Status:   constants.STATUS_NOT_STARTED,
		}
		database.DB.Create(&income)
		database.DB.Create(&expense1)
		database.DB.Create(&expense2)

		// Create todos
		todo1 := models.Todo{
			Task:        "Complete project",
			Description: "Finish Sprint 1",
			Priority:    1,
			Status:      constants.STATUS_IN_PROGRESS,
			UserID:      uint(userID),
		}
		todo2 := models.Todo{
			Task:        "Review code",
			Description: "Code review",
			Priority:    2,
			Status:      constants.STATUS_NOT_STARTED,
			UserID:      uint(userID),
		}
		database.DB.Create(&todo1)
		database.DB.Create(&todo2)

		// Create projects
		project1 := models.Project{
			Name:        "Fintrax",
			Description: "Finance tracking app",
			Status:      constants.STATUS_IN_PROGRESS,
			UserID:      uint(userID),
		}
		project2 := models.Project{
			Name:        "Portfolio",
			Description: "Personal portfolio",
			Status:      constants.STATUS_NOT_STARTED,
			UserID:      uint(userID),
		}
		database.DB.Create(&project1)
		database.DB.Create(&project2)

		// Create roadmaps
		roadmap1 := models.Roadmap{
			Name:      "Q1 Goals",
			StartDate: time.Now(),
			EndDate:   time.Now().AddDate(0, 3, 0),
			Progress:  25.0,
			Status:    1,
		}
		roadmap2 := models.Roadmap{
			Name:      "Q2 Goals",
			StartDate: time.Now(),
			EndDate:   time.Now().AddDate(0, 3, 0),
			Progress:  10.0,
			Status:    1,
		}
		database.DB.Create(&roadmap1)
		database.DB.Create(&roadmap2)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/dashboard", nil)
		c.Set("user_id", userID)

		GetDashboard(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Dashboard retrieved successfully", response["message"])

		data := response["data"].(map[string]interface{})

		// Verify financial data
		assert.Equal(t, 15000.00, data["total_balance"])
		assert.Equal(t, 3000.00, data["total_debt"])
		assert.Equal(t, 7000.00, data["total_savings"])
		assert.Equal(t, 100000.00, data["total_loans"])
		assert.Equal(t, 75000.00, data["total_income"])
		assert.Equal(t, 8000.00, data["total_expense"])

		// Net worth = balance + savings - debt - loans
		// = 15000 + 7000 - 3000 - 100000 = -81000
		assert.Equal(t, -81000.00, data["net_worth"])

		// Verify project management data
		assert.Equal(t, float64(2), data["total_todo"])
		assert.Equal(t, float64(2), data["total_projects"])
		assert.Equal(t, float64(2), data["active_roadmaps"])
	})

	t.Run("handles user with no data", func(t *testing.T) {
		setupDashboardTestDB() // Reset DB

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/dashboard", nil)
		c.Set("user_id", 999) // User with no data

		GetDashboard(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})

		// All values should be 0
		assert.Equal(t, 0.0, data["total_balance"])
		assert.Equal(t, 0.0, data["total_debt"])
		assert.Equal(t, 0.0, data["total_savings"])
		assert.Equal(t, 0.0, data["total_loans"])
		assert.Equal(t, 0.0, data["total_income"])
		assert.Equal(t, 0.0, data["total_expense"])
		assert.Equal(t, 0.0, data["net_worth"])
		assert.Equal(t, float64(0), data["total_todo"])
		assert.Equal(t, float64(0), data["total_projects"])
	})

	t.Run("excludes deleted items from dashboard", func(t *testing.T) {
		setupDashboardTestDB()

		userID := 1

		// Create active items
		activeSavings := models.Savings{
			Name:         "Active Savings",
			Amount:       1000.00,
			TargetAmount: 5000.00,
			Rate:         3.0,
			UserID:       uint(userID),
			Status:       constants.STATUS_IN_PROGRESS,
		}
		activeTodo := models.Todo{
			Task:        "Active Todo",
			Description: "Active task",
			Priority:    1,
			Status:      constants.STATUS_IN_PROGRESS,
			UserID:      uint(userID),
		}

		// Create deleted items
		deletedSavings := models.Savings{
			Name:         "Deleted Savings",
			Amount:       500.00,
			TargetAmount: 2000.00,
			Rate:         2.0,
			UserID:       uint(userID),
			Status:       constants.STATUS_DELETED,
		}
		deletedTodo := models.Todo{
			Task:        "Deleted Todo",
			Description: "Deleted task",
			Priority:    1,
			Status:      constants.STATUS_DELETED,
			UserID:      uint(userID),
		}

		database.DB.Create(&activeSavings)
		database.DB.Create(&activeTodo)
		database.DB.Create(&deletedSavings)
		database.DB.Create(&deletedTodo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/dashboard", nil)
		c.Set("user_id", userID)

		GetDashboard(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})

		// Should only count active items
		assert.Equal(t, 1000.00, data["total_savings"])
		assert.Equal(t, float64(1), data["total_todo"])
	})

	t.Run("counts only active roadmaps", func(t *testing.T) {
		setupDashboardTestDB()

		// Create active and inactive roadmaps
		activeRoadmap1 := models.Roadmap{
			Name:      "Active 1",
			StartDate: time.Now(),
			EndDate:   time.Now().AddDate(0, 3, 0),
			Progress:  50.0,
			Status:    1,
		}
		activeRoadmap2 := models.Roadmap{
			Name:      "Active 2",
			StartDate: time.Now(),
			EndDate:   time.Now().AddDate(0, 3, 0),
			Progress:  30.0,
			Status:    1,
		}
		inactiveRoadmap := models.Roadmap{
			Name:      "Inactive",
			StartDate: time.Now(),
			EndDate:   time.Now().AddDate(0, 3, 0),
			Progress:  10.0,
			Status:    2,
		}

		database.DB.Create(&activeRoadmap1)
		database.DB.Create(&activeRoadmap2)
		database.DB.Create(&inactiveRoadmap)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/dashboard", nil)
		c.Set("user_id", 1)

		GetDashboard(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})

		// Should only count active roadmaps (status = 1)
		assert.Equal(t, float64(2), data["active_roadmaps"])
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/dashboard", nil)
		// No user_id set

		GetDashboard(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("calculates net worth correctly with complex data", func(t *testing.T) {
		setupDashboardTestDB()

		userID := 1

		finance := models.Finance{
			Balance:   50000.00,
			TotalDebt: 10000.00,
			UserID:    uint(userID),
			Status:    1,
		}
		database.DB.Create(&finance)

		// Multiple savings
		for i := 0; i < 3; i++ {
			savings := models.Savings{
				Name:         "Savings",
				Amount:       5000.00,
				TargetAmount: 10000.00,
				Rate:         3.0,
				UserID:       uint(userID),
				Status:       constants.STATUS_IN_PROGRESS,
			}
			database.DB.Create(&savings)
		}

		// Multiple loans
		for i := 0; i < 2; i++ {
			loan := models.Loans{
				Name:          "Loan",
				TotalAmount:   20000.00,
				Rate:          5.0,
				Term:          1,
				Duration:      60,
				PremiumAmount: 400.00,
				UserID:        uint(userID),
				Status:        constants.STATUS_IN_PROGRESS,
			}
			database.DB.Create(&loan)
		}

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/dashboard", nil)
		c.Set("user_id", userID)

		GetDashboard(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})

		// Total savings = 3 * 5000 = 15000
		// Total loans = 2 * 20000 = 40000
		// Net worth = 50000 + 15000 - 10000 - 40000 = 15000
		assert.Equal(t, 15000.00, data["total_savings"])
		assert.Equal(t, 40000.00, data["total_loans"])
		assert.Equal(t, 15000.00, data["net_worth"])
	})
}
