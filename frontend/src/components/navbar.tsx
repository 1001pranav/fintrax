// src/components/layout/DynamicNavbar.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Use Link for internal navigation if needed later
import {
    AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Menu, MenuItem,
    ListItemIcon, ListItemText, Drawer, List, ListItemButton, useTheme,
    Badge, Tooltip, Container, Divider
} from '@mui/material';
import { useScreenContext } from '@/context/general'; // Adjust path
import { Screen } from '@/constants/constant'; // Adjust path
import { navbarStyles } from '@/styles/navbarStyles'; // Adjust path

// --- Icons ---
import MenuIcon from '@mui/icons-material/Menu';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
// --- End Icons ---

// Placeholder Nav Items for Dashboard
const navItems = [
    { text: 'Dashboard', href: '#!', icon: <DashboardCustomizeOutlinedIcon /> },
    { text: 'Finances', href: '#!', icon: <AttachMoneyOutlinedIcon /> },
    { text: 'ToDos', href: '#!', icon: <FactCheckOutlinedIcon /> },
    { text: 'Roadmaps', href: '#!', icon: <AssessmentOutlinedIcon /> },
];

// Mock user data (replace with actual data source if available)
const mockUser = { name: "Demo User", email: "demo@fintrax.com", avatarUrl: undefined };
const mockNotificationCount = 3;

