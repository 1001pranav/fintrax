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
	Name   string  `json:"name" binding:"required"`
	Amount float64 `json:"amount" binding:"required,gt=0"`
	Rate   float64 `json:"rate"`
}

type savingsResponse struct {
	ID        uint      `json:"saving_id"`
	Name      string    `json:"name"`
	Amount    float64   `json:"amount"`
	Rate      float64   `json:"rate"`
	UserID    uint      `json:"user_id"`
	UpdatedAt time.Time `json:"updated_at"`
	Status    uint      `json:"status"`
}

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

	savings := models.Savings{
		Name:   req.Name,
		Amount: req.Amount,
		Rate:   req.Rate,
		UserID: uint(userID.(int)),
		Status: 1,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&savings).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create savings", nil, err.Error())
		return
	}
	tx.Commit()

	response := savingsResponse{
		ID:        savings.ID,
		Name:      savings.Name,
		Amount:    savings.Amount,
		Rate:      savings.Rate,
		UserID:    savings.UserID,
		UpdatedAt: savings.UpdatedAt,
		Status:    savings.Status,
	}
	helper.Response(c, http.StatusCreated, "Savings created successfully", response, nil)
}

func GetAllSavings(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var savings []models.Savings
	database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Find(&savings)

	response := make([]savingsResponse, len(savings))
	for i, saving := range savings {
		response[i] = savingsResponse{
			ID:        saving.ID,
			Name:      saving.Name,
			Amount:    saving.Amount,
			Rate:      saving.Rate,
			UserID:    saving.UserID,
			UpdatedAt: saving.UpdatedAt,
			Status:    saving.Status,
		}
	}
	helper.Response(c, http.StatusOK, "Savings fetched successfully", response, nil)
}

func GetSavings(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var savings models.Savings
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&savings).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Savings not found", nil, nil)
		return
	}

	response := savingsResponse{
		ID:        savings.ID,
		Name:      savings.Name,
		Amount:    savings.Amount,
		Rate:      savings.Rate,
		UserID:    savings.UserID,
		UpdatedAt: savings.UpdatedAt,
		Status:    savings.Status,
	}
	helper.Response(c, http.StatusOK, "Savings fetched successfully", response, nil)
}

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
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&savings).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Savings not found", nil, nil)
		return
	}

	if req.Name != "" {
		savings.Name = req.Name
	}
	if req.Amount > 0 {
		savings.Amount = req.Amount
	}
	if req.Rate >= 0 {
		savings.Rate = req.Rate
	}

	database.DB.Save(&savings)

	response := savingsResponse{
		ID:        savings.ID,
		Name:      savings.Name,
		Amount:    savings.Amount,
		Rate:      savings.Rate,
		UserID:    savings.UserID,
		UpdatedAt: savings.UpdatedAt,
		Status:    savings.Status,
	}
	helper.Response(c, http.StatusOK, "Savings updated successfully", response, nil)
}

func DeleteSavings(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var savings models.Savings
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&savings).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Savings not found", nil, nil)
		return
	}

	savings.Status = constants.STATUS_DELETED
	savings.DeletedAt.Time = time.Now()
	savings.DeletedAt.Valid = true
	database.DB.Save(&savings)

	helper.Response(c, http.StatusOK, "Savings deleted successfully", &savings, nil)
}
