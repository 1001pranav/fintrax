package models

import "gorm.io/gorm"

type Users struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey;autoIncrement:true"`
	Username string `json:"username"`
	Password string `json:"password"`
}
