package models

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	ID   uint   `json:"tag_id" gorm:"primaryKey;autoIncrement:true"`
	Name string `json:"name"`
}
