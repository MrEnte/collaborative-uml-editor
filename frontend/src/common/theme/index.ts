import { createTheme } from '@mui/material';
import { components } from './components';

export const theme = createTheme({
    typography: {
        fontFamily: "'Roboto', sans-serif",
        allVariants: {
            color: '#141717',
        },
        h1: {
            fontFamily: "'DM Serif Display', serif",
            fontSize: '2.0rem',
            lineHeight: '3.0rem',
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 'normal',
            lineHeight: '2.0rem',
        },
        h3: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            lineHeight: '1.75rem',
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: '1.5rem',
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 'bold',
            lineHeight: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
        },
        button: {
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: '1.5rem',
            textTransform: 'unset',
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: '1.125rem',
        },
    },
    palette: {
        background: {
            default: '#e7e7e7',
        },
        neutral: {
            dark: '#596B84',
            main: '#768BA8',
            light: '#F5F7FA',
        },
    },
    components,
});
