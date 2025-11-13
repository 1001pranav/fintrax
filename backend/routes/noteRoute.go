package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func NoteRoute(router *gin.RouterGroup) {
	nRoute := router.Group("/notes", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		nRoute.POST("/", controllers.CreateNote)
		nRoute.GET("/:id", controllers.GetNote)
		nRoute.PATCH("/:id", controllers.UpdateNote)
		nRoute.DELETE("/:id", controllers.DeleteNote)
	}
}
