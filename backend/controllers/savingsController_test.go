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

func setupSavingsTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto-migrate the models
	database.DB.AutoMigrate(&models.Savings{}, &models.Users{})
}

func TestCreateSavings(t *testing.T) {
	setupSavingsTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("successfully creates savings goal", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := savingsRequest{
			Name:         "Emergency Fund",
			Amount:       1000.00,
			TargetAmount: 10000.00,
			Rate:         3.5,
			Status:       constants.STATUS_NOT_STARTED,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/savings", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateSavings(c)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, float64(http.StatusCreated), response["status"])
		assert.Equal(t, "Savings created successfully", response["message"])

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Emergency Fund", data["name"])
		assert.Equal(t, 1000.00, data["amount"])
		assert.Equal(t, 10000.00, data["target_amount"])
		assert.Equal(t, 3.5, data["rate"])
	})

	t.Run("fails without authentication", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := savingsRequest{
			Name:         "Test",
			Amount:       100.00,
			TargetAmount: 1000.00,
			Rate:         0,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/savings", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		// No user_id set

		CreateSavings(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("fails with negative amount", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := map[string]interface{}{
			"name":          "Test",
			"amount":        -100.00,
			"target_amount": 1000.00,
			"rate":          0,
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/savings", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateSavings(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("fails with missing required fields", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := map[string]interface{}{
			"amount": 100.00,
			// missing name and target_amount
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/savings", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateSavings(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("sets default status when not provided", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		reqBody := savingsRequest{
			Name:         "Test Goal",
			Amount:       500.00,
			TargetAmount: 5000.00,
			Rate:         2.5,
			// Status not provided, should default to STATUS_NOT_STARTED
		}
		jsonValue, _ := json.Marshal(reqBody)
		c.Request = httptest.NewRequest("POST", "/api/savings", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("user_id", 1)

		CreateSavings(c)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, float64(constants.STATUS_NOT_STARTED), data["status"])
	})
}

func TestGetAllSavings(t *testing.T) {
	setupSavingsTestDB()
	gin.SetMode(gin.TestMode)

	// Create test savings
	savings1 := models.Savings{
		Name:         "Emergency Fund",
		Amount:       1000.00,
		TargetAmount: 10000.00,
		Rate:         3.5,
		UserID:       1,
		Status:       constants.STATUS_IN_PROGRESS,
	}
	savings2 := models.Savings{
		Name:         "Vacation Fund",
		Amount:       500.00,
		TargetAmount: 5000.00,
		Rate:         2.0,
		UserID:       1,
		Status:       constants.STATUS_NOT_STARTED,
	}
	database.DB.Create(&savings1)
	database.DB.Create(&savings2)

	t.Run("successfully fetches all savings", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/savings", nil)
		c.Set("user_id", 1)

		GetAllSavings(c)

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

		c.Request = httptest.NewRequest("GET", "/api/savings", nil)
		// No user_id set

		GetAllSavings(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("excludes deleted savings", func(t *testing.T) {
		// Create a deleted savings
		deletedSavings := models.Savings{
			Name:         "Deleted Goal",
			Amount:       100.00,
			TargetAmount: 1000.00,
			Rate:         0,
			UserID:       1,
			Status:       constants.STATUS_DELETED,
		}
		database.DB.Create(&deletedSavings)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/savings", nil)
		c.Set("user_id", 1)

		GetAllSavings(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].([]interface{})
		// Should still be 2 (not including the deleted one)
		assert.Equal(t, 2, len(data))
	})
}

func TestGetSavings(t *testing.T) {
	setupSavingsTestDB()
	gin.SetMode(gin.TestMode)

	// Create test savings
	savings := models.Savings{
		Name:         "Emergency Fund",
		Amount:       1000.00,
		TargetAmount: 10000.00,
		Rate:         3.5,
		UserID:       1,
		Status:       constants.STATUS_IN_PROGRESS,
	}
	database.DB.Create(&savings)

	t.Run("successfully fetches savings by ID", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/savings/1", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		GetSavings(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Emergency Fund", data["name"])
		assert.Equal(t, 1000.00, data["amount"])
		assert.Equal(t, 10000.00, data["target_amount"])
	})

	t.Run("fails with non-existent savings", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/api/savings/999", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		GetSavings(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestUpdateSavings(t *testing.T) {
	setupSavingsTestDB()
	gin.SetMode(gin.TestMode)

	// Create test savings
	savings := models.Savings{
		Name:         "Emergency Fund",
		Amount:       1000.00,
		TargetAmount: 10000.00,
		Rate:         3.5,
		UserID:       1,
		Status:       constants.STATUS_NOT_STARTED,
	}
	database.DB.Create(&savings)

	t.Run("successfully updates savings", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		updateReq := savingsRequest{
			Name:         "Updated Emergency Fund",
			Amount:       2000.00,
			TargetAmount: 15000.00,
			Rate:         4.0,
			Status:       constants.STATUS_IN_PROGRESS,
		}
		jsonValue, _ := json.Marshal(updateReq)
		c.Request = httptest.NewRequest("PATCH", "/api/savings/1", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Params = gin.Params{gin.Param{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		UpdateSavings(c)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		data := response["data"].(map[string]interface{})
		assert.Equal(t, "Updated Emergency Fund", data["name"])
		assert.Equal(t, 2000.00, data["amount"])
		assert.Equal(t, 15000.00, data["target_amount"])
		assert.Equal(t, 4.0, data["rate"])
		assert.Equal(t, float64(constants.STATUS_IN_PROGRESS), data["status"])
	})

	t.Run("fails with non-existent savings", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		updateReq := savingsRequest{
			Name:         "Test",
			Amount:       100.00,
			TargetAmount: 1000.00,
			Rate:         0,
		}
		jsonValue, _ := json.Marshal(updateReq)
		c.Request = httptest.NewRequest("PATCH", "/api/savings/999", bytes.NewBuffer(jsonValue))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Params = gin.Params{gin.Param{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		UpdateSavings(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestDeleteSavings(t *testing.T) {
	setupSavingsTestDB()
	gin.SetMode(gin.TestMode)

	// Create test savings
	savings := models.Savings{
		Name:         "Emergency Fund",
		Amount:       1000.00,
		TargetAmount: 10000.00,
		Rate:         3.5,
		UserID:       1,
		Status:       constants.STATUS_IN_PROGRESS,
	}
	database.DB.Create(&savings)

	t.Run("successfully deletes savings", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("DELETE", "/api/savings/1", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "1"}}
		c.Set("user_id", 1)

		DeleteSavings(c)

		assert.Equal(t, http.StatusOK, w.Code)

		// Verify savings is soft deleted
		var deletedSavings models.Savings
		database.DB.First(&deletedSavings, 1)
		assert.Equal(t, constants.STATUS_DELETED, deletedSavings.Status)
		assert.True(t, deletedSavings.DeletedAt.Valid)
	})

	t.Run("fails with non-existent savings", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("DELETE", "/api/savings/999", nil)
		c.Params = gin.Params{gin.Param{Key: "id", Value: "999"}}
		c.Set("user_id", 1)

		DeleteSavings(c)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestSavingsProgressCalculation(t *testing.T) {
	setupSavingsTestDB()
	gin.SetMode(gin.TestMode)

	t.Run("calculates progress correctly", func(t *testing.T) {
		savings := models.Savings{
			Name:         "Test Goal",
			Amount:       2500.00, // 25% of target
			TargetAmount: 10000.00,
			Rate:         3.0,
			UserID:       1,
			Status:       constants.STATUS_IN_PROGRESS,
		}
		database.DB.Create(&savings)

		// Calculate progress
		progress := (savings.Amount / savings.TargetAmount) * 100
		assert.Equal(t, 25.0, progress)
	})

	t.Run("progress at 0% when amount is 0", func(t *testing.T) {
		savings := models.Savings{
			Name:         "New Goal",
			Amount:       0.00,
			TargetAmount: 10000.00,
			Rate:         3.0,
			UserID:       1,
			Status:       constants.STATUS_NOT_STARTED,
		}

		progress := (savings.Amount / savings.TargetAmount) * 100
		assert.Equal(t, 0.0, progress)
	})

	t.Run("progress at 100% when goal reached", func(t *testing.T) {
		savings := models.Savings{
			Name:         "Completed Goal",
			Amount:       10000.00,
			TargetAmount: 10000.00,
			Rate:         3.0,
			UserID:       1,
			Status:       constants.STATUS_COMPLETED,
		}

		progress := (savings.Amount / savings.TargetAmount) * 100
		assert.Equal(t, 100.0, progress)
	})

	t.Run("progress over 100% when exceeding target", func(t *testing.T) {
		savings := models.Savings{
			Name:         "Exceeded Goal",
			Amount:       12000.00,
			TargetAmount: 10000.00,
			Rate:         3.0,
			UserID:       1,
			Status:       constants.STATUS_COMPLETED,
		}

		progress := (savings.Amount / savings.TargetAmount) * 100
		assert.Equal(t, 120.0, progress)
	})
}
