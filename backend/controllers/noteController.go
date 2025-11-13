package controllers

import (
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type noteRequest struct {
	Text string `json:"text" binding:"required"`
}

type noteResponse struct {
	ID   uint   `json:"note_id"`
	Text string `json:"text"`
}

func CreateNote(c *gin.Context) {
	var req noteRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	note := models.Notes{
		Text: req.Text,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&note).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create note", nil, err.Error())
		return
	}
	tx.Commit()

	response := noteResponse{
		ID:   note.ID,
		Text: note.Text,
	}
	helper.Response(c, http.StatusCreated, "Note created successfully", response, nil)
}

func GetNote(c *gin.Context) {
	id := c.Param("id")
	var note models.Notes

	if err := database.DB.Where("id = ?", id).First(&note).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Note not found", nil, nil)
		return
	}

	response := noteResponse{
		ID:   note.ID,
		Text: note.Text,
	}
	helper.Response(c, http.StatusOK, "Note fetched successfully", response, nil)
}

func UpdateNote(c *gin.Context) {
	id := c.Param("id")
	var req noteRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var note models.Notes
	if err := database.DB.Where("id = ?", id).First(&note).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Note not found", nil, nil)
		return
	}

	if req.Text != "" {
		note.Text = req.Text
	}

	database.DB.Save(&note)

	response := noteResponse{
		ID:   note.ID,
		Text: note.Text,
	}
	helper.Response(c, http.StatusOK, "Note updated successfully", response, nil)
}

func DeleteNote(c *gin.Context) {
	id := c.Param("id")
	var note models.Notes

	if err := database.DB.Where("id = ?", id).First(&note).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Note not found", nil, nil)
		return
	}

	note.DeletedAt.Time = time.Now()
	note.DeletedAt.Valid = true
	database.DB.Delete(&note)

	helper.Response(c, http.StatusOK, "Note deleted successfully", &note, nil)
}
