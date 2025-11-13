package controllers

import (
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"fintrax-backend/constants"
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
type generateOTPRequest struct {
	Email string `json:"email" binding:"required"`
}
type generateOTPResponse struct {
	OTP uint `json:"otp"`
}

type forgotPasswordRequest struct {
	Email    string `json:"email"  binding:"required"`
	Password string `json:"password"  binding:"required"`
	OTP      string `json:"otp"  binding:"required"`
}
type resetPasswordRequest struct {
	Email       string `json:"email"  binding:"required"`
	OldPassword string `json:"old_password"  binding:"required"`
	NewPassword string `json:"new_password"  binding:"required"`
}

func Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var user []models.Users
	//.Or("username = ?", req.Username)
	database.DB.Where("email = ?", req.Email).Find(&user)
	if len(user) > 0 {
		helper.Response(c, http.StatusConflict, "User already exists", nil, nil)
		return
	}

	hashedPassword, err := helper.HashPassword(req.Password)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to hash password", nil, err)
		return
	}

	// Generate OTP for email verification
	otp := rand.Intn(constants.MAX_OTP_LENGTH-constants.MIN_OTP_LENGTH+1) + constants.MIN_OTP_LENGTH

	var newUser = models.Users{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
		Status:   constants.USER_STATUS_INACTIVE,
		OTP:      uint(otp),
		OTPTime:  time.Now(),
	}
	var tx = database.DB.Begin()

	tx.Create(&newUser)
	var finance = models.Finance{
		UserID:    newUser.ID,
		Balance:   0,
		TotalDebt: 0,
	}
	tx.Create(&finance)

	// Send OTP verification email
	emailBody := "Welcome to Fintrax!\n\nYour OTP for email verification is: " + strconv.Itoa(otp) + "\n\nThis OTP is valid for " + strconv.Itoa(constants.MAX_OTP_TIME) + " minutes.\n\nPlease verify your email to start using Fintrax."
	err = helper.SendEmail(newUser.Email, "Fintrax - Verify Your Email", emailBody)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "User created but failed to send verification email", nil, err.Error())
		tx.Rollback()
		return
	}

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

	if user.Status != constants.USER_STATUS_ACTIVE {

		helper.Response(c, http.StatusForbidden, "Please verify Email first", nil, nil)
		return
	}
	if req.Password == "" {
		helper.Response(c, http.StatusForbidden, "Required Password to login", nil, nil)
		return
	}
	validPassword := helper.CheckPasswordHash(req.Password, user.Password)
	if !validPassword {
		helper.Response(c, http.StatusUnauthorized, "Invalid credentials", nil, nil)
		return
	}

	token, err := helper.CreateToken(user.ID)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to Login, Try again in sometime", nil, err.Error())
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

func GenerateOTP(c *gin.Context) {
	var req generateOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var user models.Users
	database.DB.Where("email = ?", req.Email).First(&user)
	if user.ID == 0 {
		helper.Response(c, http.StatusNotFound, "User not found", nil, nil)
		return
	}
	if user.OTP != 0 && time.Since(user.OTPTime) < time.Duration(constants.OTP_REGENERATION_TIME)*time.Minute {
		helper.Response(
			c,
			http.StatusTooManyRequests,
			"OTP already generated, please wait before generating a new one",
			nil,
			nil,
		)
		return
	}

	otp := rand.Intn(constants.MAX_OTP_LENGTH-constants.MIN_OTP_LENGTH+1) + constants.MIN_OTP_LENGTH

	user.OTP = uint(otp)
	user.OTPTime = time.Now()
	database.DB.Save(&user)

	// Send OTP via email
	emailBody := "Your OTP for password reset is: " + strconv.Itoa(otp) + "\n\nThis OTP is valid for " + strconv.Itoa(constants.MAX_OTP_TIME) + " minutes.\n\nIf you did not request this, please ignore this email."
	err := helper.SendEmail(user.Email, "Fintrax - OTP for Password Reset", emailBody)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to send OTP email", nil, err.Error())
		return
	}

	response := generateOTPResponse{
		OTP: uint(otp),
	}
	helper.Response(c, http.StatusOK, "OTP sent to your email successfully", response, nil)
}

func ForgotPassword(c *gin.Context) {
	var req forgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var user models.Users
	database.DB.Where("email = ?", req.Email).First(&user)
	if user.ID == 0 {
		helper.Response(c, http.StatusNotFound, "User not found", nil, nil)
		return
	}

	if user.OTP == 0 || user.OTPTime.IsZero() ||
		time.Now().After(user.OTPTime.Add(time.Duration(constants.MAX_OTP_TIME)*time.Minute)) {
		helper.Response(c, http.StatusBadRequest, "OTP not generated or expired", nil, nil)
		return
	}

	hashedPassword, err := helper.HashPassword(req.Password)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to hash password", nil, err)
		return
	}
	user.Password = hashedPassword
	database.DB.Save(&user)
	helper.Response(c, http.StatusOK, "Password updated successfully", nil, nil)
}

func ResetPassword(c *gin.Context) {
	var req resetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var user models.Users
	database.DB.Where("email = ?", req.Email).First(&user)
	if user.ID == 0 {
		helper.Response(c, http.StatusNotFound, "User not found", nil, nil)
		return
	}

	validPassword := helper.CheckPasswordHash(req.OldPassword, user.Password)
	if !validPassword {
		helper.Response(c, http.StatusUnauthorized, "Invalid credentials", nil, nil)
		return
	}

	hashedPassword, err := helper.HashPassword(req.NewPassword)
	if err != nil {
		helper.Response(c, http.StatusInternalServerError, "Failed to hash password", nil, err)
		return
	}
	user.Password = hashedPassword
	database.DB.Save(&user)
	helper.Response(c, http.StatusOK, "Password updated successfully", nil, nil)
}

func VerifyEmail(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required"`
		OTP   uint   `json:"OTP" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.Response(c, http.StatusBadRequest, "Invalid request", nil, err.Error())
		return
	}

	var user models.Users
	database.DB.Where("email = ?", req.Email).First(&user)
	if user.ID == 0 {
		helper.Response(c, http.StatusNotFound, "User not found", nil, nil)
		return
	}

	if user.OTP == 0 ||
		user.OTPTime.IsZero() ||
		time.Now().After(user.OTPTime.Add(time.Duration(constants.MAX_OTP_TIME)*time.Minute)) {
		helper.Response(c, http.StatusBadRequest, "OTP not generated or expired", nil, nil)
		return
	}
	if user.OTP == 0 || uint(req.OTP) != user.OTP {
		helper.Response(c, http.StatusBadRequest, "Invalid OTP", nil, nil)
		return
	}
	user.Status = constants.USER_STATUS_ACTIVE
	// user.IsVerified = true
	database.DB.Save(&user)

	helper.Response(c, http.StatusOK, "Email verified successfully", nil, nil)
}
