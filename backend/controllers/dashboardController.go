package controllers

import (
	"fintrax-backend/constants"
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {
	userId, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}
	userID := userId.(int)

	var finance models.Finance
	var totalTodos int64
	var totalProjects int64
	var activeRoadmaps int64
	var totalSavings float64
	var totalLoans float64
	var totalIncome float64
	var totalExpense float64

	db := database.DB

	// Get finance data
	db.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).First(&finance)

	// Get total todos
	db.Model(&models.Todo{}).Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Count(&totalTodos)

	// Get total projects
	db.Model(&models.Project{}).Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Count(&totalProjects)

	// Get active roadmaps (status = 1 means active)
	db.Model(&models.Roadmap{}).Where("status = ?", 1).Count(&activeRoadmaps)

	// Get total savings
	db.Model(&models.Savings{}).Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Select("COALESCE(SUM(amount), 0)").Scan(&totalSavings)

	// Get total loans
	db.Model(&models.Loans{}).Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Select("COALESCE(SUM(total_amount), 0)").Scan(&totalLoans)

	// Get total income and expenses
	db.Model(&models.Transactions{}).Where("type = ? AND status != ?", 1, constants.STATUS_DELETED).Select("COALESCE(SUM(amount), 0)").Scan(&totalIncome)
	db.Model(&models.Transactions{}).Where("type = ? AND status != ?", 2, constants.STATUS_DELETED).Select("COALESCE(SUM(amount), 0)").Scan(&totalExpense)

	dashboard := gin.H{
		"total_balance":   finance.Balance,
		"total_debt":      finance.TotalDebt,
		"total_savings":   totalSavings,
		"total_loans":     totalLoans,
		"total_income":    totalIncome,
		"total_expense":   totalExpense,
		"net_worth":       finance.Balance + totalSavings - finance.TotalDebt - totalLoans,
		"total_todo":      totalTodos,
		"total_projects":  totalProjects,
		"active_roadmaps": activeRoadmaps,
	}

	helper.Response(c, http.StatusOK, "Dashboard retrieved successfully", dashboard, nil)
}
