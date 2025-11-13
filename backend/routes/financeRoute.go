package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func FinanceRoute(router *gin.RouterGroup) {
	// Finance overview routes
	fRoute := router.Group("/finance", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		fRoute.GET("/", controllers.GetFinance)
		fRoute.PATCH("/", controllers.UpdateFinance)
	}

	// Transaction routes
	tRoute := router.Group("/transactions", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		tRoute.POST("/", controllers.CreateTransaction)
		tRoute.GET("/", controllers.GetAllTransactions)
		tRoute.GET("/:id", controllers.GetTransaction)
		tRoute.PATCH("/:id", controllers.UpdateTransaction)
		tRoute.DELETE("/:id", controllers.DeleteTransaction)
	}

	// Savings routes
	sRoute := router.Group("/savings", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		sRoute.POST("/", controllers.CreateSavings)
		sRoute.GET("/", controllers.GetAllSavings)
		sRoute.GET("/:id", controllers.GetSavings)
		sRoute.PATCH("/:id", controllers.UpdateSavings)
		sRoute.DELETE("/:id", controllers.DeleteSavings)
	}

	// Loans routes
	lRoute := router.Group("/loans", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		lRoute.POST("/", controllers.CreateLoan)
		lRoute.GET("/", controllers.GetAllLoans)
		lRoute.GET("/:id", controllers.GetLoan)
		lRoute.PATCH("/:id", controllers.UpdateLoan)
		lRoute.DELETE("/:id", controllers.DeleteLoan)
	}
}
