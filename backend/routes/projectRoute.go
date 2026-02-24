package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func ProjectRoute(router *gin.RouterGroup) {
	pRoute := router.Group("/projects", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		// Register routes with and without trailing slash to avoid redirect issues with CORS
		pRoute.POST("", controllers.CreateProject)
		pRoute.POST("/", controllers.CreateProject)
		pRoute.GET("", controllers.GetAllProjects)
		pRoute.GET("/", controllers.GetAllProjects)
		pRoute.GET("/:id", controllers.GetProject)
		pRoute.PATCH("/:id", controllers.UpdateProject)
		pRoute.DELETE("/:id", controllers.DeleteProject)
	}
}
