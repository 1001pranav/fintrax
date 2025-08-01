package helper

import "testing"

func TestHashAndCheckPassword(t *testing.T) {
    password := "secret123"
    hash, err := HashPassword(password)
    if err != nil {
        t.Fatalf("expected no error, got %v", err)
    }
    if len(hash) == 0 {
        t.Fatalf("expected hash to be non-empty")
    }
    if !CheckPasswordHash(password, hash) {
        t.Errorf("expected CheckPasswordHash to return true for correct password")
    }
    if CheckPasswordHash("wrongpassword", hash) {
        t.Errorf("expected CheckPasswordHash to return false for incorrect password")
    }
}

