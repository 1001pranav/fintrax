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

type loansRequest struct {
	Name          string  `json:"name" binding:"required"`
	TotalAmount   float64 `json:"total_amount" binding:"required,gt=0"`
	Rate          float64 `json:"rate"`
	Term          uint    `json:"term"`
	Duration      uint    `json:"duration"`
	PremiumAmount float64 `json:"premium_amount"`
}

type loansResponse struct {
	ID            uint    `json:"loan_id"`
	Name          string  `json:"name"`
	TotalAmount   float64 `json:"total_amount"`
	Rate          float64 `json:"rate"`
	Term          uint    `json:"term"`
	Duration      uint    `json:"duration"`
	PremiumAmount float64 `json:"premium_amount"`
	UserID        uint    `json:"user_id"`
	Status        uint    `json:"status"`
}

func CreateLoan(c *gin.Context) {
	var req loansRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	loan := models.Loans{
		Name:          req.Name,
		TotalAmount:   req.TotalAmount,
		Rate:          req.Rate,
		Term:          req.Term,
		Duration:      req.Duration,
		PremiumAmount: req.PremiumAmount,
		UserID:        uint(userID.(int)),
		Status:        1,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&loan).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create loan", nil, err.Error())
		return
	}
	tx.Commit()

	response := loansResponse{
		ID:            loan.ID,
		Name:          loan.Name,
		TotalAmount:   loan.TotalAmount,
		Rate:          loan.Rate,
		Term:          loan.Term,
		Duration:      loan.Duration,
		PremiumAmount: loan.PremiumAmount,
		UserID:        loan.UserID,
		Status:        loan.Status,
	}
	helper.Response(c, http.StatusCreated, "Loan created successfully", response, nil)
}

func GetAllLoans(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var loans []models.Loans
	database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Find(&loans)

	response := make([]loansResponse, len(loans))
	for i, loan := range loans {
		response[i] = loansResponse{
			ID:            loan.ID,
			Name:          loan.Name,
			TotalAmount:   loan.TotalAmount,
			Rate:          loan.Rate,
			Term:          loan.Term,
			Duration:      loan.Duration,
			PremiumAmount: loan.PremiumAmount,
			UserID:        loan.UserID,
			Status:        loan.Status,
		}
	}
	helper.Response(c, http.StatusOK, "Loans fetched successfully", response, nil)
}

func GetLoan(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var loan models.Loans
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&loan).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Loan not found", nil, nil)
		return
	}

	response := loansResponse{
		ID:            loan.ID,
		Name:          loan.Name,
		TotalAmount:   loan.TotalAmount,
		Rate:          loan.Rate,
		Term:          loan.Term,
		Duration:      loan.Duration,
		PremiumAmount: loan.PremiumAmount,
		UserID:        loan.UserID,
		Status:        loan.Status,
	}
	helper.Response(c, http.StatusOK, "Loan fetched successfully", response, nil)
}

func UpdateLoan(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var req loansRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var loan models.Loans
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&loan).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Loan not found", nil, nil)
		return
	}

	if req.Name != "" {
		loan.Name = req.Name
	}
	if req.TotalAmount > 0 {
		loan.TotalAmount = req.TotalAmount
	}
	if req.Rate >= 0 {
		loan.Rate = req.Rate
	}
	if req.Term > 0 {
		loan.Term = req.Term
	}
	if req.Duration > 0 {
		loan.Duration = req.Duration
	}
	if req.PremiumAmount >= 0 {
		loan.PremiumAmount = req.PremiumAmount
	}

	database.DB.Save(&loan)

	response := loansResponse{
		ID:            loan.ID,
		Name:          loan.Name,
		TotalAmount:   loan.TotalAmount,
		Rate:          loan.Rate,
		Term:          loan.Term,
		Duration:      loan.Duration,
		PremiumAmount: loan.PremiumAmount,
		UserID:        loan.UserID,
		Status:        loan.Status,
	}
	helper.Response(c, http.StatusOK, "Loan updated successfully", response, nil)
}

func DeleteLoan(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var loan models.Loans
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&loan).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Loan not found", nil, nil)
		return
	}

	loan.Status = constants.STATUS_DELETED
	loan.DeletedAt.Time = time.Now()
	loan.DeletedAt.Valid = true
	database.DB.Save(&loan)

	helper.Response(c, http.StatusOK, "Loan deleted successfully", &loan, nil)
}
