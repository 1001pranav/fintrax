"use client"

import {
    ForgotPassword,
    ForgotPasswordContainer,
    LoginBox,
    LoginBoxContainer,
    LoginButton,
    LoginContainer,
    LoginTitle,
    LoginTextField,
    RegisterButton,
} from "@/styles/home/login";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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

import InsightsIcon from '@mui/icons-material/Insights'; 
import { login } from "@/services/userService";

import  { constants, interfaces } from "@/constants";

const Login: React.FC<interfaces.LoginProps> = ({setScreenStatus}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<interfaces.LoginObject>({
        username: "",
        password: "",
    });
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("API Called");
        e.preventDefault();
        if (error) {
            return;
        }
        if (user.username && user.password) {
            // const mockUser = { id: "123", username: user.username, token: "fake-jwt-token" };
            const data = login(user.username, user.password);
            data.then((response) => {
                localStorage.setItem('user', JSON.stringify(response));
                setScreenStatus(constants.Screen.Dashboard)
            }).catch((error) => {
                console.error("Login failed", error);
                error.json().then((errorData: interfaces.APIErrorResponse) => {
                    console.error("Error data:", errorData);
                    setError(errorData.message);
                });
            })
        } else {
            setError("Please enter both username and password.");
        }
    };

    return (
        
            <Box sx={LoginContainer} >
            <Paper elevation={12} sx={LoginBox}>
                <Box sx={LoginBoxContainer}>
                    <InsightsIcon sx={LoginTitle} />
                    <Typography variant="h4" fontWeight="bold" color="primary.dark" gutterBottom>
                        Welcome Back!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Sign in to continue to Fintrax.
                    </Typography>
                </Box>
                {error && (
                    <Typography variant="body2" color="error" align="center">
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleLogin}>
                <TextFieldComponent
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={user.username}
                    onChange={(e) => {
                        setUser({ ...user, username: e.target.value });
                        if (error) {
                            setError(null);
                        }
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <EmailIcon sx={{ color: 'action.active' }} />
                        </InputAdornment>
                    }
                    sx={LoginTextField}
                />
                <TextFieldComponent
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    value={user.password}
                    onChange={(e) => {
                        setUser({ ...user, password: e.target.value });
                        if (error) {
                            setError(null);
                        }
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <LockIcon sx={{ color: 'action.active' }} />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(event) => event.preventDefault()}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    sx={LoginTextField}
                />
                <Box sx={ForgotPasswordContainer}>
                    <Button onClick={() => {
                        setScreenStatus(constants.Screen.ForgotPassword)
                    }} sx={ForgotPassword}>
                        Forgot Password?
                    </Button>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    endIcon={<LoginIcon />}
                    sx={LoginButton}
                    disabled={error  ? true : false}
                    style={{ pointerEvents: error ? 'none' : 'auto' }}
                >
                    Sign In
                </Button>
                <Typography variant="body2" align="center" color="text.secondary">
                    Don&apos;t have an account?{" "}
                    <Button onClick={() => {
                        setScreenStatus(constants.Screen.Register)
                    }} sx={RegisterButton}>
                        Sign Up
                    </Button>
                </Typography>
                </form>
            </Paper>
        </Box>
    )
}

export default Login;
