package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"fintrax-backend/database"
	"fintrax-backend/helper"
	"fintrax-backend/models"
)

type loginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password"  binding:"required"`
}

type loginResponse struct {
	Token    string `json:"token"`
	UserID   uint   `json:"user_id"`
	Email    string `json:"email"`
	UserName string `json:"username"`
}

type registerRequest struct {
	Username string `json:"username"  binding:"required"`
	Email    string `json:"email"  binding:"required"`
	Password string `json:"password"  binding:"required"`
}

type registerResponse struct {
	ID       uint   `json:"user_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Token    string `json:"token"`
}

func Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var user []models.Users
	database.DB.Where("email = ?", req.Email).Or("username = ?", req.Username).Find(&user)
	if len(user) > 0 {
		helper.Response(c, http.StatusConflict, "User already exists", nil, nil)
		return
	}

	hashedPassword, err := helper.HashPassword(req.Password)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to hash password", nil, err)
		return
	}

	var newUser = models.Users{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	}
	var tx = database.DB.Begin()

	tx.Create(&newUser)
	token, err := helper.CreateToken(newUser.ID)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to create token", nil, err)
		tx.Rollback()
		return
	}
	response := registerResponse{
		ID:       newUser.ID,
		Username: newUser.Username,
		Email:    newUser.Email,
		Token:    token,
	}
	// This defer function is used to handle any panic that may occur during the transaction.
	// If a panic occurs, the transaction will be rolled back.
	// If no panic occurs, the transaction will be committed when the function returns.
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			// re-panic so that the error can be handled by the outer function
			panic(r)
		} else {
			tx.Commit()
		}
	}()

	helper.Response(c, http.StatusCreated, "User created successfully", response, nil)
}

func Login(c *gin.Context) {

	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var user models.Users
	database.DB.Where("email = ?", req.Email).First(&user)
	if user.ID == 0 {
		helper.Response(c, http.StatusUnauthorized, "Invalid credentials", nil, nil)
		return
	}

	validPassword := helper.CheckPasswordHash(req.Password, user.Password)
	if !validPassword {
		helper.Response(c, http.StatusUnauthorized, "Invalid credentials", nil, nil)
		return
	}

	token, err := helper.CreateToken(user.ID)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to create token", nil, err.Error())
		return
	}

	var loginResponseHandler = loginResponse{
		Token:    token,
		UserID:   user.ID,
		Email:    user.Email,
		UserName: user.Username,
	}

	helper.Response(c, http.StatusOK, "Login successful", loginResponseHandler, nil)
}
