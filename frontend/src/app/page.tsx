"use client";
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    // Grid, // Removed Grid
    AppBar,
    Toolbar,
} from "@mui/material";
import { useState, useEffect } from "react";

// Icons

import InsightsIcon from '@mui/icons-material/Insights'; // Example icon for Fintrax
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import TimelineIcon from '@mui/icons-material/Timeline';
import LogoutIcon from '@mui/icons-material/Logout';

import BrandPresentationComponent from "@/components/home/BrandPresentation";
import Login from "@/components/home/Login";
import { Screen } from "@/constants/constant";
import Register from "@/components/home/Register";


export default function Home() {
    const [screenStatus, setScreenStatus] = useState<Screen>(Screen.Login);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const localStorageUser = localStorage.getItem('user');
            if (localStorageUser) {
                try {
                    const parsedUser = JSON.parse(localStorageUser);
                    if (parsedUser && parsedUser.id) {
                        setScreenStatus(Screen.Dashboard);
                    }
                } catch (error) {
                    console.error("Failed to parse user from localStorage", error);
                    localStorage.removeItem('user');
                }
            }
        }
    }, []);

    
    const handleLogout = () => {
        localStorage.removeItem('user');
        setScreenStatus(Screen.Login);
    };

    //Handle this later
    if (screenStatus === Screen.Dashboard) {
        const features = [
            { IconComp: AccountBalanceWalletIcon, title: "Manage Finances", desc: "Track income, expenses, and budgets.", color: "#6B73FF" },
            { IconComp: PlaylistAddCheckIcon, title: "Organize ToDos", desc: "Create, prioritize, and manage tasks.", color: "#30C9A9" },
            { IconComp: TimelineIcon, title: "Plan Roadmap", desc: "Visualize project timelines and goals.", color: "#FFB627" },
        ];

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(to bottom right, #e0eafc, #cfdef3)' }}>
                <AppBar position="static" elevation={1} sx={{ background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)" }}>
                    <Toolbar>
                        <InsightsIcon sx={{ mr: 1.5, fontSize: '2rem' }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Fintrax
                        </Typography>
                        <Button
                            color="inherit"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Paper
                        elevation={8}
                        sx={{
                            p: { xs: 3, sm: 5, md: 7 },
                            textAlign: 'center',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
                            width: '100%', // Ensure paper takes available width
                        }}
                    >
                        <Typography
                            variant="h2"
                            component="h1"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                                background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2
                            }}
                        >
                            Welcome to Fintrax!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 5, maxWidth: '650px', lineHeight: 1.7, fontWeight: 300, mx: 'auto' }}>
                            Your unified platform for mastering Finances, organizing ToDo Lists, and visualizing Roadmaps with clarity and precision.
                        </Typography>

                        {/* Feature Cards using Flexbox */}
                        <Box
                            sx={(theme) => ({
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center', // Centers items in the last row if not full
                                gap: theme.spacing(3), // Space between cards (e.g., 24px if theme.spacing(1) = 8px)
                                mb: 5,
                            })}
                        >
                            {features.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={(theme) => ({
                                        display: 'flex', // Make this a flex container to allow Paper to stretch
                                        flexDirection: 'column',
                                        // Calculate width to achieve desired items per row, accounting for gap
                                        width: {
                                            xs: '100%', // 1 item per row
                                            sm: `calc(50% - ${theme.spacing(1.5)})`, // 2 items per row (gap/2)
                                            md: `calc(100% / 3 - ${theme.spacing(2)})` // 3 items per row (2*gap/3)
                                        },
                                        minWidth: '260px', // Minimum width before wrapping or shrinking too much
                                    })}
                                >
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            borderColor: 'rgba(0,0,0,0.08)',
                                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: `0 10px 20px rgba(0,0,0,0.1)`,
                                            },
                                            height: '100%', // Ensure paper takes full height of its parent Box
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center', // Center content within paper
                                        }}
                                    >
                                        <item.IconComp sx={{ fontSize: 48, color: item.color, mb: 1.5, mx: 'auto' }} />
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>{item.desc}</Typography>
                                    </Paper>
                                </Box>
                            ))}
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => alert("Navigating to dashboard...")}
                            sx={{
                                mt: 2,
                                borderRadius: '12px',
                                py: 1.5,
                                px: 5,
                                fontWeight: 'bold',
                                background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
                                color: 'white',
                                '&:hover': {
                                    background: "linear-gradient(135deg, #5A63FF 0%, #000BCF 100%)",
                                    boxShadow: '0 6px 20px rgba(0, 13, 255, 0.3)',
                                }
                            }}
                        >
                            Explore Dashboard
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // Logged-out view (Login Page) remains the same as previous version
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: '100vw' }}>
            <BrandPresentationComponent />
            {
                screenStatus === Screen.Login && 
                <Login setScreenStatus={setScreenStatus}/>
            }
            {
                screenStatus === Screen.Register &&
                <Register setScreenStatus={setScreenStatus} />
            }
        </Box>
    );
}
