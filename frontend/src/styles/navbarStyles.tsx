// src/styles/navbarStyles.ts
import { Theme, alpha } from '@mui/material/styles';
import { SxProps } from '@mui/system';

type Styles = Record<string, SxProps<Theme>>;

const BrandText = {
    fontWeight: 700,
    background: `linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
};
const BrandTextFull = {
    display: { xs: 'none', sm: 'inline' },
};
const BrandTextSort = {
    display: { xs: 'inline', sm: 'none' },
};
export const navbarStyles = (theme: Theme): Styles => ({
    // --- AppBar and Toolbar ---
    appBar: { // Styles for Dashboard AppBar
        position: 'sticky',
        elevation: 0,
        backdropFilter: 'blur(12px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
    },
    toolbar: { // Styles for Dashboard Toolbar
        minHeight: { xs: 58, sm: 66 },
        width: '100%',
        paddingLeft: { xs: 1, sm: 2 },
        paddingRight: { xs: 1, sm: 2 },
    },

    // --- Public Navbar Styles (Login/Register screens) ---
    publicAppBar: { // Style for the public-facing AppBar
        position: 'sticky',
        elevation: 0,
        backgroundColor: theme.palette.background.paper, // Solid paper color
        // Or transparent:
        // backgroundColor: 'transparent',
        // boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
    },
    publicToolbar: { // Toolbar for public view
        minHeight: { xs: 58, sm: 66 }, // Consistent height
        width: '100%',
        paddingLeft: { xs: 1, sm: 2 },
        paddingRight: { xs: 1, sm: 2 },
    },
    authButtonContainer: { // Container for Login/Register buttons
        display: 'flex',
        gap: 1.5, // Space between buttons
    },
    authButton: { // Common style for Login/Register buttons
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '8px', // Consistent corner rounding
        fontSize: { xs: '0.8rem', sm: '0.9rem' }, // Responsive font size
        px: { xs: 1.5, sm: 2.5 }, // Responsive padding
    },

    // --- Brand Logo (Shared styles) ---
    brandLogoContainer: {
        display: 'flex',
        alignItems: 'center',
        mr: { xs: 0, md: 2 },
    },
    brandLogoLink: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        minWidth: 0,
    },
    brandIcon: {
        fontSize: { xs: '1.9rem', sm: '2.3rem' },
        mr: 0.5,
        color: '#0052cc', // Fintrax specific blue
    },
    brandText: BrandText,
    brandTextFull: BrandTextFull,
    brandTextShort: BrandTextSort,

    // --- Desktop Navigation (Dashboard) ---
    desktopNavContainer: {
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1.5,
        flexGrow: 1,
    },
    navButton: {
        color: theme.palette.text.secondary,
        fontWeight: 500, textTransform: 'none', fontSize: '0.95rem',
        py: 0.5, px: 1.5, borderRadius: '8px',
        borderBottom: '3px solid transparent',
        transition: 'color 0.2s, border-color 0.2s, background-color 0.2s',
        '&:hover': { color: theme.palette.primary.dark, backgroundColor: alpha(theme.palette.primary.main, 0.08) },
    },
    navButtonActive: {
        color: theme.palette.primary.main,
        fontWeight: 600,
        borderBottom: `3px solid ${theme.palette.primary.main}`,
    },

    // --- Mobile Navigation (Dashboard) ---
    mobileNavSpacer: {
        flexGrow: { xs: 1, md: 0 },
        display: { xs: 'flex', md: 'none' },
    },
    mobileDrawerPaper: {
        width: 260, boxSizing: 'border-box',
    },
    mobileDrawerHeader: {
        p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    },
    mobileDrawerListItemIcon: {
        minWidth: 40, color: theme.palette.text.secondary,
    },
    mobileDrawerListItemActive: {
        backgroundColor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main',
        '& .MuiListItemIcon-root': { color: 'primary.main' },
        '& .MuiListItemText-primary': { fontWeight: '600' }
    },

    // --- Right Icons & Menus (Dashboard) ---
    iconButtonsContainer: {
        display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 },
    },
    userAvatarButton: { p: 0.5, },
    userAvatar: {
        width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 },
        bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, fontSize: '0.9rem',
    },
    menuPaper: {
        elevation: 0, overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))', mt: 1.5,
        '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 },
    },
    userMenuPaper: {
         '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
    },
    notificationsMenuPaper: {
         width: { xs: 300, sm: 340 }, maxHeight: 400,
    },
    userMenuInfoBox: { px: 2, py: 1.5, },
    menuItem: {
        py: 1, px: 2, '& .MuiListItemIcon-root': { minWidth: 36, color: theme.palette.text.secondary, }
    },
    notificationsMenuItem: {
        alignItems: 'flex-start', py: 1.2, '& .MuiListItemText-secondary': { fontSize: '0.8rem', whiteSpace: 'normal', }
    },
    viewAllNotificationsLink: {
        justifyContent: 'center', py: 1.2, '& .MuiTypography-root': { fontWeight: 'bold', }
    },
    brandTextStyle: {...BrandText, ...BrandTextFull },
    brandTextStyleShort: {...BrandText, ...BrandTextSort },
});
// { ...styles.brandText, ...styles.brandTextFull }