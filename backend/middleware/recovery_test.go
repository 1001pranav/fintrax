package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestRecoveryMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(RecoveryMiddleware())
	r.GET("/panic", func(c *gin.Context) {
		panic("boom")
	})

	req, _ := http.NewRequest("GET", "/panic", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusInternalServerError, w.Code)
}
