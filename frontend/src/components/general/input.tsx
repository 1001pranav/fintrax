import { TextField, InputAdornment } from '@mui/material';
import React, { ReactNode } from 'react';

interface TextFieldProps {
    label: string;
    value: string | number | readonly string[] | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    type?: string;
    margin?: 'dense' | 'normal' | undefined;
    fullWidth?: boolean;
    variant?: 'filled' | 'outlined' | 'standard' | undefined;
    inputPropsSx?: object;
    // Allow other props to be passed down
    [key: string]: string | number | boolean | ReactNode | object | undefined;
}

const TextFieldComponent: React.FC<TextFieldProps> = ({
    label,
    value,
    onChange,
    startAdornment,
    endAdornment,
    type,
    margin = 'normal',
    fullWidth = false,
    variant = 'outlined',
    inputPropsSx,
    ...rest
  })=> {
    return (<TextField
        label={label}
        variant={variant}
        fullWidth={fullWidth}
        margin={margin}
        value={value}
        onChange={onChange}
        type={type}
        InputProps={{
                startAdornment: startAdornment && (
                <InputAdornment position="start">{startAdornment}</InputAdornment>
            ),  
            endAdornment: endAdornment && (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
            ),
            sx: { ...inputPropsSx },
        }}
        {...rest}
    />)
}

export default TextFieldComponent