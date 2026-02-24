package controllers

import (
	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type preferencesRequest struct {
	// Appearance
	Theme       string `json:"theme" binding:"omitempty,oneof=light dark system"`
	ColorScheme string `json:"color_scheme"`
	FontSize    string `json:"font_size" binding:"omitempty,oneof=small medium large"`

	// Language & Localization
	Language   string `json:"language"`
	Timezone   string `json:"timezone"`
	DateFormat string `json:"date_format"`
	TimeFormat string `json:"time_format" binding:"omitempty,oneof=12h 24h"`
	Currency   string `json:"currency"`

	// Notifications
	EmailNotifications *bool `json:"email_notifications"`
	PushNotifications  *bool `json:"push_notifications"`
	TaskReminders      *bool `json:"task_reminders"`
	ProjectUpdates     *bool `json:"project_updates"`
	FinanceAlerts      *bool `json:"finance_alerts"`
	WeeklyDigest       *bool `json:"weekly_digest"`

	// Privacy
	ProfileVisibility   string `json:"profile_visibility" binding:"omitempty,oneof=public private friends"`
	ShowOnlineStatus    *bool  `json:"show_online_status"`
	AllowDataCollection *bool  `json:"allow_data_collection"`

	// Finance Settings
	DefaultTransactionType *uint `json:"default_transaction_type"`
	ShowBalance            *bool `json:"show_balance"`
	BudgetWarnings         *bool `json:"budget_warnings"`

	// Dashboard & Display
	DefaultDashboardView string `json:"default_dashboard_view"`
	TasksPerPage         *int   `json:"tasks_per_page"`
	CompactMode          *bool  `json:"compact_mode"`
}

type preferencesResponse struct {
	ID     uint `json:"id"`
	UserID uint `json:"user_id"`

	// Appearance
	Theme       string `json:"theme"`
	ColorScheme string `json:"color_scheme"`
	FontSize    string `json:"font_size"`

	// Language & Localization
	Language   string `json:"language"`
	Timezone   string `json:"timezone"`
	DateFormat string `json:"date_format"`
	TimeFormat string `json:"time_format"`
	Currency   string `json:"currency"`

	// Notifications
	EmailNotifications bool `json:"email_notifications"`
	PushNotifications  bool `json:"push_notifications"`
	TaskReminders      bool `json:"task_reminders"`
	ProjectUpdates     bool `json:"project_updates"`
	FinanceAlerts      bool `json:"finance_alerts"`
	WeeklyDigest       bool `json:"weekly_digest"`

	// Privacy
	ProfileVisibility   string `json:"profile_visibility"`
	ShowOnlineStatus    bool   `json:"show_online_status"`
	AllowDataCollection bool   `json:"allow_data_collection"`

	// Finance Settings
	DefaultTransactionType uint `json:"default_transaction_type"`
	ShowBalance            bool `json:"show_balance"`
	BudgetWarnings         bool `json:"budget_warnings"`

	// Dashboard & Display
	DefaultDashboardView string `json:"default_dashboard_view"`
	TasksPerPage         int    `json:"tasks_per_page"`
	CompactMode          bool   `json:"compact_mode"`
}

// GetPreferences retrieves user preferences (creates default if not exists)
func GetPreferences(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var preferences models.UserPreferences
	result := database.DB.Where("user_id = ?", userID).First(&preferences)

	// If preferences don't exist, create default preferences
	if result.Error != nil {
		preferences = models.UserPreferences{
			UserID: uint(userID.(int)),
		}
		if err := database.DB.Create(&preferences).Error; err != nil {
			helper.Response(c, http.StatusInternalServerError, "Failed to create preferences", nil, err.Error())
			return
		}
	}

	response := preferencesResponse{
		ID:                     preferences.ID,
		UserID:                 preferences.UserID,
		Theme:                  preferences.Theme,
		ColorScheme:            preferences.ColorScheme,
		FontSize:               preferences.FontSize,
		Language:               preferences.Language,
		Timezone:               preferences.Timezone,
		DateFormat:             preferences.DateFormat,
		TimeFormat:             preferences.TimeFormat,
		Currency:               preferences.Currency,
		EmailNotifications:     preferences.EmailNotifications,
		PushNotifications:      preferences.PushNotifications,
		TaskReminders:          preferences.TaskReminders,
		ProjectUpdates:         preferences.ProjectUpdates,
		FinanceAlerts:          preferences.FinanceAlerts,
		WeeklyDigest:           preferences.WeeklyDigest,
		ProfileVisibility:      preferences.ProfileVisibility,
		ShowOnlineStatus:       preferences.ShowOnlineStatus,
		AllowDataCollection:    preferences.AllowDataCollection,
		DefaultTransactionType: preferences.DefaultTransactionType,
		ShowBalance:            preferences.ShowBalance,
		BudgetWarnings:         preferences.BudgetWarnings,
		DefaultDashboardView:   preferences.DefaultDashboardView,
		TasksPerPage:           preferences.TasksPerPage,
		CompactMode:            preferences.CompactMode,
	}

	helper.Response(c, http.StatusOK, "Preferences fetched successfully", response, nil)
}

// UpdatePreferences updates user preferences (partial update supported)
func UpdatePreferences(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var req preferencesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var preferences models.UserPreferences
	result := database.DB.Where("user_id = ?", userID).First(&preferences)

	// If preferences don't exist, create new
	if result.Error != nil {
		preferences = models.UserPreferences{
			UserID: uint(userID.(int)),
		}
	}

	// Update only provided fields (partial update)
	if req.Theme != "" {
		preferences.Theme = req.Theme
	}
	if req.ColorScheme != "" {
		preferences.ColorScheme = req.ColorScheme
	}
	if req.FontSize != "" {
		preferences.FontSize = req.FontSize
	}
	if req.Language != "" {
		preferences.Language = req.Language
	}
	if req.Timezone != "" {
		preferences.Timezone = req.Timezone
	}
	if req.DateFormat != "" {
		preferences.DateFormat = req.DateFormat
	}
	if req.TimeFormat != "" {
		preferences.TimeFormat = req.TimeFormat
	}
	if req.Currency != "" {
		preferences.Currency = req.Currency
	}

	// Boolean fields (use pointers to distinguish between false and not-provided)
	if req.EmailNotifications != nil {
		preferences.EmailNotifications = *req.EmailNotifications
	}
	if req.PushNotifications != nil {
		preferences.PushNotifications = *req.PushNotifications
	}
	if req.TaskReminders != nil {
		preferences.TaskReminders = *req.TaskReminders
	}
	if req.ProjectUpdates != nil {
		preferences.ProjectUpdates = *req.ProjectUpdates
	}
	if req.FinanceAlerts != nil {
		preferences.FinanceAlerts = *req.FinanceAlerts
	}
	if req.WeeklyDigest != nil {
		preferences.WeeklyDigest = *req.WeeklyDigest
	}
	if req.ShowOnlineStatus != nil {
		preferences.ShowOnlineStatus = *req.ShowOnlineStatus
	}
	if req.AllowDataCollection != nil {
		preferences.AllowDataCollection = *req.AllowDataCollection
	}
	if req.ShowBalance != nil {
		preferences.ShowBalance = *req.ShowBalance
	}
	if req.BudgetWarnings != nil {
		preferences.BudgetWarnings = *req.BudgetWarnings
	}
	if req.CompactMode != nil {
		preferences.CompactMode = *req.CompactMode
	}

	if req.ProfileVisibility != "" {
		preferences.ProfileVisibility = req.ProfileVisibility
	}
	if req.DefaultTransactionType != nil {
		preferences.DefaultTransactionType = *req.DefaultTransactionType
	}
	if req.DefaultDashboardView != "" {
		preferences.DefaultDashboardView = req.DefaultDashboardView
	}
	if req.TasksPerPage != nil {
		preferences.TasksPerPage = *req.TasksPerPage
	}

	// Save preferences
	if result.Error != nil {
		// Create new preferences
		if err := database.DB.Create(&preferences).Error; err != nil {
			helper.Response(c, http.StatusInternalServerError, "Failed to create preferences", nil, err.Error())
			return
		}
	} else {
		// Update existing preferences
		if err := database.DB.Save(&preferences).Error; err != nil {
			helper.Response(c, http.StatusInternalServerError, "Failed to update preferences", nil, err.Error())
			return
		}
	}

	response := preferencesResponse{
		ID:                     preferences.ID,
		UserID:                 preferences.UserID,
		Theme:                  preferences.Theme,
		ColorScheme:            preferences.ColorScheme,
		FontSize:               preferences.FontSize,
		Language:               preferences.Language,
		Timezone:               preferences.Timezone,
		DateFormat:             preferences.DateFormat,
		TimeFormat:             preferences.TimeFormat,
		Currency:               preferences.Currency,
		EmailNotifications:     preferences.EmailNotifications,
		PushNotifications:      preferences.PushNotifications,
		TaskReminders:          preferences.TaskReminders,
		ProjectUpdates:         preferences.ProjectUpdates,
		FinanceAlerts:          preferences.FinanceAlerts,
		WeeklyDigest:           preferences.WeeklyDigest,
		ProfileVisibility:      preferences.ProfileVisibility,
		ShowOnlineStatus:       preferences.ShowOnlineStatus,
		AllowDataCollection:    preferences.AllowDataCollection,
		DefaultTransactionType: preferences.DefaultTransactionType,
		ShowBalance:            preferences.ShowBalance,
		BudgetWarnings:         preferences.BudgetWarnings,
		DefaultDashboardView:   preferences.DefaultDashboardView,
		TasksPerPage:           preferences.TasksPerPage,
		CompactMode:            preferences.CompactMode,
	}

	helper.Response(c, http.StatusOK, "Preferences updated successfully", response, nil)
}

// ResetPreferences resets user preferences to default
func ResetPreferences(c *gin.Context) {
	userID, isExists := c.Get("user_id")
	if !isExists {
		helper.Response(c, http.StatusUnauthorized, "Unauthorized", nil, nil)
		return
	}

	var preferences models.UserPreferences
	result := database.DB.Where("user_id = ?", userID).First(&preferences)

	if result.Error != nil {
		helper.Response(c, http.StatusNotFound, "Preferences not found", nil, nil)
		return
	}

	// Delete existing preferences
	database.DB.Delete(&preferences)

	// Create new default preferences
	newPreferences := models.UserPreferences{
		UserID: uint(userID.(int)),
	}

	if err := database.DB.Create(&newPreferences).Error; err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to reset preferences", nil, err.Error())
		return
	}

	response := preferencesResponse{
		ID:                     newPreferences.ID,
		UserID:                 newPreferences.UserID,
		Theme:                  newPreferences.Theme,
		ColorScheme:            newPreferences.ColorScheme,
		FontSize:               newPreferences.FontSize,
		Language:               newPreferences.Language,
		Timezone:               newPreferences.Timezone,
		DateFormat:             newPreferences.DateFormat,
		TimeFormat:             newPreferences.TimeFormat,
		Currency:               newPreferences.Currency,
		EmailNotifications:     newPreferences.EmailNotifications,
		PushNotifications:      newPreferences.PushNotifications,
		TaskReminders:          newPreferences.TaskReminders,
		ProjectUpdates:         newPreferences.ProjectUpdates,
		FinanceAlerts:          newPreferences.FinanceAlerts,
		WeeklyDigest:           newPreferences.WeeklyDigest,
		ProfileVisibility:      newPreferences.ProfileVisibility,
		ShowOnlineStatus:       newPreferences.ShowOnlineStatus,
		AllowDataCollection:    newPreferences.AllowDataCollection,
		DefaultTransactionType: newPreferences.DefaultTransactionType,
		ShowBalance:            newPreferences.ShowBalance,
		BudgetWarnings:         newPreferences.BudgetWarnings,
		DefaultDashboardView:   newPreferences.DefaultDashboardView,
		TasksPerPage:           newPreferences.TasksPerPage,
		CompactMode:            newPreferences.CompactMode,
	}

	helper.Response(c, http.StatusOK, "Preferences reset to default", response, nil)
}
