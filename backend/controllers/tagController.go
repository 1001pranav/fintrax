package controllers

import (
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type tagRequest struct {
	Name string `json:"name" binding:"required"`
}

type tagResponse struct {
	ID   uint   `json:"tag_id"`
	Name string `json:"name"`
}

func CreateTag(c *gin.Context) {
	var req tagRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	tag := models.Tag{
		Name: req.Name,
	}

	tx := database.DB.Begin()
	if err := tx.Create(&tag).Error; err != nil {
		tx.Rollback()
		helper.Response(c, http.StatusInternalServerError, "Failed to create tag", nil, err.Error())
		return
	}
	tx.Commit()

	response := tagResponse{
		ID:   tag.ID,
		Name: tag.Name,
	}
	helper.Response(c, http.StatusCreated, "Tag created successfully", response, nil)
}

func GetAllTags(c *gin.Context) {
	var tags []models.Tag
	database.DB.Find(&tags)

	response := make([]tagResponse, len(tags))
	for i, tag := range tags {
		response[i] = tagResponse{
			ID:   tag.ID,
			Name: tag.Name,
		}
	}
	helper.Response(c, http.StatusOK, "Tags fetched successfully", response, nil)
}

func GetTag(c *gin.Context) {
	id := c.Param("id")
	var tag models.Tag

	if err := database.DB.Where("id = ?", id).First(&tag).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Tag not found", nil, nil)
		return
	}

	response := tagResponse{
		ID:   tag.ID,
		Name: tag.Name,
	}
	helper.Response(c, http.StatusOK, "Tag fetched successfully", response, nil)
}

func UpdateTag(c *gin.Context) {
	id := c.Param("id")
	var req tagRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var tag models.Tag
	if err := database.DB.Where("id = ?", id).First(&tag).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Tag not found", nil, nil)
		return
	}

	if req.Name != "" {
		tag.Name = req.Name
	}

	database.DB.Save(&tag)

	response := tagResponse{
		ID:   tag.ID,
		Name: tag.Name,
	}
	helper.Response(c, http.StatusOK, "Tag updated successfully", response, nil)
}

func DeleteTag(c *gin.Context) {
	id := c.Param("id")
	var tag models.Tag

	if err := database.DB.Where("id = ?", id).First(&tag).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Tag not found", nil, nil)
		return
	}

	tag.DeletedAt.Time = time.Now()
	tag.DeletedAt.Valid = true
	database.DB.Delete(&tag)

	helper.Response(c, http.StatusOK, "Tag deleted successfully", &tag, nil)
}

// AssignTagToTodo - Assign a tag to a todo
func AssignTagToTodo(c *gin.Context) {
	todoID := c.Param("id")
	var req struct {
		TagID uint `json:"tag_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	// Check if todo exists
	var todo models.Todo
	if err := database.DB.Where("id = ?", todoID).First(&todo).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Todo not found", nil, nil)
		return
	}

	// Check if tag exists
	var tag models.Tag
	if err := database.DB.Where("id = ?", req.TagID).First(&tag).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Tag not found", nil, nil)
		return
	}

	// Check if association already exists
	var existingTodoTag models.TodoTags
	if err := database.DB.Where("todo_id = ? AND tag_id = ?", todoID, req.TagID).First(&existingTodoTag).Error; err == nil {
		helper.Response(c, http.StatusConflict, "Tag already assigned to todo", nil, nil)
		return
	}

	todoTag := models.TodoTags{
		TodoID: todo.ID,
		TagID:  tag.ID,
	}

	if err := database.DB.Create(&todoTag).Error; err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to assign tag to todo", nil, err.Error())
		return
	}

	helper.Response(c, http.StatusOK, "Tag assigned to todo successfully", todoTag, nil)
}

// RemoveTagFromTodo - Remove a tag from a todo
func RemoveTagFromTodo(c *gin.Context) {
	todoID := c.Param("id")
	tagID := c.Param("tagId")

	var todoTag models.TodoTags
	if err := database.DB.Where("todo_id = ? AND tag_id = ?", todoID, tagID).First(&todoTag).Error; err != nil {
		helper.Response(c, http.StatusNotFound, "Tag assignment not found", nil, nil)
		return
	}

	database.DB.Delete(&todoTag)
	helper.Response(c, http.StatusOK, "Tag removed from todo successfully", nil, nil)
}

// GetTodoTags - Get all tags for a specific todo
func GetTodoTags(c *gin.Context) {
	todoID := c.Param("id")

	var todoTags []models.TodoTags
	database.DB.Preload("Tag").Where("todo_id = ?", todoID).Find(&todoTags)

	tags := make([]tagResponse, len(todoTags))
	for i, todoTag := range todoTags {
		var tag models.Tag
		database.DB.Where("id = ?", todoTag.TagID).First(&tag)
		tags[i] = tagResponse{
			ID:   tag.ID,
			Name: tag.Name,
		}
	}

	helper.Response(c, http.StatusOK, "Tags fetched successfully", tags, nil)
}
