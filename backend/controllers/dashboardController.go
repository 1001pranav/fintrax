package controllers

import (
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {
	userId, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}
	userID := userId.(int)

	var finance models.Finance
	var todo models.Todo
	var roadmap []models.Roadmap

	db := database.DB
	db.Where("user_id = ?", userID).First(&finance)
	db.Where("user_id = ? AND is_roadmap = ?", userID, false).Find(&todo)
	db.Where("user_id = ? AND is_roadmap = ? AND is_active = ?", userID, true, true).Find(&roadmap)

	dashboard := gin.H{
		"total_balance":   finance.Balance,
		"total_todo":      len(todo.Task),
		"active_roadmaps": len(roadmap),
	}

	helper.Response(c, http.StatusOK, "Dashboard retrieved successfully", dashboard, nil)

}