const DynamicNavbar: React.FC = () => {
    const theme = useTheme();
    const styles = navbarStyles(theme);
    
    const mobileDrawerStyles = {
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
            ...styles.mobileDrawerPaper, // spread the nested style object
        }
    }
    // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { screenStatus, setScreenStatus } = useScreenContext();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);

    // Use mock data or potentially data from a different context if needed
    const user = mockUser;
    const notificationCount = mockNotificationCount;

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNotifications(event.currentTarget);
    const handleCloseNotificationsMenu = () => setAnchorElNotifications(null);

    const handleLogout = () => {
        handleCloseUserMenu();
        localStorage.removeItem('user'); // Example cleanup
        setScreenStatus(Screen.Login); // Navigate back to Login state via context
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

    // --- Reusable Brand Logo Component ---
    const BrandLogo = () => (
        <Box sx={styles.brandLogoLink} onClick={(e: React.FormEvent) => {
            // Prevent navigation if on login/register, maybe go to dashboard if logged in
            if (screenStatus !== Screen.Dashboard) e.preventDefault();
            else setScreenStatus(Screen.Dashboard); // Or use NextLink for dashboard route
        }}
           component={screenStatus === Screen.Dashboard ? Link : 'div'} // Use Link only when relevant
           href={screenStatus === Screen.Dashboard ? "/dashboard" : undefined} // Only set href when it's a link
        >
            <InsightsIcon sx={styles.brandIcon} />
            <Typography variant="h5" noWrap sx={styles.brandTextStyle}> FINTRAX </Typography>
            {/* <Typography variant="h5" noWrap sx={styles.brandTextStyleSort}>  </Typography> */}
        </Box>
    );

    // --- Conditional Rendering based on screenStatus ---

    if (screenStatus === Screen.Dashboard) {
        // --- DASHBOARD NAVBAR ---
        const desktopNavLinks = (
             <Box sx={styles.desktopNavContainer}>
                {navItems.map((item) => (
                    <Button key={item.text} href={item.href} onClick={(e) => { e.preventDefault(); alert(`Maps to ${item.text} (placeholder)`); }} size="medium" sx={styles.navButton}>
                        {item.text}
                    </Button>
                ))}
            </Box>
        );
        const mobileDrawer = (
             <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
             sx={mobileDrawerStyles}>
                <Box sx={styles.mobileDrawerHeader}> <BrandLogo /> <IconButton onClick={handleDrawerToggle}><MenuIcon /></IconButton> </Box>
                <Divider />
                <List sx={{ flexGrow: 1 }}>
                    {navItems.map((item) => (
                        <ListItemButton key={item.text} href={item.href} onClick={(e) => { e.preventDefault(); alert(`Maps to ${item.text} (placeholder)`); handleDrawerToggle(); }} sx={{ py: 1.2 }}>
                            <ListItemIcon sx={styles.mobileDrawerListItemIcon}>{item.icon}</ListItemIcon> <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItemButton href='#!' onClick={(e) => { e.preventDefault(); alert('Open Settings (placeholder)'); handleDrawerToggle(); }} sx={{ py: 1.2 }}>
                        <ListItemIcon sx={styles.mobileDrawerListItemIcon}><SettingsOutlinedIcon /></ListItemIcon> <ListItemText primary="Settings" />
                    </ListItemButton>
                    <ListItemButton onClick={() => { handleLogout(); handleDrawerToggle(); }} sx={{ py: 1.2 }}>
                        <ListItemIcon sx={styles.mobileDrawerListItemIcon}><LogoutOutlinedIcon /></ListItemIcon> <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </Drawer>
        );
        const userMenu = (
             <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{...styles.menuPaper, ...styles.userMenuPaper}}>
                <Box sx={styles.userMenuInfoBox}> <Typography variant="subtitle1" fontWeight="bold" noWrap>{user?.name || "User"}</Typography> <Typography variant="body2" color="text.secondary" noWrap>{user?.email}</Typography> </Box>
                <Divider />
                <MenuItem sx={styles.menuItem} onClick={() => { alert('Open Settings (placeholder)'); handleCloseUserMenu(); }}> <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>Settings </MenuItem>
                <MenuItem sx={styles.menuItem} onClick={handleLogout}> <ListItemIcon><LogoutOutlinedIcon fontSize="small" /></ListItemIcon>Logout </MenuItem>
            </Menu>
        );
        const notificationsMenu = (
             <Menu 
                anchorEl={anchorElNotifications} 
                open={Boolean(anchorElNotifications)} 
                onClose={handleCloseNotificationsMenu} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
                PaperProps={{...styles.menuPaper, ...styles.notificationsMenuPaper}}>
                <Box 
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 1.5, pb: 1 }}> 
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        Notifications
                    </Typography> 
                </Box>
                <Divider />
                    {notificationCount > 0 ? 
                        ( 
                            <List dense sx={{ py: 0 }}> 
                                {[...Array(Math.min(notificationCount, 3))].map((_, i) => 
                                    ( 
                                        <MenuItem 
                                            key={i} 
                                            onClick={handleCloseNotificationsMenu} 
                                            sx={styles.notificationsMenuItem}>
                                                <ListItemIcon sx={{ mr: 1.5, mt: 0.5 }}>
                                                    <InsightsIcon color="primary" fontSize="small" />
                                                </ListItemIcon> 
                                                <ListItemText primary={`Notification ${i + 1}`} secondary="A brief summary..." primaryTypographyProps={{fontWeight: 500}} secondaryTypographyProps={{fontSize: '0.8rem'}}/> </MenuItem> ))} 
                                </List> 
                        ) : ( 
                            <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No new notifications</Typography> 
                        )
                    }
                {notificationCount > 3 && <Divider />}
                <MenuItem sx={styles.viewAllNotificationsLink} onClick={() => { alert('View all notifications'); handleCloseNotificationsMenu(); }}> <Typography color="primary" variant="body2" fontWeight="bold">View all</Typography> </MenuItem>
            </Menu>
        );

        return ( // --- RENDER DASHBOARD NAVBAR UI ---
            <>
                <AppBar sx={styles.appBar}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={styles.toolbar}>
                            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { md: 'none' } }} ><MenuIcon /></IconButton>
                            <Box sx={styles.brandLogoContainer}><BrandLogo /></Box>
                            {desktopNavLinks}
                            <Box sx={styles.mobileNavSpacer} />
                            <Box sx={styles.iconButtonsContainer}>
                                <Tooltip title="Notifications">
                                    <IconButton color="inherit" onClick={handleOpenNotificationsMenu}> <Badge badgeContent={notificationCount} color="error" max={99}> <NotificationsNoneOutlinedIcon /> </Badge> </IconButton>
                                </Tooltip>
                                {notificationsMenu}
                                <Tooltip title={user?.name || 'User Account'}>
                                    <IconButton onClick={handleOpenUserMenu} sx={styles.userAvatarButton}> <Avatar alt={user?.name || "User"} src={user?.avatarUrl} sx={styles.userAvatar}> {!user?.avatarUrl && userInitial} </Avatar> </IconButton>
                                </Tooltip>
                                {userMenu}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                {mobileDrawer}
            </>
        );
    } else {
        // --- PUBLIC NAVBAR (Login/Register screens) ---
        return (
            <AppBar sx={styles.publicAppBar}> {/* Use public styles */}
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={styles.publicToolbar}>
                        <Box sx={styles.brandLogoContainer}> <BrandLogo /> </Box>
                        <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
                        <Box sx={styles.authButtonContainer}>
                            {screenStatus === Screen.Register && (
                                <Button variant="outlined" color="primary" sx={styles.authButton} onClick={() => setScreenStatus(Screen.Login)} > Login </Button>
                            )}
                            {screenStatus === Screen.Login && (
                                <Button variant="contained" color="primary" disableElevation sx={styles.authButton} onClick={() => setScreenStatus(Screen.Register)} > Register </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        );
    }
};

export default DynamicNavbar;