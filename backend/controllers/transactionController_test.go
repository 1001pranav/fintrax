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

func setupTransactionTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto-migrate the models
	database.DB.AutoMigrate(&models.Transactions{}, &models.Users{})
}

func TestCreateTransaction(t *testing.T) {
	setupTransactionTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("successfully creates transaction", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		// Set up request
		reqBody := transactionRequest{
			Source:          "Salary",
			Amount:          5000.00,
			Type:            1, // income
			TransactionType: 1,
			Category:        "Income",
			Date:            time.Now(),
			Status:          constants.STATUS_NOT_STARTED,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/transactions", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateTransaction(c)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, float64(http.StatusCreated), response["status"])
		assert.Equal(t, "Transaction created successfully", response["message"])

		// Verify data in response
		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Salary", data["source"])
		assert.Equal(t, 5000.00, data["amount"])
		assert.Equal(t, float64(1), data["type"])
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := transactionRequest{
			Source: "Test",
			Amount: 100.00,
			Type:   1,
			Category: "Test",
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/transactions", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		// No user_id set

		CreateTransaction(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("fails with invalid amount", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := map[string]interface{}{
			"source":   "Test",
			"amount":   -100.00, // negative amount
			"type":     1,
			"category": "Test",
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/transactions", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateTransaction(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("fails with missing required fields", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := map[string]interface{}{
			"amount": 100.00,
			// missing source and category
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/transactions", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateTransaction(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestGetAllTransactions(t *testing.T) {
	setupTransactionTestDB()
	gin.SetMode(gin.TestMode)

	// Create test transactions
	transaction1 := models.Transactions{
		Source:   "Salary",
		Amount:   5000.00,
		Type:     1,
		Category: "Income",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	transaction2 := models.Transactions{
		Source:   "Groceries",
		Amount:   200.00,
		Type:     2,
		Category: "Food",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	database.DB.Create(&transaction1)
	database.DB.Create(&transaction2)

	t.Run("successfully fetches all transactions", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/transactions", nil)
		c.Set("user_id", 1)

		GetAllTransactions(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].([]interface{})
		assert.Equal(t, 2, len(data))
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/transactions", nil)
		// No user_id set

		GetAllTransactions(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestGetTransaction(t *testing.T) {
	setupTransactionTestDB()
	gin.SetMode(gin.TestMode)

	// Create test transaction
	transaction := models.Transactions{
		Source:   "Salary",
		Amount:   5000.00,
		Type:     1,
		Category: "Income",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	database.DB.Create(&transaction)

	t.Run("successfully fetches transaction by ID", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/transactions/1", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		GetTransaction(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Salary", data["source"])
		assert.Equal(t, 5000.00, data["amount"])
	})

	t.Run("fails with non-existent transaction", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/transactions/999", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		GetTransaction(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestUpdateTransaction(t *testing.T) {
	setupTransactionTestDB()
	gin.SetMode(gin.TestMode)

	// Create test transaction
	transaction := models.Transactions{
		Source:   "Salary",
		Amount:   5000.00,
		Type:     1,
		Category: "Income",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	database.DB.Create(&transaction)

	t.Run("successfully updates transaction", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		updateReq := transactionRequest{
			Source:          "Updated Salary",
			Amount:          6000.00,
			Type:            1,
			TransactionType: 1,
			Category:        "Income",
			Date:            time.Now(),
			Status:          constants.STATUS_IN_PROGRESS,
		}
		jsonValue, _ := json.Marshal(updateReq)
		c.Request = httptest.NewRequest("PATCH", "/api/transactions/1", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Params = gin.Params{gin.Param{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		UpdateTransaction(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Updated Salary", data["source"])
		assert.Equal(t, 6000.00, data["amount"])
	})

	t.Run("fails with non-existent transaction", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		updateReq := transactionRequest{
			Source:   "Test",
			Amount:   100.00,
			Type:     1,
			Category: "Test",
		}
		jsonValue, _ := json.Marshal(updateReq)
		c.Request = httptest.NewRequest("PATCH", "/api/transactions/999", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Params = gin.Params{gin.Param{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		UpdateTransaction(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestDeleteTransaction(t *testing.T) {
	setupTransactionTestDB()
	gin.SetMode(gin.TestMode)

	// Create test transaction
	transaction := models.Transactions{
		Source:   "Salary",
		Amount:   5000.00,
		Type:     1,
		Category: "Income",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	database.DB.Create(&transaction)

	t.Run("successfully deletes transaction", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("DELETE", "/api/transactions/1", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		DeleteTransaction(c)

		assert.Equal(t, http.StatusOK, w.Code)

		// Verify transaction is soft deleted
		var deletedTransaction models.Transactions
		database.DB.First(&deletedTransaction, 1)
		assert.Equal(t, constants.STATUS_DELETED, deletedTransaction.Status)
	})

	t.Run("fails with non-existent transaction", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("DELETE", "/api/transactions/999", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		DeleteTransaction(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestGetTransactionSummary(t *testing.T) {
	setupTransactionTestDB()
	gin.SetMode(gin.TestMode)

	// Create test transactions
	income := models.Transactions{
		Source:   "Salary",
		Amount:   5000.00,
		Type:     1,
		Category: "Salary",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	expense1 := models.Transactions{
		Source:   "Groceries",
		Amount:   200.00,
		Type:     2,
		Category: "Food",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	expense2 := models.Transactions{
		Source:   "More Groceries",
		Amount:   150.00,
		Type:     2,
		Category: "Food",
		Date:     time.Now(),
		UserID:   1,
		Status:   constants.STATUS_NOT_STARTED,
	}
	database.DB.Create(&income)
	database.DB.Create(&expense1)
	database.DB.Create(&expense2)

	t.Run("successfully fetches transaction summary", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/transactions/summary", nil)
		c.Set("user_id", 1)

		GetTransactionSummary(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].([]interface{})
		assert.GreaterOrEqual(t, len(data), 2) // At least 2 categories (Salary and Food)
	})
}
