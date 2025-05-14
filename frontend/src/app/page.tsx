"use client";
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
} from "@mui/material";
import { useEffect } from "react";
import { ScreenContextProvider, useScreenContext } from "@/context/general";
// Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import TimelineIcon from '@mui/icons-material/Timeline';

import BrandPresentationComponent from "@/components/home/brand-presentation";
import Login from "@/components/home/login";
import { Screen } from "@/constants/constant";
import Register from "@/components/home/register";
import { DashboardBox, DashboardButton, DashboardContainer, DashboardFeatures, DashboardFeaturesContainer, DashboardSubtitle, DashboardTitle, DashboardTitleContainer } from "@/styles/home/dashboard";
import ForgotPassword from "@/components/home/forget-password";


export default function Home() {
    const { screenStatus, setScreenStatus } = useScreenContext();

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

    //Handle this later
    if (screenStatus === Screen.Dashboard) {
        const features = [
            { IconComp: AccountBalanceWalletIcon, title: "Manage Finances", desc: "Track income, expenses, and budgets.", color: "#6B73FF" },
            { IconComp: PlaylistAddCheckIcon, title: "Organize ToDos", desc: "Create, prioritize, and manage tasks.", color: "#30C9A9" },
            { IconComp: TimelineIcon, title: "Plan Roadmap", desc: "Visualize project timelines and goals.", color: "#FFB627" },
        ];

        return (
            <ScreenContextProvider>
            <Box sx={DashboardBox}>
                <Container maxWidth="md" sx={DashboardContainer}>
                    <Paper
                        elevation={8}
                        sx={DashboardTitleContainer}
                    >
                        <Typography
                            variant="h2"
                            component="h1"
                            fontWeight="bold"
                            gutterBottom
                            sx={DashboardTitle}
                        >
                            Welcome to Fintrax!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={DashboardSubtitle}>
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
                                    sx={DashboardFeatures}
                                >
                                    <Paper
                                        variant="outlined"
                                        sx={DashboardFeaturesContainer}
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
                            sx={DashboardButton}
                        >
                            Explore Dashboard
                        </Button>
                    </Paper>
                </Container>
            </Box>
            </ScreenContextProvider>
        );
    }

    // Logged-out view (Login Page) remains the same as previous version
    return (
        <ScreenContextProvider>
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
                {
                    screenStatus === Screen.ForgotPassword &&
                    <ForgotPassword setScreenStatus={setScreenStatus} />
                    
                }
            </Box>
        </ScreenContextProvider>
    );
}
