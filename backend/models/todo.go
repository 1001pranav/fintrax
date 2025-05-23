package models

import (
	"time"

	"gorm.io/gorm"
)

type Todo struct {
	gorm.Model
	ID          uint      `json:"task_id" gorm:"primaryKey;autoIncrement:true"`
	Task        string    `json:"task"`
	Description string    `json:"description" gorm:"size:1000"`
	IsRoadmap   bool      `json:"is_roadmap"`
	Priority    uint      `json:"priority" gorm:"default:5;check:priority >= 0 AND priority <= 5"`
	DueDays     uint      `json:"due_days" gorm:"default:0"` //Number of days required to complete a certain task
	EndDate     time.Time `json:"end_date" gorm:"default:NULL"`
	StartDate   time.Time `json:"start_date" gorm:"default:NULL"`
	Status      uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"` //
	gorm.DeletedAt
	// defined in constants

	// Self-referencing Subtasks
	ParentID *uint  `json:"parent_id" gorm:"default:NULL;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Nullable pointer
	Subtasks []Todo `json:"subtasks" gorm:"foreignKey:ParentID"`

	// User relationship
	UserID uint  `json:"user_id"`
	Users  Users `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	// Roadmap relationship
	RoadmapID *uint   `json:"roadmap_id" gorm:"default:NULL;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Roadmap   Roadmap `gorm:"foreignKey:RoadmapID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	// Resources relationship
	Resources []Resources `json:"resources" gorm:"foreignKey:TodoID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	NotesID *uint `json:"notes_id" gorm:"default:NULL"`
	Notes   Notes `gorm:"foreignKey:NotesID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
