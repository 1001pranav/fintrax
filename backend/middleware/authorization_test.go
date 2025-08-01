package middleware

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"fintrax-backend/helper"
)

func TestAuthorizationMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	os.Setenv("JWT_SECRET", "secret")
	token, err := helper.CreateToken(7)
	assert.NoError(t, err)

	r := gin.New()
	r.GET("/protected", Authorization(), func(c *gin.Context) {
		id := c.GetInt("user_id")
		c.JSON(http.StatusOK, gin.H{"user_id": id})
	})

	// Request with valid token
	req, _ := http.NewRequest("GET", "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// Request without token
	req2, _ := http.NewRequest("GET", "/protected", nil)
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)
	assert.Equal(t, http.StatusUnauthorized, w2.Code)
}
