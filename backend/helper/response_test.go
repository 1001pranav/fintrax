package helper

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestResponse(t *testing.T) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	data := gin.H{"foo": "bar"}
	Response(c, http.StatusCreated, "created", data, nil)

	assert.Equal(t, http.StatusCreated, w.Code)

	var resp APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, resp.Status)
	assert.Equal(t, "created", resp.Message)
	assert.Nil(t, resp.Err)
	m := resp.Data.(map[string]interface{})
	assert.Equal(t, "bar", m["foo"])
}
