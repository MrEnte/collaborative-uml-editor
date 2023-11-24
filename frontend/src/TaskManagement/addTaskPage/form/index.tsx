import { FC, useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFromBackend, HTTP_METHOD } from '../../../utils/hooks/useFetch';

export const TaskAddForm: FC = () => {
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { groupId = '' } = useParams<{ groupId: string }>();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        fetchFromBackend({
            url: `group/${groupId}/task/`,
            method: HTTP_METHOD.POST,
            body: JSON.stringify({
                description,
            }),
        });

        navigate(`/groups/${groupId}/tasks`);
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
                    label='Task Description'
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    variant='outlined'
                    multiline
                    rows={10}
                    sx={{ width: '700px' }}
                />
                <Button type='submit' variant='contained' color='primary'>
                    Create Task
                </Button>
            </Box>
        </form>
    );
};
