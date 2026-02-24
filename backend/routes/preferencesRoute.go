package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func PreferencesRoute(router *gin.RouterGroup) {
	prefRoute := router.Group("/preferences", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		// Register routes with and without trailing slash to avoid redirect issues with CORS
		prefRoute.GET("", controllers.GetPreferences)
		prefRoute.GET("/", controllers.GetPreferences)
		prefRoute.PUT("", controllers.UpdatePreferences)
		prefRoute.PUT("/", controllers.UpdatePreferences)
		prefRoute.PATCH("", controllers.UpdatePreferences)
		prefRoute.PATCH("/", controllers.UpdatePreferences)
		prefRoute.POST("/reset", controllers.ResetPreferences)
		prefRoute.POST("/reset/", controllers.ResetPreferences)
	}
}
