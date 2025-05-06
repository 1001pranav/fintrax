package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"fintrax-backend/helper"
)

func Authorization() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("Authorization middleware")
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
			c.Abort()
			return
		}
		accessToken := authHeader[len("Bearer "):]
		userID, err := helper.VerifyToken(accessToken)
		if err != nil {
			helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
			c.Abort()
			return
		}

		c.Set("user_id", userID)
		c.Next()
	}
}
