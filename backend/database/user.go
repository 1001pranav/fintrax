package database

import (
	"fintrax-backend/models"
)

func MigrateUsers() {
	DB.AutoMigrate(&models.Users{})
}

func CreateUser(user models.Users) {
	DB.Create(&user)
}
