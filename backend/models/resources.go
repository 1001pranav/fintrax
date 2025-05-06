package models

import "gorm.io/gorm"

type Resources struct {
	gorm.Model
	ID     uint    `json:"resource_id" gorm:"primaryKey;autoIncrement:true"`
	Type   uint    `json:"type" gorm:"default:1;check:type >= 1 AND type <= 4"`
	MiscID uint    `json:"misc_id" gorm:"default:0;"`
	Link   *string `json:"link" gorm:"nullable"`
	TodoID uint    `json:"todo_id"`
	Todo   Todo    `gorm:"foreignKey:TodoID"`
}
