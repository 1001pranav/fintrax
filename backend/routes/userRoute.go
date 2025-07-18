package routes

import (
	"fintrax-backend/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.RouterGroup) {
	uRoute := router.Group("/user")
	{
		uRoute.POST("/register", controllers.Register)
		uRoute.POST("/verify-email", controllers.VerifyEmail)
		uRoute.POST("/login", controllers.Login)
		uRoute.POST("/generate-otp", controllers.GenerateOTP)
		uRoute.POST("/forgot-password", controllers.ForgotPassword)
		uRoute.POST("/reset-password", controllers.ResetPassword)
	}

}
