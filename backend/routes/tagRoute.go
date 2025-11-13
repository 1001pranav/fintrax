package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func TagRoute(router *gin.RouterGroup) {
	tRoute := router.Group("/tags", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		tRoute.POST("/", controllers.CreateTag)
		tRoute.GET("/", controllers.GetAllTags)
		tRoute.GET("/:id", controllers.GetTag)
		tRoute.PATCH("/:id", controllers.UpdateTag)
		tRoute.DELETE("/:id", controllers.DeleteTag)
	}

	// Todo tags routes
	ttRoute := router.Group("/todo", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		ttRoute.POST("/:id/tags", controllers.AssignTagToTodo)
		ttRoute.DELETE("/:id/tags/:tagId", controllers.RemoveTagFromTodo)
		ttRoute.GET("/:id/tags", controllers.GetTodoTags)
	}
}
