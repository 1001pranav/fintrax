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

type roadmapRequest struct {
	Name      string    `json:"name" binding:"required"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Progress  float64   `json:"progress"`
}

type roadmapResponse struct {
	ID        uint      `json:"roadmap_id"`
	Name      string    `json:"name"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Progress  float64   `json:"progress"`
	Status    uint      `json:"status"`
	TodoCount int64     `json:"todo_count"`
}

func CreateRoadmap(c *gin.Context) {
	var req roadmapRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	roadmap := models.Roadmap{
		Name:      req.Name,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
		Progress:  req.Progress,
		Status:    1,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&roadmap).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create roadmap", nil, err.Error())
		return
	}
	tx.Commit()

	response := roadmapResponse{
		ID:        roadmap.ID,
		Name:      roadmap.Name,
		StartDate: roadmap.StartDate,
		EndDate:   roadmap.EndDate,
		Progress:  roadmap.Progress,
		Status:    roadmap.Status,
		TodoCount: 0,
	}
	helper.Response(c, http.StatusCreated, "Roadmap created successfully", response, nil)
}

func GetAllRoadmaps(c *gin.Context) {
	var roadmaps []models.Roadmap
	database.DB.Where("status != ?", constants.STATUS_DELETED).Find(&roadmaps)

	response := make([]roadmapResponse, len(roadmaps))
	for i, roadmap := range roadmaps {
		var todoCount int64
		database.DB.Model(&models.Todo{}).Where("roadmap_id = ? AND status != ?", roadmap.ID, constants.STATUS_DELETED).Count(&todoCount)

		response[i] = roadmapResponse{
			ID:        roadmap.ID,
			Name:      roadmap.Name,
			StartDate: roadmap.StartDate,
			EndDate:   roadmap.EndDate,
			Progress:  roadmap.Progress,
			Status:    roadmap.Status,
			TodoCount: todoCount,
		}
	}
	helper.Response(c, http.StatusOK, "Roadmaps fetched successfully", response, nil)
}

func GetRoadmap(c *gin.Context) {
	id := c.Param("id")
	var roadmap models.Roadmap

	if err := database.DB.Preload("Todos").Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&roadmap).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Roadmap not found", nil, nil)
		return
	}

	var todoCount int64
	database.DB.Model(&models.Todo{}).Where("roadmap_id = ? AND status != ?", roadmap.ID, constants.STATUS_DELETED).Count(&todoCount)

	response := roadmapResponse{
		ID:        roadmap.ID,
		Name:      roadmap.Name,
		StartDate: roadmap.StartDate,
		EndDate:   roadmap.EndDate,
		Progress:  roadmap.Progress,
		Status:    roadmap.Status,
		TodoCount: todoCount,
	}
	helper.Response(c, http.StatusOK, "Roadmap fetched successfully", response, nil)
}

func UpdateRoadmap(c *gin.Context) {
	id := c.Param("id")
	var req roadmapRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var roadmap models.Roadmap
	if err := database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&roadmap).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Roadmap not found", nil, nil)
		return
	}

	if req.Name != "" {
		roadmap.Name = req.Name
	}
	if !req.StartDate.IsZero() {
		roadmap.StartDate = req.StartDate
	}
	if !req.EndDate.IsZero() {
		roadmap.EndDate = req.EndDate
	}
	if req.Progress >= 0 {
		roadmap.Progress = req.Progress
	}

	database.DB.Save(&roadmap)

	var todoCount int64
	database.DB.Model(&models.Todo{}).Where("roadmap_id = ? AND status != ?", roadmap.ID, constants.STATUS_DELETED).Count(&todoCount)

	response := roadmapResponse{
		ID:        roadmap.ID,
		Name:      roadmap.Name,
		StartDate: roadmap.StartDate,
		EndDate:   roadmap.EndDate,
		Progress:  roadmap.Progress,
		Status:    roadmap.Status,
		TodoCount: todoCount,
	}
	helper.Response(c, http.StatusOK, "Roadmap updated successfully", response, nil)
}

func DeleteRoadmap(c *gin.Context) {
	id := c.Param("id")
	var roadmap models.Roadmap

	if err := database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&roadmap).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Roadmap not found", nil, nil)
		return
	}

	roadmap.Status = constants.STATUS_DELETED
	roadmap.DeletedAt.Time = time.Now()
	roadmap.DeletedAt.Valid = true
	database.DB.Save(&roadmap)

	helper.Response(c, http.StatusOK, "Roadmap deleted successfully", &roadmap, nil)
}
