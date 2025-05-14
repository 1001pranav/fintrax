"use client";

import {  
    BrandDescription, 
    BrandDescriptionHighlight, 
    BrandFeatures, 
    BrandFeaturesIcon, 
    BrandIcon, 
    BrandPresentationBox, 
    BrandPresentationBoxText, 
    FlexCenter  
} from "@/styles/home/brandPresentation"
import {
    Box,
    Typography,
    Stack,
} from "@mui/material";

import InsightsIcon from '@mui/icons-material/Insights'; 
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const BrandPresentationComponent: React.FC = () =>{
    return (
        
        <Box sx={BrandPresentationBox}>
                <Box sx={BrandPresentationBoxText}>
                    <InsightsIcon sx={BrandIcon} />
                    <Typography variant="h1" fontWeight="bold" letterSpacing={1.5}>
                        FINTRAX
                    </Typography>
                </Box>
                <Typography variant="h5" sx={BrandDescription}>
                    Your All-In-One Productivity Powerhouse
                </Typography>
                <Typography variant="subtitle1" mt={3} maxWidth={{ xs: "90%", sm: "80%", md: "65%" }} sx={{ lineHeight: 1.8, opacity: 0.85 }}>
                    Seamlessly manage your <Box component="span" sx={BrandDescriptionHighlight}>Finances</Box>,
                    organize your <Box component="span" sx={BrandDescriptionHighlight}>ToDo Lists</Box>,
                    and visualize your <Box component="span" sx={BrandDescriptionHighlight}>Roadmap</Box>.
                    Unlock peak productivity.
                </Typography>
                <Stack spacing={1.5} mt={5} alignItems="flex-start" sx={BrandFeatures}>
                    {[
                        "Comprehensive Financial Tracking",
                        "Intuitive Task Management",
                        "Strategic Roadmap Planning",
                        "Collaborative Workspaces",
                    ].map((feature, index) => (
                        <Box key={index} sx={FlexCenter}>
                            <CheckCircleOutlineIcon sx={BrandFeaturesIcon} />
                            <Typography variant="body1" sx={{ opacity: 0.85 }}>{feature}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
    )
}
export default BrandPresentationComponent;