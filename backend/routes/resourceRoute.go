package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func ResourceRoute(router *gin.RouterGroup) {
	rRoute := router.Group("/resources", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		rRoute.POST("/", controllers.CreateResource)
		rRoute.GET("/:id", controllers.GetResource)
		rRoute.PATCH("/:id", controllers.UpdateResource)
		rRoute.DELETE("/:id", controllers.DeleteResource)
	}

	// Todo resources routes
	trRoute := router.Group("/todo", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		trRoute.GET("/:id/resources", controllers.GetTodoResources)
	}
}
