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
	if err := database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).First(&finance).Error; err != nil {
		// If no finance record exists, create one with default values
		finance = models.Finance{
			Balance:   0,
			TotalDebt: 0,
			UserID:    uint(userID.(int)),
			Status:    1,
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
	if err := database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).First(&finance).Error; err != nil {
		// If no finance record exists, create one
		finance = models.Finance{
			Balance:   req.Balance,
			TotalDebt: req.TotalDebt,
			UserID:    uint(userID.(int)),
			Status:    1,
		}
		database.DB.Create(&finance)
	} else {
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
	helper.Response(c, http.StatusOK, "Finance updated successfully", response, nil)
}

// GetFinanceSummary retrieves comprehensive financial summary for the authenticated user
func GetFinanceSummary(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var finance models.Finance
	database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).First(&finance)

	// Calculate total savings
	var totalSavings float64
	database.DB.Model(&models.Savings{}).Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Select("COALESCE(SUM(amount), 0)").Scan(&totalSavings)

	// Calculate total loans
	var totalLoans float64
	database.DB.Model(&models.Loans{}).Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Select("COALESCE(SUM(total_amount), 0)").Scan(&totalLoans)

	// Calculate income and expenses from transactions
	var totalIncome float64
	var totalExpense float64
	database.DB.Model(&models.Transactions{}).Where("user_id = ? AND type = ? AND status != ?", userID, 1, constants.STATUS_DELETED).Select("COALESCE(SUM(amount), 0)").Scan(&totalIncome)
	database.DB.Model(&models.Transactions{}).Where("user_id = ? AND type = ? AND status != ?", userID, 2, constants.STATUS_DELETED).Select("COALESCE(SUM(amount), 0)").Scan(&totalExpense)

	summary := gin.H{
		"balance":       finance.Balance,
		"total_debt":    finance.TotalDebt,
		"total_savings": totalSavings,
		"total_loans":   totalLoans,
		"total_income":  totalIncome,
		"total_expense": totalExpense,
		"net_worth":     finance.Balance + totalSavings - finance.TotalDebt - totalLoans,
	}

	helper.Response(c, http.StatusOK, "Finance summary fetched successfully", summary, nil)
}
