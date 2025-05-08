
"use client";
import { SxProps, Theme } from '@mui/system';

export const LoginContainer: SxProps<Theme> = {
    flexGrow: {xs: 1, md: 3.5},
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: { xs: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)", md: "rgba(245, 245, 245, 0.5)" },
    backdropFilter: {md: "blur(10px)"},
    p: { xs: 2, sm: 3, md: 4 }
};

export const LoginBox: SxProps<Theme> = {
    p: { xs: 3, sm: 5 },
    width: { xs: "95%", sm: "80%", md: "450px" },
    maxWidth: '450px',
    background: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(15px)",
    borderRadius: '20px',
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 12px 32px 0 rgba(31, 38, 135, 0.2)",
};

export const LoginTitle: SxProps<Theme> = { 
    fontSize: 48, 
    color: 'primary.main', 
    mb: 1, 
    display: {
        md: 'none'
    } 
}

export const LoginBoxContainer: SxProps<Theme> = { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    mb: 3 
};

export const ForgotPasswordContainer: SxProps<Theme> = {
    textAlign: 'right',
    my: 1 
}

export const ForgotPassword: SxProps<Theme> = {
    color: 'primary.main', 
    textDecoration: 'none', 
    '&:hover': {
        textDecoration: 'underline'
    }
}

export const LoginButton: SxProps<Theme> = {
    mt: 2,
    mb: 2,
    borderRadius: '12px',
    py: 1.5,
    fontWeight: 'bold',
    background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
    color: 'white',
    '&:hover': {
        background: "linear-gradient(135deg, #5A63FF 0%, #000BCF 100%)",
        boxShadow: '0 4px 15px 0 rgba(0, 13, 255, 0.35)',
    }
}

export const RegisterButton: SxProps<Theme> = { 
    fontWeight: 'bold', 
    color: 'primary.main', 
    textDecoration: 'none', 
    '&:hover': {
        textDecoration: 'underline'
    }
}