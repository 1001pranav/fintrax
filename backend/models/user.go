package models

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	ID       uint      `gorm:"primaryKey;autoIncrement:true"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
	OTP      uint      `json:"otp"`
	OTPTime  time.Time `json:"otp_time"`
}
