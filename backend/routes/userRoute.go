package routes

import (
	"fintrax-backend/controllers"
	"fintrax-backend/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.RouterGroup) {
	uRoute := router.Group("/user")
	{
		// Apply strict rate limiting to auth endpoints
		uRoute.POST("/register", middleware.RateLimitAuth(), controllers.Register)
		uRoute.POST("/verify-email", middleware.RateLimitAuth(), controllers.VerifyEmail)
		uRoute.POST("/login", middleware.RateLimitAuth(), controllers.Login)

		// Apply OTP-specific rate limiting (more restrictive)
		uRoute.POST("/generate-otp", middleware.RateLimitOTP(), controllers.GenerateOTP)

		// Apply auth rate limiting to password endpoints
		uRoute.POST("/forgot-password", middleware.RateLimitAuth(), controllers.ForgotPassword)
		uRoute.POST("/reset-password", middleware.RateLimitAuth(), controllers.ResetPassword)

		// Refresh token endpoint
		uRoute.POST("/refresh-token", middleware.RateLimitAuth(), controllers.RefreshToken)
	}

}
