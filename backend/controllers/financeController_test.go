package controllers

import (
	"bytes"
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

func setupFinanceTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto-migrate the models
	database.DB.AutoMigrate(&models.Finance{}, &models.Savings{}, &models.Loans{}, &models.Transactions{}, &models.Users{})
}

func TestGetFinance(t *testing.T) {
	setupFinanceTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("successfully fetches existing finance data", func(t *testing.T) {
		// Create test finance data
		finance := models.Finance{
			Balance:   5000.00,
			TotalDebt: 2000.00,
			UserID:    1,
			Status:    1,
		}
		database.DB.Create(&finance)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/finance", nil)
		c.Set("user_id", 1)

		GetFinance(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, 5000.00, data["balance"])
		assert.Equal(t, 2000.00, data["total_debt"])
	})

	t.Run("creates default finance when none exists", func(t *testing.T) {
		setupFinanceTestDB() // Reset DB

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/finance", nil)
		c.Set("user_id", 2) // Different user with no finance record

		GetFinance(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, 0.0, data["balance"])
		assert.Equal(t, 0.0, data["total_debt"])
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/finance", nil)
		// No user_id set

		GetFinance(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestUpdateFinance(t *testing.T) {
	setupFinanceTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("successfully updates existing finance", func(t *testing.T) {
		// Create test finance data
		finance := models.Finance{
			Balance:   5000.00,
			TotalDebt: 2000.00,
			UserID:    1,
			Status:    1,
		}
		database.DB.Create(&finance)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		updateReq := financeRequest{
			Balance:   7500.00,
			TotalDebt: 1500.00,
		}
		jsonValue, _ := json.Marshal(updateReq)
		c.Request = httptest.NewRequest("PATCH", "/api/finance", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		UpdateFinance(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, 7500.00, data["balance"])
		assert.Equal(t, 1500.00, data["total_debt"])
	})

	t.Run("creates finance when none exists", func(t *testing.T) {
		setupFinanceTestDB() // Reset DB

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		updateReq := financeRequest{
			Balance:   10000.00,
			TotalDebt: 3000.00,
		}
		jsonValue, _ := json.Marshal(updateReq)
		c.Request = httptest.NewRequest("PATCH", "/api/finance", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 2)

		UpdateFinance(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, 10000.00, data["balance"])
		assert.Equal(t, 3000.00, data["total_debt"])
	})

	t.Run("fails with invalid request", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		invalidReq := map[string]interface{}{
			"balance": "invalid", // Should be number
		}
		jsonValue, _ := json.Marshal(invalidReq)
		c.Request = httptest.NewRequest("PATCH", "/api/finance", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		UpdateFinance(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		updateReq := financeRequest{
			Balance:   5000.00,
			TotalDebt: 1000.00,
		}
		jsonValue, _ := json.Marshal(updateReq)
		c.Request = httptest.NewRequest("PATCH", "/api/finance", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		// No user_id set

		UpdateFinance(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestGetFinanceSummary(t *testing.T) {
	setupFinanceTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("successfully calculates comprehensive finance summary", func(t *testing.T) {
		// Create finance data
		finance := models.Finance{
			Balance:   10000.00,
			TotalDebt: 2000.00,
			UserID:    1,
			Status:    1,
		}
		database.DB.Create(&finance)

		// Create savings
		savings1 := models.Savings{
			Name:         "Emergency Fund",
			Amount:       5000.00,
			TargetAmount: 10000.00,
			Rate:         3.0,
			UserID:       1,
			Status:       constants.STATUS_IN_PROGRESS,
		}
		savings2 := models.Savings{
			Name:         "Vacation Fund",
			Amount:       2000.00,
			TargetAmount: 5000.00,
			Rate:         2.0,
			UserID:       1,
			Status:       constants.STATUS_IN_PROGRESS,
		}
		database.DB.Create(&savings1)
		database.DB.Create(&savings2)

		// Create loans
		loan := models.Loans{
			Name:          "Car Loan",
			TotalAmount:   15000.00,
			Rate:          5.5,
			Term:          1,
			Duration:      60,
			PremiumAmount: 300.00,
			UserID:        1,
			Status:        constants.STATUS_IN_PROGRESS,
		}
		database.DB.Create(&loan)

		// Create transactions
		income := models.Transactions{
			Source:   "Salary",
			Amount:   50000.00,
			Type:     1,
			Category: "Income",
			Date:     time.Now(),
			UserID:   1,
			Status:   constants.STATUS_NOT_STARTED,
		}
		expense := models.Transactions{
			Source:   "Groceries",
			Amount:   5000.00,
			Type:     2,
			Category: "Food",
			Date:     time.Now(),
			UserID:   1,
			Status:   constants.STATUS_NOT_STARTED,
		}
		database.DB.Create(&income)
		database.DB.Create(&expense)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/finance/summary", nil)
		c.Set("user_id", 1)

		GetFinanceSummary(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})

		// Verify calculations
		assert.Equal(t, 10000.00, data["balance"])
		assert.Equal(t, 2000.00, data["total_debt"])
		assert.Equal(t, 7000.00, data["total_savings"]) // 5000 + 2000
		assert.Equal(t, 15000.00, data["total_loans"])
		assert.Equal(t, 50000.00, data["total_income"])
		assert.Equal(t, 5000.00, data["total_expense"])

		// Net worth = balance + savings - debt - loans
		// = 10000 + 7000 - 2000 - 15000 = 0
		assert.Equal(t, 0.0, data["net_worth"])
	})

	t.Run("handles user with no financial data", func(t *testing.T) {
		setupFinanceTestDB() // Reset DB

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/finance/summary", nil)
		c.Set("user_id", 3) // User with no data

		GetFinanceSummary(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, 0.0, data["balance"])
		assert.Equal(t, 0.0, data["total_debt"])
		assert.Equal(t, 0.0, data["total_savings"])
		assert.Equal(t, 0.0, data["total_loans"])
		assert.Equal(t, 0.0, data["total_income"])
		assert.Equal(t, 0.0, data["total_expense"])
		assert.Equal(t, 0.0, data["net_worth"])
	})

	t.Run("excludes deleted items from summary", func(t *testing.T) {
		setupFinanceTestDB()

		// Create active and deleted savings
		activeSavings := models.Savings{
			Name:         "Active",
			Amount:       1000.00,
			TargetAmount: 5000.00,
			Rate:         3.0,
			UserID:       1,
			Status:       constants.STATUS_IN_PROGRESS,
		}
		deletedSavings := models.Savings{
			Name:         "Deleted",
			Amount:       500.00,
			TargetAmount: 2000.00,
			Rate:         2.0,
			UserID:       1,
			Status:       constants.STATUS_DELETED,
		}
		database.DB.Create(&activeSavings)
		database.DB.Create(&deletedSavings)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/finance/summary", nil)
		c.Set("user_id", 1)

		GetFinanceSummary(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		// Should only include active savings (1000), not deleted (500)
		assert.Equal(t, 1000.00, data["total_savings"])
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/finance/summary", nil)
		// No user_id set

		GetFinanceSummary(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestNetWorthCalculation(t *testing.T) {
	t.Run("calculates net worth correctly", func(t *testing.T) {
		balance := 10000.00
		savings := 5000.00
		debt := 2000.00
		loans := 3000.00

		netWorth := balance + savings - debt - loans
		assert.Equal(t, 10000.00, netWorth)
	})

	t.Run("negative net worth when liabilities exceed assets", func(t *testing.T) {
		balance := 1000.00
		savings := 500.00
		debt := 5000.00
		loans := 10000.00

		netWorth := balance + savings - debt - loans
		assert.Equal(t, -13500.00, netWorth)
	})

	t.Run("zero net worth when balanced", func(t *testing.T) {
		balance := 5000.00
		savings := 5000.00
		debt := 5000.00
		loans := 5000.00

		netWorth := balance + savings - debt - loans
		assert.Equal(t, 0.0, netWorth)
	})
}
