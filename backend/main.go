package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"fintrax-backend/constants"
	"fintrax-backend/database"
	"fintrax-backend/middleware"
	"fintrax-backend/routes"
)

func main() {
	// Connect to PostgreSQL
	database.ConnectDatabase()
	// Run migrations
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	db_name := os.Getenv("DB_NAME")
	m, err := migrate.New(
		"file://migrations",
		fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
			user, password, host, port, db_name))
	if err != nil {
		panic(fmt.Sprintf("Failed to create migration instance: %v", err))
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		panic(fmt.Sprintf("Failed to run migrations: %v", err))
	} else {
		fmt.Println("Migrations applied successfully!")
	}
	// Create router
	r := gin.Default()
	// CORS setup for React frontend
	r.Use(cors.Default())

	// Handle panic globally
	r.Use(middleware.RecoveryMiddleware())

	// Routes
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Welcome to %s API", constants.APP_NAME)})
	})

	routes.UserRoute(r.Group("/api"))
	routes.TodoRoute(r.Group("/api"))
	routes.DashboardRoutes(r.Group("/api"))

	// Run server
	r.Run(constants.APP_PORT)
}
