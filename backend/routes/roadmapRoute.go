package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func RoadmapRoute(router *gin.RouterGroup) {
	rRoute := router.Group("/roadmaps", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		rRoute.POST("/", controllers.CreateRoadmap)
		rRoute.GET("/", controllers.GetAllRoadmaps)
		rRoute.GET("/:id", controllers.GetRoadmap)
		rRoute.PATCH("/:id", controllers.UpdateRoadmap)
		rRoute.DELETE("/:id", controllers.DeleteRoadmap)
	}
}
