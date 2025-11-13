package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SavingsRoute(router *gin.RouterGroup) {
	sRoute := router.Group("/savings", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		sRoute.POST("/", controllers.CreateSavings)
		sRoute.GET("/", controllers.GetAllSavings)
		sRoute.GET("/:id", controllers.GetSavings)
		sRoute.PATCH("/:id", controllers.UpdateSavings)
		sRoute.DELETE("/:id", controllers.DeleteSavings)
	}
}
