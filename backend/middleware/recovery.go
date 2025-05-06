package middleware

import (
	"fintrax-backend/helper"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RecoveryMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				// c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
				if r != nil {
					err, ok := r.(error)
					if !ok {
						err = fmt.Errorf("%v", r)
					}
					helper.Response(c, http.StatusInternalServerError, "Internal server error", nil, err.Error())
				} else {
					helper.Response(c, http.StatusInternalServerError, "Internal server error", nil, nil)
				}
				c.Abort()
			}
		}()
		c.Next()
	}
}
