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
	Rate          float64 `json:"rate" binding:"gte=0"`
	Term          uint    `json:"term" binding:"required,gt=0"`     // Total Loan Term in months
	Duration      uint    `json:"duration" binding:"required,gt=0"` // Payment frequency
	PremiumAmount float64 `json:"premium_amount" binding:"gte=0"`   // Per period premium amount
	Status        uint    `json:"status" binding:"gte=1,lte=6"`
}

type loansResponse struct {
	ID            uint      `json:"loan_id"`
	Name          string    `json:"name"`
	TotalAmount   float64   `json:"total_amount"`
	Rate          float64   `json:"rate"`
	Term          uint      `json:"term"`
	Duration      uint      `json:"duration"`
	PremiumAmount float64   `json:"premium_amount"`
	UserID        uint      `json:"user_id"`
	Status        uint      `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// CreateLoan creates a new loan for the authenticated user
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

	// Set default status if not provided
	if req.Status == 0 {
		req.Status = constants.STATUS_NOT_STARTED
	}

	var loan = models.Loans{
		Name:          req.Name,
		TotalAmount:   req.TotalAmount,
		Rate:          req.Rate,
		Term:          req.Term,
		Duration:      req.Duration,
		PremiumAmount: req.PremiumAmount,
		UserID:        uint(userID.(int)),
		Status:        req.Status,
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
		CreatedAt:     loan.CreatedAt,
		UpdatedAt:     loan.UpdatedAt,
	}

	helper.Response(c, http.StatusCreated, "Loan created successfully", response, nil)
}

// GetAllLoans retrieves all loans for the authenticated user
func GetAllLoans(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var loans []models.Loans
	database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
		Order("created_at DESC").
		Find(&loans)

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
			CreatedAt:     loan.CreatedAt,
			UpdatedAt:     loan.UpdatedAt,
		}
	}

	helper.Response(c, http.StatusOK, "Loans fetched successfully", response, nil)
}

// GetLoan retrieves a specific loan by ID
func GetLoan(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var loan models.Loans
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&loan)

	if result.Error != nil {
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
		CreatedAt:     loan.CreatedAt,
		UpdatedAt:     loan.UpdatedAt,
	}

	helper.Response(c, http.StatusOK, "Loan fetched successfully", response, nil)
}

// UpdateLoan updates a specific loan by ID
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
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&loan)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Loan not found", nil, nil)
		return
	}

	// Update fields
	loan.Name = req.Name
	loan.TotalAmount = req.TotalAmount
	loan.Rate = req.Rate
	loan.Term = req.Term
	loan.Duration = req.Duration
	loan.PremiumAmount = req.PremiumAmount
	if req.Status != 0 {
		loan.Status = req.Status
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
		CreatedAt:     loan.CreatedAt,
		UpdatedAt:     loan.UpdatedAt,
	}

	helper.Response(c, http.StatusOK, "Loan updated successfully", response, nil)
}

// DeleteLoan soft deletes a loan by ID
func DeleteLoan(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var loan models.Loans
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&loan)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Loan not found", nil, nil)
		return
	}

	loan.Status = constants.STATUS_DELETED
	loan.DeletedAt.Time = time.Now()
	loan.DeletedAt.Valid = true
	database.DB.Save(&loan)

	helper.Response(c, http.StatusOK, "Loan deleted successfully", nil, nil)
}
