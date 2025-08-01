package helper

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashAndCheckPassword(t *testing.T) {
	password := "secret"
	hashed, err := HashPassword(password)
	assert.NoError(t, err)
	assert.NotEqual(t, password, hashed)
	assert.True(t, CheckPasswordHash(password, hashed))
	assert.False(t, CheckPasswordHash("wrong", hashed))
}

