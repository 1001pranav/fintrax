package models

import "gorm.io/gorm"

type Finance struct {
	gorm.Model
	ID       uint    `gorm:"primaryKey;autoIncrement:true"`
	Amount   float64 `json:"amount"`
	Type     uint    `json:"type" gorm:"default:1;check:type >= 1 AND type <= 2"` // 1 = income, 2 = expense
	Category string  `json:"category"`
	NotesID  *uint   `json:"notes_id" gorm:"nullable"`
	Notes    Notes   `gorm:"foreignKey:NotesID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
