package helper

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateAndVerifyToken(t *testing.T) {
	os.Setenv("JWT_SECRET", "testsecret")
	token, err := CreateToken(42)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	userID, err := VerifyToken(token)
	assert.NoError(t, err)
	assert.Equal(t, 42, userID)
}

func TestVerifyTokenInvalid(t *testing.T) {
	os.Setenv("JWT_SECRET", "testsecret")
	_, err := VerifyToken("invalid")
	assert.Error(t, err)
}
