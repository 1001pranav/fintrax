package controllers

import (
	"math/rand"
	"net/http"
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

	var newUser = models.Users{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
		Status:   constants.USER_STATUS_INACTIVE,
	}
	var tx = database.DB.Begin()

	tx.Create(&newUser)
	var finance = models.Finance{
		UserID:    newUser.ID,
		Balance:   0,
		TotalDebt: 0,
	}
	tx.Create(&finance)
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
	currentTime := time.Now()
	timeDiff := currentTime.Sub(user.OTPTime)
	if user.OTP != 0 && timeDiff > time.Duration(constants.OTP_REGENERATION_TIME)*time.Minute {
		helper.Response(
			c,
			http.StatusTooManyRequests,
			"OTP already generated, please wait before generating a new one",
			nil,
			nil,
		)
		return
	}

	// Sending OTP via email is commented out for now
	// err := helper.SendEmail(user.Email, "OTP for password reset", "Your OTP is: "+string(user.OTP))
	// if err != nil {
	// 	helper.Response(c, http.StatusInternalServerError, "Failed to send OTP", nil, err)
	// 	return
	// }
	otp := rand.Intn(constants.MAX_OTP_LENGTH-constants.MIN_OTP_LENGTH) + constants.MIN_OTP_LENGTH

	user.OTP = uint(otp)
	user.OTPTime = time.Now()
	database.DB.Save(&user)

	response := generateOTPResponse{
		OTP: uint(otp),
	}
	helper.Response(c, http.StatusOK, "OTP generated successfully", response, nil)
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
