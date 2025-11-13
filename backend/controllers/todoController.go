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

type todoRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	IsRoadmap   bool      `json:"is_roadmap" default:"false"`
	Priority    uint      `json:"priority" default:"5"`
	DueDays     uint      `json:"due_days" default:"0"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	Status      uint      `json:"status" binding:"gte=1,lte=6" default:"1"`
	ParentID    *uint     `json:"parent_id" default:"0"`
	ProjectID   *uint     `json:"project_id"`
	RoadmapID   *uint     `json:"roadmap_id"`
}
type todoResponse struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	IsRoadmap   bool      `json:"is_roadmap" default:"false"`
	Priority    uint      `json:"priority" default:"5"`
	DueDays     uint      `json:"due_days" default:"0"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	Status      uint      `json:"status" binding:"gte=1,lte=6" default:"1"`
	ParentID    *uint     `json:"parent_id" default:"0"`
	ProjectID   *uint     `json:"project_id"`
	RoadmapID   *uint     `json:"roadmap_id"`
	ID          uint      `json:"task_id"`
}

func CreateToDo(c *gin.Context) {
	var req todoRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var todo = models.Todo{
		Task:        req.Title,
		Description: req.Description,
		IsRoadmap:   req.IsRoadmap,
		Priority:    req.Priority,
		DueDays:     req.DueDays,
		StartDate:   req.StartDate,
		EndDate:     req.EndDate,
		Status:      req.Status,
		ParentID:    req.ParentID,
		ProjectID:   req.ProjectID,
		RoadmapID:   req.RoadmapID,
		UserID:      uint(userID.(int)),
	}
	var tx = database.DB.Begin()

	tx.Create(&todo)

	tx.Commit()
	response := todoResponse{
		Title:       todo.Task,
		Description: todo.Description,
		IsRoadmap:   todo.IsRoadmap,
		Priority:    todo.Priority,
		DueDays:     todo.DueDays,
		StartDate:   todo.StartDate,
		EndDate:     todo.EndDate,
		Status:      todo.Status,
		ParentID:    todo.ParentID,
		ProjectID:   todo.ProjectID,
		RoadmapID:   todo.RoadmapID,
		ID:          todo.ID,
	}
	helper.Response(c, http.StatusCreated, "Todo created successfully", response, nil)
}

func GetAllToDos(c *gin.Context) {
	var todos []models.Todo
	query := database.DB.Where("status != ?", constants.STATUS_DELETED)

	// Support filtering by project_id
	if projectID := c.Query("project_id"); projectID != "" {
		query = query.Where("project_id = ?", projectID)
	}

	// Support filtering by roadmap_id
	if roadmapID := c.Query("roadmap_id"); roadmapID != "" {
		query = query.Where("roadmap_id = ?", roadmapID)
	}

	query.Find(&todos)

	response := make([]todoResponse, len(todos))
	for i, todo := range todos {
		response[i] = todoResponse{
			Title:       todo.Task,
			Description: todo.Description,
			IsRoadmap:   todo.IsRoadmap,
			Priority:    todo.Priority,
			DueDays:     todo.DueDays,
			StartDate:   todo.StartDate,
			EndDate:     todo.EndDate,
			Status:      todo.Status,
			ParentID:    todo.ParentID,
			ProjectID:   todo.ProjectID,
			RoadmapID:   todo.RoadmapID,
			ID:          todo.ID,
		}
	}
	helper.Response(c, http.StatusOK, "Todos fetched successfully", response, nil)
}

func GetToDo(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo
	database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&todo)
	response := todoResponse{
		Title:       todo.Task,
		Description: todo.Description,
		IsRoadmap:   todo.IsRoadmap,
		Priority:    todo.Priority,
		DueDays:     todo.DueDays,
		StartDate:   todo.StartDate,
		EndDate:     todo.EndDate,
		Status:      todo.Status,
		ParentID:    todo.ParentID,
		ProjectID:   todo.ProjectID,
		RoadmapID:   todo.RoadmapID,
		ID:          todo.ID,
	}
	helper.Response(c, http.StatusOK, "Todo fetched successfully", response, nil)
}

func UpdateToDo(c *gin.Context) {
	id := c.Param("id")
	var req todoRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}
	var todo models.Todo
	database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&todo)

	if todo.ID == 0 {
		helper.Response(c, http.StatusNotFound, "Todo not found", nil, nil)
		return
	}
	if req.Title != "" {
		todo.Task = req.Title
	}
	if req.Description != "" {
		todo.Description = req.Description
	}
	if req.IsRoadmap != todo.IsRoadmap {
		todo.IsRoadmap = req.IsRoadmap
	}
	if req.Priority != todo.Priority {
		todo.Priority = req.Priority
	}
	if req.DueDays != todo.DueDays {
		todo.DueDays = req.DueDays
	}
	if req.StartDate != todo.StartDate {
		todo.StartDate = req.StartDate
	}
	if req.EndDate != todo.EndDate {
		todo.EndDate = req.EndDate
	}
	if req.Status != todo.Status {
		todo.Status = req.Status
	}
	if req.ParentID != todo.ParentID {
		todo.ParentID = req.ParentID
	}
	if req.ProjectID != todo.ProjectID {
		todo.ProjectID = req.ProjectID
	}
	if req.RoadmapID != todo.RoadmapID {
		todo.RoadmapID = req.RoadmapID
	}
	database.DB.Save(&todo)
	response := todoResponse{
		ID:          todo.ID,
		Title:       todo.Task,
		Description: todo.Description,
		IsRoadmap:   todo.IsRoadmap,
		Priority:    todo.Priority,
		DueDays:     todo.DueDays,
		StartDate:   todo.StartDate,
		EndDate:     todo.EndDate,
		Status:      todo.Status,
		ParentID:    todo.ParentID,
		ProjectID:   todo.ProjectID,
		RoadmapID:   todo.RoadmapID,
	}
	helper.Response(c, http.StatusOK, "Todo updated successfully", response, nil)
}

func DeleteToDo(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo
	database.DB.Where("id = ? AND status != ?", id, constants.STATUS_DELETED).First(&todo)
	if todo.ID == 0 {
		helper.Response(c, http.StatusNotFound, "Todo not found", nil, nil)
		return
	}
	todo.Status = constants.STATUS_DELETED
	todo.DeletedAt.Time = time.Now()
	todo.DeletedAt.Valid = true
	database.DB.Save(&todo)
	helper.Response(c, http.StatusOK, "Todo deleted successfully", &todo, nil)
}
