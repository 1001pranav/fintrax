package models

import (
	"time"

	"gorm.io/gorm"
)

type Transactions struct {
	gorm.Model
	ID              uint      `gorm:"primaryKey;autoIncrement:true"`
	Source          string    `json:"source" gorm:"size:150"`
	Amount          float64   `json:"amount"`
	Type            uint      `json:"type" gorm:"default:1;check:type >= 1 AND type <= 2"` // 1 = income, 2 = expense
	TransactionType uint      `json:"transaction_type" gorm:"default:1;check:transaction_type >= 1 AND transaction_type <= 5"`
	Category        string    `json:"category"`
	NotesID         *uint     `json:"notes_id" gorm:"nullable"`
	Date            time.Time `json:"date"`
	UserID          uint      `json:"user_id" gorm:"not null"`
	User            Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Notes           Notes     `gorm:"foreignKey:NotesID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Status          uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
