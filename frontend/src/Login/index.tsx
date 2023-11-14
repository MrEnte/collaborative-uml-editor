import { FC, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import { useCookies } from 'react-cookie';
import {
    AUTH_TOKEN_IDENTIFIER,
    BASE_API_URL,
    HTTP_METHOD,
} from '../utils/hooks/useFetch';
import { useNavigate } from 'react-router-dom';

type DataFromBackend = {
    access: string;
};

export const LoginPage: FC = () => {
    const [, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        try {
            const res = await fetch(`${BASE_API_URL}token/`, {
                method: HTTP_METHOD.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const json = (await res.json()) as DataFromBackend;
            if (res.status < 400) {
                setCookie(AUTH_TOKEN_IDENTIFIER, json.access, {
                    path: '/',
                });
                navigate('/diagrams');
            } else {
                removeCookie(AUTH_TOKEN_IDENTIFIER, { path: '/' });
                setError(
                    'Login failed. Please check your username and password.'
                );
            }
        } catch (e) {
            setError('An error occurred. Please try again later.');
        }
    };

    const handleClick = async () => {
        if (!username || !password) {
            setError('Please fill in both fields.');
            return;
        }

        await handleAuth();
    };

    return (
        <Box sx={{ padding: '50px' }}>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert onClose={() => setError(null)} severity='error'>
                    {error}
                </Alert>
            </Snackbar>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant={'h2'}>
                    Welcome to the collaborative UML-Editor!
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    width: '100%',
                    margin: 'auto',
                    marginTop: '50px',
                    padding: '15px',
                    maxWidth: '500px',
                    justifyContent: 'center',
                }}
            >
                <Typography>Please login to continue</Typography>
                <TextField
                    variant={'outlined'}
                    label={'Username'}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant={'outlined'}
                    label={'Password'}
                    type={'password'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant={'contained'} onClick={handleClick}>
                    Login
                </Button>
            </Box>
        </Box>
    );
};
