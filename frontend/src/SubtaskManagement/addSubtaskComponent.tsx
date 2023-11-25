import { FC, useState, FormEvent } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

type Props = {
    sendJsonMessage: SendJsonMessage;
};

export const AddSubtaskComponent: FC<Props> = ({ sendJsonMessage }) => {
    const [description, setDescription] = useState('');

    const addSubtask = (event: FormEvent) => {
        event.preventDefault();

        if (!description.trim()) {
            return;
        }

        setDescription('');

        sendJsonMessage({ type: 'add_subtask', description: description });
    };

    return (
        <form onSubmit={addSubtask}>
            <Box
                sx={{
                    display: 'flex',
                }}
            >
                <TextField
                    id={'subtask-description'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Enter subtask description'
                    fullWidth
                    required
                />
                <Button type='submit'>Add Subtask</Button>
            </Box>
        </form>
    );
};
