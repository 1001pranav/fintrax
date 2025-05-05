package models

import (
	"time"

	"gorm.io/gorm"
)

type Roadmap struct {
	gorm.Model
	ID        uint      `json:"roadmap_id" gorm:"primaryKey;autoIncrement:true"`
	Name      string    `json:"name"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Progress  float64   `json:"progress"`
	Todos     []Todo    `json:"todos" gorm:"foreignKey:RoadmapID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Status    uint      `json:"status" gorm:"default:1;check:status >= 1 AND status <= 6"`
}
