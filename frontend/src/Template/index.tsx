import { FC, PropsWithChildren } from 'react';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN_IDENTIFIER } from '../utils/hooks/useFetch';
import LogoutIcon from '@mui/icons-material/Logout';

type Props = PropsWithChildren & {
    title: string;
};

export const Template: FC<Props> = ({ children, title }) => {
    const [, , removeCookie] = useCookies();
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie(AUTH_TOKEN_IDENTIFIER, { path: '/' });
        navigate('/');
    };

    return (
        <Box sx={{ padding: '15px' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '15px',
                }}
            >
                <Typography
                    variant='h6'
                    sx={{
                        fontWeight: 'bold',
                    }}
                >
                    {title}
                </Typography>
                <IconButton onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Box>
            <Paper
                sx={{
                    gap: '20px',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                {children}
            </Paper>
        </Box>
    );
};
