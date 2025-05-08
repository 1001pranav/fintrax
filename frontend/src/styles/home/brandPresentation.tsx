"use client";

import { SxProps, Theme } from '@mui/system';

export const BrandPresentationBox: SxProps<Theme> = {
    flexGrow: { xs: 0, md: 6.5 },
    display: { xs: 'none', md: 'flex' },
    background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    p: { sm: 4, md: 6 },
    textAlign: 'center',
};

export const BrandPresentationBoxText: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
};

export const BrandIcon: SxProps<Theme> = {
    fontSize: { xs: 60, md: 80 },
    mr: 2,
};

export const BrandDescription: SxProps<Theme> = {
    opacity: 0.9,
    mt: 1,
    fontWeight: 300,
    maxWidth: "70%",
};

export const BrandDescriptionHighlight: SxProps<Theme> = {
    fontWeight: 'bold',
    color: '#B2FFFF',
};

export const BrandFeatures: SxProps<Theme> = {
    maxWidth: "65%",
    textAlign: 'left',
};

export const FlexCenter: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
};

export const BrandFeaturesIcon: SxProps<Theme> = {
    mr: 1.5,
    color: '#B2FFFF',
    fontSize: '1.4rem',
};
