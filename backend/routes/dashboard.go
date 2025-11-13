package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func DashboardRoutes(router *gin.RouterGroup) {
	dRoute := router.Group("/dashboard", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		dRoute.GET("/", controllers.GetDashboard)
	}
}
