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

type transactionRequest struct {
	Source          string    `json:"source" binding:"required"`
	Amount          float64   `json:"amount" binding:"required,gt=0"`
	Type            uint      `json:"type" binding:"required,gte=1,lte=2"` // 1 = income, 2 = expense
	TransactionType uint      `json:"transaction_type" binding:"gte=1,lte=5"`
	Category        string    `json:"category" binding:"required"`
	NotesID         *uint     `json:"notes_id"`
	Date            time.Time `json:"date"`
	Status          uint      `json:"status" binding:"gte=1,lte=6"`
}

type transactionResponse struct {
	ID              uint      `json:"id"`
	Source          string    `json:"source"`
	Amount          float64   `json:"amount"`
	Type            uint      `json:"type"`
	TransactionType uint      `json:"transaction_type"`
	Category        string    `json:"category"`
	NotesID         *uint     `json:"notes_id"`
	Date            time.Time `json:"date"`
	UserID          uint      `json:"user_id"`
	Status          uint      `json:"status"`
	CreatedAt       time.Time `json:"created_at"`
}

// CreateTransaction creates a new transaction for the authenticated user
func CreateTransaction(c *gin.Context) {
	var req transactionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	// Set default values if not provided
	if req.Status == 0 {
		req.Status = constants.STATUS_NOT_STARTED
	}
	if req.Date.IsZero() {
		req.Date = time.Now()
	}

	var transaction = models.Transactions{
		Source:          req.Source,
		Amount:          req.Amount,
		Type:            req.Type,
		TransactionType: req.TransactionType,
		Category:        req.Category,
		NotesID:         req.NotesID,
		Date:            req.Date,
		UserID:          uint(userID.(int)),
		Status:          req.Status,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create transaction", nil, err.Error())
		return
	}
	tx.Commit()

	response := transactionResponse{
		ID:              transaction.ID,
		Source:          transaction.Source,
		Amount:          transaction.Amount,
		Type:            transaction.Type,
		TransactionType: transaction.TransactionType,
		Category:        transaction.Category,
		NotesID:         transaction.NotesID,
		Date:            transaction.Date,
		UserID:          transaction.UserID,
		Status:          transaction.Status,
		CreatedAt:       transaction.CreatedAt,
	}

	helper.Response(c, http.StatusCreated, "Transaction created successfully", response, nil)
}

// GetAllTransactions retrieves all transactions for the authenticated user
func GetAllTransactions(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var transactions []models.Transactions
	database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
		Order("date DESC").
		Find(&transactions)

	response := make([]transactionResponse, len(transactions))
	for i, transaction := range transactions {
		response[i] = transactionResponse{
			ID:              transaction.ID,
			Source:          transaction.Source,
			Amount:          transaction.Amount,
			Type:            transaction.Type,
			TransactionType: transaction.TransactionType,
			Category:        transaction.Category,
			NotesID:         transaction.NotesID,
			Date:            transaction.Date,
			UserID:          transaction.UserID,
			Status:          transaction.Status,
			CreatedAt:       transaction.CreatedAt,
		}
	}

	helper.Response(c, http.StatusOK, "Transactions fetched successfully", response, nil)
}

// GetTransaction retrieves a specific transaction by ID
func GetTransaction(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var transaction models.Transactions
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&transaction)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Transaction not found", nil, nil)
		return
	}

	response := transactionResponse{
		ID:              transaction.ID,
		Source:          transaction.Source,
		Amount:          transaction.Amount,
		Type:            transaction.Type,
		TransactionType: transaction.TransactionType,
		Category:        transaction.Category,
		NotesID:         transaction.NotesID,
		Date:            transaction.Date,
		UserID:          transaction.UserID,
		Status:          transaction.Status,
		CreatedAt:       transaction.CreatedAt,
	}

	helper.Response(c, http.StatusOK, "Transaction fetched successfully", response, nil)
}

// UpdateTransaction updates a specific transaction by ID
func UpdateTransaction(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var req transactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var transaction models.Transactions
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&transaction)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Transaction not found", nil, nil)
		return
	}

	// Update fields
	transaction.Source = req.Source
	transaction.Amount = req.Amount
	transaction.Type = req.Type
	transaction.TransactionType = req.TransactionType
	transaction.Category = req.Category
	transaction.NotesID = req.NotesID
	if !req.Date.IsZero() {
		transaction.Date = req.Date
	}
	if req.Status != 0 {
		transaction.Status = req.Status
	}

	database.DB.Save(&transaction)

	response := transactionResponse{
		ID:              transaction.ID,
		Source:          transaction.Source,
		Amount:          transaction.Amount,
		Type:            transaction.Type,
		TransactionType: transaction.TransactionType,
		Category:        transaction.Category,
		NotesID:         transaction.NotesID,
		Date:            transaction.Date,
		UserID:          transaction.UserID,
		Status:          transaction.Status,
		CreatedAt:       transaction.CreatedAt,
	}

	helper.Response(c, http.StatusOK, "Transaction updated successfully", response, nil)
}

// DeleteTransaction soft deletes a transaction by ID
func DeleteTransaction(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var transaction models.Transactions
	result := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).
		First(&transaction)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Transaction not found", nil, nil)
		return
	}

	transaction.Status = constants.STATUS_DELETED
	transaction.DeletedAt.Time = time.Now()
	transaction.DeletedAt.Valid = true
	database.DB.Save(&transaction)

	helper.Response(c, http.StatusOK, "Transaction deleted successfully", nil, nil)
}

// GetTransactionSummary provides aggregated transaction data by type and category
func GetTransactionSummary(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	// Get summary by type and category
	var summary []struct {
		Type     uint    `json:"type"`
		Category string  `json:"category"`
		Total    float64 `json:"total"`
		Count    int64   `json:"count"`
	}

	database.DB.Model(&models.Transactions{}).
		Select("type, category, SUM(amount) as total, COUNT(*) as count").
		Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).
		Group("type, category").
		Scan(&summary)

	helper.Response(c, http.StatusOK, "Transaction summary fetched successfully", summary, nil)
}
