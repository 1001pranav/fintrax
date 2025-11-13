package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func ProjectRoute(router *gin.RouterGroup) {
	pRoute := router.Group("/projects", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		pRoute.POST("/", controllers.CreateProject)
		pRoute.GET("/", controllers.GetAllProjects)
		pRoute.GET("/:id", controllers.GetProject)
		pRoute.PATCH("/:id", controllers.UpdateProject)
		pRoute.DELETE("/:id", controllers.DeleteProject)
	}
}
