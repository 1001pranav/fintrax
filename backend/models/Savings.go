package models

import (
	"time"

	"gorm.io/gorm"
)

type Savings struct {
	gorm.Model
	ID           uint      `json:"saving_id" gorm:"primaryKey;autoIncrement:true"`
	Name         string    `json:"name"`
	Amount       float64   `json:"amount"`
	TargetAmount float64   `json:"target_amount"`
	Rate         float64   `json:"rate"`
	UserID       uint      `json:"user_id"`
	User         Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	UpdatedAt    time.Time `json:"updated_at"`
	Status       uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
