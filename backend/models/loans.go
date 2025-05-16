package models

import "gorm.io/gorm"

type Loans struct {
	gorm.Model
	ID            uint    `json:"loan_id" gorm:"primaryKey;autoIncrement:true"`
	Name          string  `json:"name"`
	TotalAmount   float64 `json:"total_amount"`
	Rate          float64 `json:"rate"`
	Term          uint    `json:"term"`           // Total Loan Term
	Duration      uint    `json:"duration"`       // At what time premium needs to be paid
	PremiumAmount float64 `json:"premium_amount"` // Per month Premium Amount
	UserID        uint    `json:"user_id"`
	User          Users   `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Status        uint    `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
