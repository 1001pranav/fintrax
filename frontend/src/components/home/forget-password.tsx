"use client"

import { 
    ForgotPasswordContainer, 
    ForgotPassword as forgotPasswordStyle,
    LoginBox, 
    LoginBoxContainer, 
    LoginButton, 
    LoginContainer, 
    LoginTitle, 
} from "@/styles/home/login";
import EmailIcon from '@mui/icons-material/Email';

import LoginIcon from '@mui/icons-material/Login';
import TextFieldComponent from "@/components/general/input";
import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import InsightsIcon from '@mui/icons-material/Insights'; 
// import { login } from "@/services/userService";

import  { constants, interfaces } from "@/constants";
import { forgotPassword, resetPassword } from "@/services/userService";

const ForgotPassword: React.FC<interfaces.LoginProps> = ({setScreenStatus}) => {
    // const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<interfaces.ForgetPassword>({
        email: "",
        OTP: ""
    });
    const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<{newPassword: boolean, confirmPassword: boolean}>({
        newPassword: false,
        confirmPassword: false
    });

    const togglePasswordVisibility = (field: 'newPassword' | 'confirmPassword') => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value && !/^\d*$/.test(value)) return; // Only allow numbers
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
        
        // Update the OTP in user state
        setUser(prev => ({ ...prev, OTP: newOtp.join('') }));
    };
    
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };
    
    const validateOtp = () => {
        if (otp.some(digit => !digit)) {
            setError("Please enter all OTP digits");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        return true;
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        if (!isResetPassword) {
            // First step: Request OTP
            if (!user.email) {
                setError("Please enter your email address");
                return;
            }
            // TODO: Call API to send OTP
            const data = forgotPassword(user.email);
            data.then(() => {
                console.log("OTP sent successfully");
                setIsResetPassword(true);
            }).catch((error) => {
                console.error("Failed to send OTP", error);
                error.json().then((errorData: interfaces.APIErrorResponse) => {
                    console.error("Error data:", errorData);
                    setError(errorData.message);
                });
            })
        } else {
            // Second step: Validate OTP and reset password
            if (!validateOtp()) {
                return;
            }
            
            // TODO: Call API to reset password
            const data = resetPassword(user.email, newPassword, (user.OTP  || 
                ""
            ).toString() );
            data.then(() => {
                console.log("Password reset successfully");
                setScreenStatus(constants.Screen.Login);
            }).catch((error) => {
                console.error("Failed to reset password", error);
                error.json().then((errorData: interfaces.APIErrorResponse) => {
                    console.error("Error data:", errorData);
                    setError(errorData.message);
                });
            })
            console.log("Resetting password with OTP:", user.OTP);
            // setScreenStatus(constants.Screen.Login);
        }
    };

    return (
        
            <Box sx={LoginContainer} >
            <Paper elevation={12} sx={LoginBox}>
                <Box sx={LoginBoxContainer}>
                    <InsightsIcon sx={LoginTitle} />
                    <Typography variant="h4" fontWeight="bold" color="primary.dark" gutterBottom>
                    Forgot Password
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                    No worries! Enter Email Address and Reset password with new OTP.
                    </Typography>
                </Box>
                {error && (
                    <Typography variant="body2" color="error" align="center">
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleSubmit}>
                {!isResetPassword ? (
                    <TextFieldComponent 
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={user.email}
                        onChange={(e) => {
                            setUser(prev => ({ ...prev, email: e.target.value }));
                            if (error) setError(null);
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <EmailIcon sx={{ color: 'action.active' }} />
                            </InputAdornment>
                        }
                        inputPropsSx={{ borderRadius: '12px' }}
                    />
                ) : (
                    <>
                        <Typography variant="body1" color="text.secondary" align="center" mb={2}>
                            Enter the 4-digit OTP sent to {user.email}
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={2} mb={3}>
                            {[0, 1, 2, 3].map((index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    value={otp[index]}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    maxLength={1}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        borderRadius: '8px',
                                        border: error ? '1px solid #f44336' : '1px solid #ccc',
                                    }}
                                />
                            ))}
                        </Box>
                        <TextFieldComponent 
                            label="New Password"
                            type={showPassword.newPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            inputPropsSx={{ borderRadius: '12px' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => togglePasswordVisibility('newPassword')}
                                            edge="end"
                                        >
                                            {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextFieldComponent 
                            label="Confirm New Password"
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            inputPropsSx={{ borderRadius: '12px' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                            edge="end"
                                        >
                                            {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </>
                )}
                
                <Box sx={ForgotPasswordContainer}>
                    <Button onClick={() => {
                        setScreenStatus(constants.Screen.Login)
                    }} sx={forgotPasswordStyle}>
                        Remember Password? click to login again
                    </Button>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={LoginButton}
                    endIcon={!isResetPassword ? <LoginIcon /> : null}
                >
                    {isResetPassword ? 'Reset Password' : 'Send OTP'}
                </Button>
                {isResetPassword && (
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => setIsResetPassword(false)}
                    >
                        Back to Email
                    </Button>
                )}
                </form>
            </Paper>
        </Box>
    )
}

export default ForgotPassword;