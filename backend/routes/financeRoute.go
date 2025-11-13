package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func FinanceRoute(router *gin.RouterGroup) {
	fRoute := router.Group("/finance", middleware.RateLimitGeneral(), middleware.Authorization())
	{
		fRoute.GET("/", controllers.GetFinance)
		fRoute.PUT("/", controllers.UpdateFinance)
		fRoute.GET("/summary", controllers.GetFinanceSummary)
	}
}
