package middleware

import (
	"net/http"
	"sync"
	"time"

	"fintrax-backend/helper"

	"github.com/gin-gonic/gin"
)

// RateLimiter stores request counts per IP address
type RateLimiter struct {
	requests map[string]*ClientRequests
	mu       sync.RWMutex
	limit    int           // Maximum requests allowed
	window   time.Duration // Time window for rate limiting
}

// ClientRequests tracks requests for a specific client
type ClientRequests struct {
	count     int
	firstSeen time.Time
}

// NewRateLimiter creates a new rate limiter
// limit: number of requests allowed per window
// window: time duration for the rate limit window
func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		requests: make(map[string]*ClientRequests),
		limit:    limit,
		window:   window,
	}

	// Cleanup goroutine to remove expired entries
	go rl.cleanupExpired()

	return rl
}

// cleanupExpired removes expired rate limit entries every minute
func (rl *RateLimiter) cleanupExpired() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()
		for ip, req := range rl.requests {
			if now.Sub(req.firstSeen) > rl.window {
				delete(rl.requests, ip)
			}
		}
		rl.mu.Unlock()
	}
}

// isAllowed checks if a request from the given IP is allowed
func (rl *RateLimiter) isAllowed(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()

	// Check if IP exists in our records
	if req, exists := rl.requests[ip]; exists {
		// Check if the time window has passed
		if now.Sub(req.firstSeen) > rl.window {
			// Reset the counter for a new window
			rl.requests[ip] = &ClientRequests{
				count:     1,
				firstSeen: now,
			}
			return true
		}

		// Check if limit is exceeded
		if req.count >= rl.limit {
			return false
		}

		// Increment the counter
		req.count++
		return true
	}

	// First request from this IP
	rl.requests[ip] = &ClientRequests{
		count:     1,
		firstSeen: now,
	}
	return true
}

// RateLimitMiddleware returns a Gin middleware for rate limiting
func (rl *RateLimiter) RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get client IP
		ip := c.ClientIP()

		// Check if request is allowed
		if !rl.isAllowed(ip) {
			helper.Response(
				c,
				http.StatusTooManyRequests,
				"Too many requests. Please try again later.",
				nil,
				nil,
			)
			c.Abort()
			return
		}

		c.Next()
	}
}

// Global rate limiter instances
var (
	// General rate limiter: 100 requests per minute
	GeneralLimiter = NewRateLimiter(100, 1*time.Minute)

	// Strict rate limiter for auth endpoints: 5 requests per minute
	AuthLimiter = NewRateLimiter(5, 1*time.Minute)

	// OTP rate limiter: 3 requests per 5 minutes
	OTPLimiter = NewRateLimiter(3, 5*time.Minute)
)

// RateLimitGeneral is a middleware for general API endpoints
func RateLimitGeneral() gin.HandlerFunc {
	return GeneralLimiter.RateLimitMiddleware()
}

// RateLimitAuth is a middleware for authentication endpoints
func RateLimitAuth() gin.HandlerFunc {
	return AuthLimiter.RateLimitMiddleware()
}

// RateLimitOTP is a middleware for OTP generation endpoints
func RateLimitOTP() gin.HandlerFunc {
	return OTPLimiter.RateLimitMiddleware()
}
