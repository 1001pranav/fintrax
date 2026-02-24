package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func TransactionRoute(router *gin.RouterGroup) {
	tRoute := router.Group("/transactions", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		// Register routes with and without trailing slash to avoid redirect issues with CORS
		tRoute.POST("", controllers.CreateTransaction)
		tRoute.POST("/", controllers.CreateTransaction)
		tRoute.GET("", controllers.GetAllTransactions)
		tRoute.GET("/", controllers.GetAllTransactions)
		tRoute.GET("/summary", controllers.GetTransactionSummary)
		tRoute.GET("/:id", controllers.GetTransaction)
		tRoute.PATCH("/:id", controllers.UpdateTransaction)
		tRoute.DELETE("/:id", controllers.DeleteTransaction)
	}
}
