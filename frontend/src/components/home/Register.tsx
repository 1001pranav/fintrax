"use client"

import { 
    ForgotPassword, 
    ForgotPasswordContainer, 
    LoginBox, 
    LoginBoxContainer, 
    LoginButton, 
    LoginContainer, 
    LoginTitle, 
    RegisterButton 
} from "@/styles/home/login";
import PersonIcon from '@mui/icons-material/Person';
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
    Link
} from "@mui/material";

import InsightsIcon from '@mui/icons-material/Insights'; 
import { register } from "@/services/userService";
import  { constants, interfaces } from "@/constants";

const Register: React.FC<interfaces.RegisterProps> = ({setScreenStatus}) => {
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [user, setUser] = useState<interfaces.RegisterObject>({
        username: "",
        password: "",
        email: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            if (error) {
                return;
            }
            if (user.username && user.password && user.email) {
                // const mockUser = { id: "123", username: user.username, token: "fake-jwt-token" };
                // const data = login(user.username, user.password);
                const data = register(user.email, user.password, user.username)
                data.then((response) => {
                    localStorage.setItem('user', JSON.stringify(response));
                    setScreenStatus(constants.Screen.Dashboard)
                }).catch((error) => {
                    console.log("Login failed", error);
                    error.json().then((errorData: interfaces.APIErrorResponse) => {
                        console.log("Error data: ", errorData);
                        setError(errorData.message);
                    })
                    // alert("Login failed. Please check your credentials.");
                })
            } else {
                setError("Please fill in all fields.");
            }
        } catch (error) {
            console.log("Error in handleLogin: ", error);
            
        }
    };
    const handleScreenChange = (screen: constants.Screen) => {
        setScreenStatus(screen);
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
                    <Typography variant="body2" color="error" align="center" sx={{ marginBottom: '16px' }}>
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleRegister}>
                <TextFieldComponent 
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={user.username}
                    onChange={(e) => {
                        setUser({ ...user, username: e.target.value });
                        setError(null); 
                    }}
                    startAdornment={(
                        <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'action.active' }} />
                        </InputAdornment>
                    )}
                    inputPropsSx={{ borderRadius: '12px' }}
                />
                <TextFieldComponent 
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={user.email}
                    onChange={(e) => {
                        setUser({ ...user, email: e.target.value });
                        setError(null);
                    }}
                    startAdornment={(
                        <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'action.active' }} />
                        </InputAdornment>
                    )}
                    inputPropsSx={{ borderRadius: '12px' }}
                />
                <TextFieldComponent
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={user.password}
                    onChange={(e) => {
                        setUser({ ...user, password: e.target.value });
                        setError(null);
                    }}
                    startAdornment={(
                        <InputAdornment position="start">
                            <LockIcon sx={{ color: 'action.active' }} />
                        </InputAdornment>
                    )}
                    endAdornment = {(
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
                    )}
                    sx= {{ borderRadius: '12px' }}
                />
                <Box sx={ForgotPasswordContainer}>
                    <Link href="#" variant="body2" sx={ForgotPassword}>
                        Forgot password?
                    </Link>
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
                    Already have an account?{" "}
                    <Button
                        onClick={() => handleScreenChange(constants.Screen.Login)}
                        sx={RegisterButton}
                    >
                        Sign up
                    </Button>
                </Typography>
                </form>
            </Paper>
        </Box>
    )
}

export default Register;