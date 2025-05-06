package helper

import "github.com/gin-gonic/gin"

type APIResponse struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Err     interface{} `json:"error,omitempty"`
}

func Response(c *gin.Context, status int, message string, data interface{}, err interface{}) {
	c.JSON(status, APIResponse{
		Status:  status,
		Message: message,
		Data:    data,
		Err:     err,
	})
}
