package models

import "gorm.io/gorm"

const (
	RESOURCE_TYPE_LINK  = 1
	RESOURCE_TYPE_AUDIO = 2
	RESOURCE_TYPE_VIDEO = 3
	RESOURCE_TYPE_NOTES = 4
)

type Resources struct {
	gorm.Model
	ID     uint    `json:"resource_id" gorm:"primaryKey;autoIncrement:true"`
	Type   uint    `json:"type" gorm:"default:1;check:type >= 1 AND type <= 4"`
	MiscID uint    `json:"misc_id" gorm:"default:0;"`
	Link   *string `json:"link" gorm:"nullable"`
	TodoID uint    `json:"todo_id"`
	Todo   Todo    `gorm:"foreignKey:TodoID"`
}
