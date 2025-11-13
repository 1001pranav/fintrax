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

type projectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Color       string `json:"color"`
	CoverImage  string `json:"cover_image"`
	Status      uint   `json:"status" binding:"gte=1,lte=3" default:"1"`
}

type projectResponse struct {
	ID          uint      `json:"project_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Color       string    `json:"color"`
	CoverImage  string    `json:"cover_image"`
	Status      uint      `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	TaskCount   int64     `json:"task_count"`
}

func CreateProject(c *gin.Context) {
	var req projectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var project = models.Project{
		Name:        req.Name,
		Description: req.Description,
		Color:       req.Color,
		CoverImage:  req.CoverImage,
		Status:      req.Status,
		UserID:      uint(userID.(int)),
	}

	if project.Color == "" {
		project.Color = "#3B82F6"
	}
	if project.Status == 0 {
		project.Status = 1
	}

	tx := database.DB.Begin()
	if err := tx.Create(&project).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create project", nil, err.Error())
		return
	}
	tx.Commit()

	response := projectResponse{
		ID:          project.ID,
		Name:        project.Name,
		Description: project.Description,
		Color:       project.Color,
		CoverImage:  project.CoverImage,
		Status:      project.Status,
		CreatedAt:   project.CreatedAt,
		TaskCount:   0,
	}
	helper.Response(c, http.StatusCreated, "Project created successfully", response, nil)
}

func GetAllProjects(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var projects []models.Project
	database.DB.Where("user_id = ? AND status != ?", userID, constants.STATUS_DELETED).Find(&projects)

	response := make([]projectResponse, len(projects))
	for i, project := range projects {
		var taskCount int64
		database.DB.Model(&models.Todo{}).Where("project_id = ? AND status != ?", project.ID, constants.STATUS_DELETED).Count(&taskCount)

		response[i] = projectResponse{
			ID:          project.ID,
			Name:        project.Name,
			Description: project.Description,
			Color:       project.Color,
			CoverImage:  project.CoverImage,
			Status:      project.Status,
			CreatedAt:   project.CreatedAt,
			TaskCount:   taskCount,
		}
	}
	helper.Response(c, http.StatusOK, "Projects fetched successfully", response, nil)
}

func GetProject(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var project models.Project
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&project).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Project not found", nil, nil)
		return
	}

	var taskCount int64
	database.DB.Model(&models.Todo{}).Where("project_id = ? AND status != ?", project.ID, constants.STATUS_DELETED).Count(&taskCount)

	response := projectResponse{
		ID:          project.ID,
		Name:        project.Name,
		Description: project.Description,
		Color:       project.Color,
		CoverImage:  project.CoverImage,
		Status:      project.Status,
		CreatedAt:   project.CreatedAt,
		TaskCount:   taskCount,
	}
	helper.Response(c, http.StatusOK, "Project fetched successfully", response, nil)
}

func UpdateProject(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var req projectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var project models.Project
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&project).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Project not found", nil, nil)
		return
	}

	if req.Name != "" {
		project.Name = req.Name
	}
	if req.Description != "" {
		project.Description = req.Description
	}
	if req.Color != "" {
		project.Color = req.Color
	}
	if req.CoverImage != "" {
		project.CoverImage = req.CoverImage
	}
	if req.Status != 0 {
		project.Status = req.Status
	}

	database.DB.Save(&project)

	var taskCount int64
	database.DB.Model(&models.Todo{}).Where("project_id = ? AND status != ?", project.ID, constants.STATUS_DELETED).Count(&taskCount)

	response := projectResponse{
		ID:          project.ID,
		Name:        project.Name,
		Description: project.Description,
		Color:       project.Color,
		CoverImage:  project.CoverImage,
		Status:      project.Status,
		CreatedAt:   project.CreatedAt,
		TaskCount:   taskCount,
	}
	helper.Response(c, http.StatusOK, "Project updated successfully", response, nil)
}

func DeleteProject(c *gin.Context) {
	id := c.Param("id")
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var project models.Project
	if err := database.DB.Where("id = ? AND user_id = ? AND status != ?", id, userID, constants.STATUS_DELETED).First(&project).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Project not found", nil, nil)
		return
	}

	project.Status = constants.STATUS_DELETED
	project.DeletedAt.Time = time.Now()
	project.DeletedAt.Valid = true
	database.DB.Save(&project)

	helper.Response(c, http.StatusOK, "Project deleted successfully", &project, nil)
}
