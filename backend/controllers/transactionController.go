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
	Category        string    `json:"category"`
	Date            time.Time `json:"date"`
	NotesID         *uint     `json:"notes_id"`
}

type transactionResponse struct {
	ID              uint      `json:"id"`
	Source          string    `json:"source"`
	Amount          float64   `json:"amount"`
	Type            uint      `json:"type"`
	TransactionType uint      `json:"transaction_type"`
	Category        string    `json:"category"`
	Date            time.Time `json:"date"`
	NotesID         *uint     `json:"notes_id"`
	Status          uint      `json:"status"`
}

func CreateTransaction(c *gin.Context) {
	var req transactionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	transaction := models.Transactions{
		Source:          req.Source,
		Amount:          req.Amount,
		Type:            req.Type,
		TransactionType: req.TransactionType,
		Category:        req.Category,
		Date:            req.Date,
		NotesID:         req.NotesID,
		Status:          1,
	}

	if transaction.Date.IsZero() {
		transaction.Date = time.Now()
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
		Date:            transaction.Date,
		NotesID:         transaction.NotesID,
		Status:          transaction.Status,
	}
	helper.Response(c, http.StatusCreated, "Transaction created successfully", response, nil)
}

func GetAllTransactions(c *gin.Context) {
	var transactions []models.Transactions

	// Support filtering by type, category, date range
	query := database.DB.Where("status != ?", constants.STATUS_DELETED)

	if transactionType := c.Query("type"); transactionType != "" {
		query = query.Where("type = ?", transactionType)
	}

	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}

	if startDate := c.Query("start_date"); startDate != "" {
		query = query.Where("date >= ?", startDate)
	}

	if endDate := c.Query("end_date"); endDate != "" {
		query = query.Where("date <= ?", endDate)
	}

	query.Order("date DESC").Find(&transactions)

	response := make([]transactionResponse, len(transactions))
	for i, transaction := range transactions {
		response[i] = transactionResponse{
			ID:              transaction.ID,
			Source:          transaction.Source,
			Amount:          transaction.Amount,
			Type:            transaction.Type,
			TransactionType: transaction.TransactionType,
			Category:        transaction.Category,
			Date:            transaction.Date,
			NotesID:         transaction.NotesID,
			Status:          transaction.Status,
		}
	}
	helper.Response(c, http.StatusOK, "Transactions fetched successfully", response, nil)
}

func GetTransaction(c *gin.Context) {
	id := c.Param("id")
	var transaction models.Transactions

	if err := database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&transaction).Error; err != nil {
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
		Date:            transaction.Date,
		NotesID:         transaction.NotesID,
		Status:          transaction.Status,
	}
	helper.Response(c, http.StatusOK, "Transaction fetched successfully", response, nil)
}

func UpdateTransaction(c *gin.Context) {
	id := c.Param("id")
	var req transactionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var transaction models.Transactions
	if err := database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&transaction).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Transaction not found", nil, nil)
		return
	}

	if req.Source != "" {
		transaction.Source = req.Source
	}
	if req.Amount > 0 {
		transaction.Amount = req.Amount
	}
	if req.Type != 0 {
		transaction.Type = req.Type
	}
	if req.TransactionType != 0 {
		transaction.TransactionType = req.TransactionType
	}
	if req.Category != "" {
		transaction.Category = req.Category
	}
	if !req.Date.IsZero() {
		transaction.Date = req.Date
	}
	if req.NotesID != nil {
		transaction.NotesID = req.NotesID
	}

	database.DB.Save(&transaction)

	response := transactionResponse{
		ID:              transaction.ID,
		Source:          transaction.Source,
		Amount:          transaction.Amount,
		Type:            transaction.Type,
		TransactionType: transaction.TransactionType,
		Category:        transaction.Category,
		Date:            transaction.Date,
		NotesID:         transaction.NotesID,
		Status:          transaction.Status,
	}
	helper.Response(c, http.StatusOK, "Transaction updated successfully", response, nil)
}

func DeleteTransaction(c *gin.Context) {
	id := c.Param("id")
	var transaction models.Transactions

	if err := database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&transaction).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Transaction not found", nil, nil)
		return
	}

	transaction.Status = constants.STATUS_DELETED
	transaction.DeletedAt.Time = time.Now()
	transaction.DeletedAt.Valid = true
	database.DB.Save(&transaction)

	helper.Response(c, http.StatusOK, "Transaction deleted successfully", &transaction, nil)
}

func GetTransactionSummary(c *gin.Context) {
	// Get summary by type and category
	var summary []struct {
		Type     uint    `json:"type"`
		Category string  `json:"category"`
		Total    float64 `json:"total"`
		Count    int64   `json:"count"`
	}

	database.DB.Model(&models.Transactions{}).
		Select("type, category, SUM(amount) as total, COUNT(*) as count").
		Where("status != ?", constants.STATUS_DELETED).
		Group("type, category").
		Scan(&summary)

	helper.Response(c, http.StatusOK, "Transaction summary fetched successfully", summary, nil)
}
