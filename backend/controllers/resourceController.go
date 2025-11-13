package controllers

import (
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type resourceRequest struct {
	Type   uint    `json:"type" binding:"required,gte=1,lte=4"` // 1=Link, 2=Audio, 3=Video, 4=Notes
	MiscID uint    `json:"misc_id"`
	Link   *string `json:"link"`
	TodoID uint    `json:"todo_id" binding:"required"`
}

type resourceResponse struct {
	ID     uint    `json:"resource_id"`
	Type   uint    `json:"type"`
	MiscID uint    `json:"misc_id"`
	Link   *string `json:"link"`
	TodoID uint    `json:"todo_id"`
}

func CreateResource(c *gin.Context) {
	var req resourceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	// Check if todo exists
	var todo models.Todo
	if err := database.DB.Where("id = ?", req.TodoID).First(&todo).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Todo not found", nil, nil)
		return
	}

	resource := models.Resources{
		Type:   req.Type,
		MiscID: req.MiscID,
		Link:   req.Link,
		TodoID: req.TodoID,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&resource).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create resource", nil, err.Error())
		return
	}
	tx.Commit()

	response := resourceResponse{
		ID:     resource.ID,
		Type:   resource.Type,
		MiscID: resource.MiscID,
		Link:   resource.Link,
		TodoID: resource.TodoID,
	}
	helper.Response(c, http.StatusCreated, "Resource created successfully", response, nil)
}

func GetTodoResources(c *gin.Context) {
	todoID := c.Param("id")

	var resources []models.Resources
	database.DB.Where("todo_id = ?", todoID).Find(&resources)

	response := make([]resourceResponse, len(resources))
	for i, resource := range resources {
		response[i] = resourceResponse{
			ID:     resource.ID,
			Type:   resource.Type,
			MiscID: resource.MiscID,
			Link:   resource.Link,
			TodoID: resource.TodoID,
		}
	}
	helper.Response(c, http.StatusOK, "Resources fetched successfully", response, nil)
}

func GetResource(c *gin.Context) {
	id := c.Param("id")
	var resource models.Resources

	if err := database.DB.Where("id = ?", id).First(&resource).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Resource not found", nil, nil)
		return
	}

	response := resourceResponse{
		ID:     resource.ID,
		Type:   resource.Type,
		MiscID: resource.MiscID,
		Link:   resource.Link,
		TodoID: resource.TodoID,
	}
	helper.Response(c, http.StatusOK, "Resource fetched successfully", response, nil)
}

func UpdateResource(c *gin.Context) {
	id := c.Param("id")
	var req resourceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var resource models.Resources
	if err := database.DB.Where("id = ?", id).First(&resource).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Resource not found", nil, nil)
		return
	}

	if req.Type != 0 {
		resource.Type = req.Type
	}
	if req.MiscID != 0 {
		resource.MiscID = req.MiscID
	}
	if req.Link != nil {
		resource.Link = req.Link
	}
	if req.TodoID != 0 {
		resource.TodoID = req.TodoID
	}

	database.DB.Save(&resource)

	response := resourceResponse{
		ID:     resource.ID,
		Type:   resource.Type,
		MiscID: resource.MiscID,
		Link:   resource.Link,
		TodoID: resource.TodoID,
	}
	helper.Response(c, http.StatusOK, "Resource updated successfully", response, nil)
}

func DeleteResource(c *gin.Context) {
	id := c.Param("id")
	var resource models.Resources

	if err := database.DB.Where("id = ?", id).First(&resource).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Resource not found", nil, nil)
		return
	}

	resource.DeletedAt.Time = time.Now()
	resource.DeletedAt.Valid = true
	database.DB.Delete(&resource)

	helper.Response(c, http.StatusOK, "Resource deleted successfully", &resource, nil)
}
