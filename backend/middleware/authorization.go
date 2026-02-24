package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"fintrax-backend/helper"
)

func Authorization() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip authorization for OPTIONS requests (CORS preflight)
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		const bearerPrefix = "Bearer "

		if authHeader == "" || !strings.HasPrefix(authHeader, bearerPrefix) {
			helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
			c.Abort()
			return
		}

		accessToken := strings.TrimSpace(authHeader[len(bearerPrefix):])
		if accessToken == "" {
			helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
			c.Abort()
			return
		}

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
