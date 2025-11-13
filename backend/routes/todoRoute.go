package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func TodoRoute(router *gin.RouterGroup) {
	tRoute := router.Group("/todo", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		tRoute.POST("/", controllers.CreateToDo)
		tRoute.GET("/", controllers.GetAllToDos)
		tRoute.GET("/:id", controllers.GetToDo)
		tRoute.PATCH("/:id", controllers.UpdateToDo)
		tRoute.DELETE("/:id", controllers.DeleteToDo)
	}

}
