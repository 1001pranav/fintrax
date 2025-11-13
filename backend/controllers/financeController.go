package controllers

import (
	"fintrax-backend/constants"
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type financeRequest struct {
	Balance   float64 `json:"balance"`
	TotalDebt float64 `json:"total_debt"`
}

type financeResponse struct {
	ID        uint    `json:"finance_id"`
	Balance   float64 `json:"balance"`
	TotalDebt float64 `json:"total_debt"`
	UserID    uint    `json:"user_id"`
}

// GetFinance retrieves the finance overview for the authenticated user
func GetFinance(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var finance models.Finance
	result := database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).First(&finance)

	if result.Error != nil {
		// If no finance record exists, create one with default values
		finance = models.Finance{
			UserID:    uint(userID.(int)),
			Balance:   0,
			TotalDebt: 0,
			Status:    constants.STATUS_NOT_STARTED,
		}
		database.DB.Create(&finance)
	}

	response := financeResponse{
		ID:        finance.ID,
		Balance:   finance.Balance,
		TotalDebt: finance.TotalDebt,
		UserID:    finance.UserID,
	}

	helper.Response(c, http.StatusOK, "Finance data fetched successfully", response, nil)
}

// UpdateFinance updates the finance overview for the authenticated user
func UpdateFinance(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var req financeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var finance models.Finance
	result := database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).First(&finance)

	if result.Error != nil {
		// Create new finance record if it doesn't exist
		finance = models.Finance{
			UserID:    uint(userID.(int)),
			Balance:   req.Balance,
			TotalDebt: req.TotalDebt,
			Status:    constants.STATUS_NOT_STARTED,
		}
		database.DB.Create(&finance)
	} else {
		// Update existing record
		finance.Balance = req.Balance
		finance.TotalDebt = req.TotalDebt
		database.DB.Save(&finance)
	}

	response := financeResponse{
		ID:        finance.ID,
		Balance:   finance.Balance,
		TotalDebt: finance.TotalDebt,
		UserID:    finance.UserID,
	}

	helper.Response(c, http.StatusOK, "Finance data updated successfully", response, nil)
}
