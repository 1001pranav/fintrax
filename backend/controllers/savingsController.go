package controllers

import (
	"fintrax-backend/constants"
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type savingsRequest struct {
	Name         string  `json:"name" binding:"required"`
	Amount       float64 `json:"amount" binding:"required,gte=0"`
	TargetAmount float64 `json:"target_amount" binding:"required,gte=0"`
	Rate         float64 `json:"rate" binding:"gte=0"`
	Status       uint    `json:"status" binding:"omitempty,gte=1,lte=6"`
}

type savingsResponse struct {
	ID           uint      `json:"saving_id"`
	Name         string    `json:"name"`
	Amount       float64   `json:"amount"`
	TargetAmount float64   `json:"target_amount"`
	Rate         float64   `json:"rate"`
	UserID       uint      `json:"user_id"`
	Status       uint      `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// CreateSavings creates a new savings goal for the authenticated user
func CreateSavings(c *gin.Context) {
	var req savingsRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	// Set default status if not provided
	if req.Status == 0 {
		req.Status = constants.STATUS_NOT_STARTED
	}

	var savings = models.Savings{
		Name:         req.Name,
		Amount:       req.Amount,
		TargetAmount: req.TargetAmount,
		Rate:         req.Rate,
		UserID:       uint(userID.(int)),
		Status:       req.Status,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&savings).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create savings", nil, err.Error())
		return
	}
	tx.Commit()

	response := savingsResponse{
		ID:           savings.ID,
		Name:         savings.Name,
		Amount:       savings.Amount,
		TargetAmount: savings.TargetAmount,
		Rate:         savings.Rate,
		UserID:       savings.UserID,
		Status:       savings.Status,
		CreatedAt:    savings.CreatedAt,
		UpdatedAt:    savings.UpdatedAt,
	}

	helper.Response(c, http.StatusCreated, "Savings created successfully", response, nil)
}

// GetAllSavings retrieves all savings goals for the authenticated user
func GetAllSavings(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var savings []models.Savings
	database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
		Order("created_at DESC").
		Find(&savings)

	response := make([]savingsResponse, len(savings))
	for i, saving := range savings {
		response[i] = savingsResponse{
			ID:           saving.ID,
			Name:         saving.Name,
			Amount:       saving.Amount,
			TargetAmount: saving.TargetAmount,
			Rate:         saving.Rate,
			UserID:       saving.UserID,
			Status:       saving.Status,
			CreatedAt:    saving.CreatedAt,
			UpdatedAt:    saving.UpdatedAt,
		}
	}

	helper.Response(c, http.StatusOK, "Savings fetched successfully", response, nil)
}

// GetSavings retrieves a specific savings goal by ID
func GetSavings(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var savings models.Savings
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&savings)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Savings not found", nil, nil)
		return
	}

	response := savingsResponse{
		ID:           savings.ID,
		Name:         savings.Name,
		Amount:       savings.Amount,
		TargetAmount: savings.TargetAmount,
		Rate:         savings.Rate,
		UserID:       savings.UserID,
		Status:       savings.Status,
		CreatedAt:    savings.CreatedAt,
		UpdatedAt:    savings.UpdatedAt,
	}

	helper.Response(c, http.StatusOK, "Savings fetched successfully", response, nil)
}

// UpdateSavings updates a specific savings goal by ID
func UpdateSavings(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var req savingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var savings models.Savings
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&savings)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Savings not found", nil, nil)
		return
	}

	// Update fields
	savings.Name = req.Name
	savings.Amount = req.Amount
	savings.TargetAmount = req.TargetAmount
	savings.Rate = req.Rate
	if req.Status != 0 {
		savings.Status = req.Status
	}

	database.DB.Save(&savings)

	response := savingsResponse{
		ID:           savings.ID,
		Name:         savings.Name,
		Amount:       savings.Amount,
		TargetAmount: savings.TargetAmount,
		Rate:         savings.Rate,
		UserID:       savings.UserID,
		Status:       savings.Status,
		CreatedAt:    savings.CreatedAt,
		UpdatedAt:    savings.UpdatedAt,
	}

	helper.Response(c, http.StatusOK, "Savings updated successfully", response, nil)
}

// DeleteSavings soft deletes a savings goal by ID
func DeleteSavings(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var savings models.Savings
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&savings)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Savings not found", nil, nil)
		return
	}

	savings.Status = constants.STATUS_DELETED
	savings.DeletedAt.Time = time.Now()
	savings.DeletedAt.Valid = true
	database.DB.Save(&savings)

	helper.Response(c, http.StatusOK, "Savings deleted successfully", nil, nil)
}
