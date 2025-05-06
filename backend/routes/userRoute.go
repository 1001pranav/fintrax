package routes

import (
	"fintrax-backend/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.RouterGroup) {
	uRoute := router.Group("/user")
	{
		uRoute.POST("/register", controllers.Register)
		uRoute.POST("/login", controllers.Login)
	}

}
