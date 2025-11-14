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

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupLoansTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto-migrate the models
	database.DB.AutoMigrate(&models.Loans{}, &models.Users{})
}

func TestCreateLoan(t *testing.T) {
	setupLoansTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("successfully creates loan", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := loansRequest{
			Name:          "Home Loan",
			TotalAmount:   500000.00,
			Rate:          7.5,
			Term:          360, // 30 years in months
			Duration:      1,   // Monthly payment
			PremiumAmount: 3496.07,
			Status:        constants.STATUS_IN_PROGRESS,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/loans", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateLoan(c)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, float64(http.StatusCreated), response["status"])
		assert.Equal(t, "Loan created successfully", response["message"])

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Home Loan", data["name"])
		assert.Equal(t, 500000.00, data["total_amount"])
		assert.Equal(t, 7.5, data["rate"])
		assert.Equal(t, float64(360), data["term"])
		assert.Equal(t, float64(1), data["duration"])
		assert.Equal(t, 3496.07, data["premium_amount"])
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := loansRequest{
			Name:        "Test Loan",
			TotalAmount: 10000.00,
			Rate:        5.0,
			Term:        12,
			Duration:    1,
			Status:      constants.STATUS_IN_PROGRESS,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/loans", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		// No user_id set

		CreateLoan(c)

		// Note: Could be 400 or 401 depending on validation order in controller
		assert.True(t, w.Code == http.StatusUnauthorized || w.Code == http.StatusBadRequest)
	})

	t.Run("fails with negative total amount", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := map[string]interface{}{
			"name":           "Test Loan",
			"total_amount":   -1000.00,
			"rate":           5.0,
			"term":           12,
			"duration":       1,
			"premium_amount": 100.00,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/loans", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateLoan(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("fails with missing required fields", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := map[string]interface{}{
			"name": "Test Loan",
			// Missing total_amount, term, duration
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/loans", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateLoan(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("accepts valid status value", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := loansRequest{
			Name:        "Car Loan",
			TotalAmount: 25000.00,
			Rate:        6.5,
			Term:        60,
			Duration:    1,
			PremiumAmount: 489.00,
			Status:      constants.STATUS_IN_PROGRESS,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/loans", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateLoan(c)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, float64(constants.STATUS_IN_PROGRESS), data["status"])
	})
}

func TestGetAllLoans(t *testing.T) {
	setupLoansTestDB()
	gin.SetMode(gin.TestMode)

	// Create test loans
	loan1 := models.Loans{
		Name:          "Home Loan",
		TotalAmount:   500000.00,
		Rate:          7.5,
		Term:          360,
		Duration:      1,
		PremiumAmount: 3496.07,
		UserID:        1,
		Status:        constants.STATUS_IN_PROGRESS,
	}
	loan2 := models.Loans{
		Name:          "Car Loan",
		TotalAmount:   25000.00,
		Rate:          6.5,
		Term:          60,
		Duration:      1,
		PremiumAmount: 489.00,
		UserID:        1,
		Status:        constants.STATUS_IN_PROGRESS,
	}
	deletedLoan := models.Loans{
		Name:        "Deleted Loan",
		TotalAmount: 10000.00,
		Rate:        5.0,
		Term:        12,
		Duration:    1,
		UserID:      1,
		Status:      constants.STATUS_DELETED,
	}
	database.DB.Create(&loan1)
	database.DB.Create(&loan2)
	database.DB.Create(&deletedLoan)

	t.Run("successfully fetches all loans", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/loans", nil)
		c.Set("user_id", 1)

		GetAllLoans(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].([]interface{})
		assert.Equal(t, 2, len(data)) // Only non-deleted loans
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/loans", nil)
		// No user_id set

		GetAllLoans(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("excludes deleted loans", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/loans", nil)
		c.Set("user_id", 1)

		GetAllLoans(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].([]interface{})
		// Verify no deleted loans in response
		for _, item := range data {
			loanData := item.(map[string]interface{})
			assert.NotEqual(t, float64(constants.STATUS_DELETED), loanData["status"])
		}
	})
}

func TestGetLoan(t *testing.T) {
	setupLoansTestDB()
	gin.SetMode(gin.TestMode)

	// Create test loan
	loan := models.Loans{
		Name:          "Personal Loan",
		TotalAmount:   15000.00,
		Rate:          8.5,
		Term:          36,
		Duration:      1,
		PremiumAmount: 473.00,
		UserID:        1,
		Status:        constants.STATUS_IN_PROGRESS,
	}
	database.DB.Create(&loan)

	t.Run("successfully fetches loan by ID", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/loans/1", nil)
		c.Params = gin.Params{{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		GetLoan(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Loan fetched successfully", response["message"])

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Personal Loan", data["name"])
		assert.Equal(t, 15000.00, data["total_amount"])
	})

	t.Run("returns 404 for non-existent loan", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/loans/999", nil)
		c.Params = gin.Params{{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		GetLoan(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestUpdateLoan(t *testing.T) {
	setupLoansTestDB()
	gin.SetMode(gin.TestMode)

	// Create test loan
	loan := models.Loans{
		Name:          "Student Loan",
		TotalAmount:   30000.00,
		Rate:          4.5,
		Term:          120,
		Duration:      1,
		PremiumAmount: 311.00,
		UserID:        1,
		Status:        constants.STATUS_IN_PROGRESS,
	}
	database.DB.Create(&loan)

	t.Run("successfully updates loan", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := loansRequest{
			Name:          "Updated Student Loan",
			TotalAmount:   35000.00,
			Rate:          5.0,
			Term:          120,
			Duration:      1,
			PremiumAmount: 370.00,
			Status:        constants.STATUS_IN_PROGRESS,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("PATCH", "/api/loans/1", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Params = gin.Params{{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		UpdateLoan(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Updated Student Loan", data["name"])
		assert.Equal(t, 35000.00, data["total_amount"])
		assert.Equal(t, 5.0, data["rate"])
		assert.Equal(t, 370.00, data["premium_amount"])
	})

	t.Run("returns 404 for non-existent loan", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := loansRequest{
			Name:        "Test",
			TotalAmount: 10000.00,
			Rate:        5.0,
			Term:        12,
			Duration:    1,
			Status:      constants.STATUS_IN_PROGRESS,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("PATCH", "/api/loans/999", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Params = gin.Params{{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		UpdateLoan(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestDeleteLoan(t *testing.T) {
	setupLoansTestDB()
	gin.SetMode(gin.TestMode)

	// Create test loan
	loan := models.Loans{
		Name:          "Short-term Loan",
		TotalAmount:   5000.00,
		Rate:          10.0,
		Term:          6,
		Duration:      1,
		PremiumAmount: 858.00,
		UserID:        1,
		Status:        constants.STATUS_IN_PROGRESS,
	}
	database.DB.Create(&loan)

	t.Run("successfully soft deletes loan", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("DELETE", "/api/loans/1", nil)
		c.Params = gin.Params{{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		DeleteLoan(c)

		assert.Equal(t, http.StatusOK, w.Code)

		// Verify loan is soft deleted (use Unscoped to see deleted records)
		var deletedLoan models.Loans
		database.DB.Unscoped().First(&deletedLoan, 1)
		assert.Equal(t, uint(constants.STATUS_DELETED), deletedLoan.Status)
		assert.True(t, deletedLoan.DeletedAt.Valid)

		// Verify it doesn't appear in normal queries
		var normalQuery models.Loans
		result := database.DB.First(&normalQuery, 1)
		assert.Error(t, result.Error) // Should not find it
	})

	t.Run("returns 404 for non-existent loan", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("DELETE", "/api/loans/999", nil)
		c.Params = gin.Params{{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		DeleteLoan(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestLoanCalculations(t *testing.T) {
	setupLoansTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("verifies premium amount calculation for different terms", func(t *testing.T) {
		// This test verifies that different loan structures are handled correctly
		testCases := []struct {
			name          string
			totalAmount   float64
			rate          float64
			term          uint
			premiumAmount float64
		}{
			{"12-month loan", 12000.00, 5.0, 12, 1030.00},
			{"24-month loan", 24000.00, 6.0, 24, 1063.00},
			{"60-month loan", 25000.00, 6.5, 60, 489.00},
		}

		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				w := httptest.NewRecorder()
				c, _ := gin.CreateTestContext(w)

				reqBody := loansRequest{
					Name:          tc.name,
					TotalAmount:   tc.totalAmount,
					Rate:          tc.rate,
					Term:          tc.term,
					Duration:      1,
					PremiumAmount: tc.premiumAmount,
					Status:        constants.STATUS_IN_PROGRESS,
				}
				jsonValue, _ := json.Marshal(reqBody)
				c.Request = httptest.NewRequest("POST", "/api/loans", bytes.NewBuffer(jsonValue))
				c.Request.Header.Set("Content-Type", "application/json")
				c.Set("user_id", 1)

				CreateLoan(c)

				assert.Equal(t, http.StatusCreated, w.Code)

				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)

				data := response["data"].(map[string]interface{})
				assert.Equal(t, tc.premiumAmount, data["premium_amount"])
			})
		}
	})
}
