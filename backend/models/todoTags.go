package models

import "gorm.io/gorm"

type TodoTags struct {
	gorm.Model
	ID     uint `gorm:"primaryKey;autoIncrement:true"`
	TodoID uint `json:"todo_id"`
	Todo   Todo `gorm:"foreignKey:TodoID"`
	TagID  uint `json:"tag_id"`
	Tag    Tag  `gorm:"foreignKey:TagID"`
}
