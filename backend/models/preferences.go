package models

import (
	"gorm.io/gorm"
)

type UserPreferences struct {
	gorm.Model
	ID     uint `gorm:"primaryKey;autoIncrement:true"`
	UserID uint `json:"user_id" gorm:"uniqueIndex;not null"`
	User   Users `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	// Appearance
	Theme        string `json:"theme" gorm:"default:'light';check:theme IN ('light', 'dark', 'system')"`
	ColorScheme  string `json:"color_scheme" gorm:"default:'blue'"` // primary color theme
	FontSize     string `json:"font_size" gorm:"default:'medium';check:font_size IN ('small', 'medium', 'large')"`

	// Language & Localization
	Language     string `json:"language" gorm:"default:'en'"`
	Timezone     string `json:"timezone" gorm:"default:'UTC'"`
	DateFormat   string `json:"date_format" gorm:"default:'MM/DD/YYYY'"`
	TimeFormat   string `json:"time_format" gorm:"default:'12h';check:time_format IN ('12h', '24h')"`
	Currency     string `json:"currency" gorm:"default:'USD'"`

	// Notifications
	EmailNotifications    bool `json:"email_notifications" gorm:"default:true"`
	PushNotifications     bool `json:"push_notifications" gorm:"default:true"`
	TaskReminders         bool `json:"task_reminders" gorm:"default:true"`
	ProjectUpdates        bool `json:"project_updates" gorm:"default:true"`
	FinanceAlerts         bool `json:"finance_alerts" gorm:"default:true"`
	WeeklyDigest          bool `json:"weekly_digest" gorm:"default:false"`

	// Privacy
	ProfileVisibility     string `json:"profile_visibility" gorm:"default:'private';check:profile_visibility IN ('public', 'private', 'friends')"`
	ShowOnlineStatus      bool   `json:"show_online_status" gorm:"default:true"`
	AllowDataCollection   bool   `json:"allow_data_collection" gorm:"default:true"`

	// Finance Settings
	DefaultTransactionType uint   `json:"default_transaction_type" gorm:"default:2"` // 2 = expense
	ShowBalance            bool   `json:"show_balance" gorm:"default:true"`
	BudgetWarnings         bool   `json:"budget_warnings" gorm:"default:true"`

	// Dashboard & Display
	DefaultDashboardView   string `json:"default_dashboard_view" gorm:"default:'overview'"`
	TasksPerPage           int    `json:"tasks_per_page" gorm:"default:20"`
	CompactMode            bool   `json:"compact_mode" gorm:"default:false"`
}
