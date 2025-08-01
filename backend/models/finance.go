package models

import (
	"time"

	"gorm.io/gorm"
)

type Finance struct {
	gorm.Model
	ID        uint      `json:"finance_id" gorm:"primaryKey;autoIncrement:true"`
	Balance   float64   `json:"balance"`
	TotalDebt float64   `json:"total_debt"`
	UserID    uint      `json:"user_id"`
	User      Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	UpdatedAt time.Time `json:"updated_at"`
	Status    uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
