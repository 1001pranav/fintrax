package models

import (
	"gorm.io/gorm"
)

type Project struct {
	gorm.Model
	ID          uint   `json:"project_id" gorm:"primaryKey;autoIncrement:true"`
	Name        string `json:"name" gorm:"not null"`
	Description string `json:"description" gorm:"size:1000"`
	Color       string `json:"color"`
	CoverImage  string `json:"cover_image" gorm:"default:NULL"`
	Status      uint   `json:"status" gorm:"default:1;check:status >= 1 AND status <= 3"` // 1: Active, 2: Archived, 3: Deleted
	gorm.DeletedAt

	// User relationship
	UserID uint  `json:"user_id"`
	Users  Users `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	// Tasks relationship
	Tasks []Todo `json:"tasks" gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
