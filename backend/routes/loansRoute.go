package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func LoansRoute(router *gin.RouterGroup) {
	lRoute := router.Group("/loans", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		lRoute.POST("/", controllers.CreateLoan)
		lRoute.GET("/", controllers.GetAllLoans)
		lRoute.GET("/:id", controllers.GetLoan)
		lRoute.PATCH("/:id", controllers.UpdateLoan)
		lRoute.DELETE("/:id", controllers.DeleteLoan)
	}
}
