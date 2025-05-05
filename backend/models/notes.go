package models

import "gorm.io/gorm"

type Notes struct {
	gorm.Model
	ID   uint   `json:"note_id" gorm:"primaryKey;autoIncrement:true"`
	Text string `json:"text"`
}
