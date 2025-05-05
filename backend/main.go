package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"fintrax-backend/constants"
	"fintrax-backend/database"
)

func main() {
	// Connect to PostgreSQL
	database.ConnectDatabase()

	// Create router
	r := gin.Default()

	// CORS setup for React frontend
	r.Use(cors.Default())

	// Routes
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Welcome to %s API", constants.APP_NAME)})
	})

	// INCOME
	// r.GET("/income", GetIncome)

	// // EXPENSE
	// r.POST("/expense", AddExpense)

	// // TODO
	// r.GET("/todos", GetTodos)

	// Run server
	r.Run(constants.APP_PORT)
}
