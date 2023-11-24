import { FC, useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { fetchFromBackend, HTTP_METHOD } from '../../../utils/hooks/useFetch';
import { useNavigate } from 'react-router-dom';

export const GroupAddForm: FC = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        fetchFromBackend({
            url: 'group/',
            method: HTTP_METHOD.POST,
            body: JSON.stringify({
                name,
            }),
        });

        navigate('/groups');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                <TextField
                    label='Group Name'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    variant='outlined'
                />
                <Button type='submit' variant='contained' color='primary'>
                    Create Group
                </Button>
            </Box>
        </form>
    );
};
