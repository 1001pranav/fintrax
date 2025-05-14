"use client";
import { SxProps, Theme } from '@mui/system';

export const DashboardContainer: SxProps<Theme> = {
     py: { xs: 4, md: 6 }, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }


export const DashboardBox: SxProps<Theme> = { 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    background: 'linear-gradient(to bottom right, #e0eafc, #cfdef3)' 
};


export const DashboardTitleContainer: SxProps<Theme> = {
    p: { xs: 3, sm: 5, md: 7 },
    textAlign: 'center',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
    width: '100%', // Ensure paper takes available width
}

export const DashboardTitle: SxProps<Theme> = {
    background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    mb: 2
}
export const DashboardSubtitle: SxProps<Theme> = { mt: 2, mb: 5, maxWidth: '650px', lineHeight: 1.7, fontWeight: 300, mx: 'auto' }

export const DashboardFeaturesContainer: SxProps<Theme> = {
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
}

export const DashboardButton: SxProps<Theme> = {
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
}

export const DashboardFeatures = (theme: Theme) => ({
    display: 'flex', // Make this a flex container to allow Paper to stretch
    flexDirection: 'column',
    // Calculate width to achieve desired items per row, accounting for gap
    width: {
        xs: '100%', // 1 item per row
        sm: `calc(50% - ${theme.spacing(1.5)})`, // 2 items per row (gap/2)
        md: `calc(100% / 3 - ${theme.spacing(2)})` // 3 items per row (2*gap/3)
    },
    minWidth: '260px', // Minimum width before wrapping or shrinking too much
})