import { FC, useState } from 'react';
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { arrayMoveImmutable } from 'array-move';
import useWebSocket from 'react-use-websocket';
import FlipMove from 'react-flip-move';

type Props = {
    taskId: string;
};

type Message = {
    type: string;
    subtasks: Subtask[];
};

type Subtask = {
    id: number;
    description: string;
    order: number;
};

export const SubtaskManagement: FC<Props> = ({ taskId }) => {
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [description, setDescription] = useState('');

    const socketUrl = `ws://localhost:8000/ws/task-socket-server/${taskId}/`;
    const { sendJsonMessage } = useWebSocket(socketUrl, {
        onMessage: (e) => {
            const data = JSON.parse(e.data as string) as Message;

            const subtasksFromServer = data.subtasks;
            subtasksFromServer.sort((a, b) => a.order - b.order);
            setSubtasks(subtasksFromServer);
        },
    });

    const addSubtask = () => {
        setDescription('');

        sendJsonMessage({ type: 'add_subtask', description: description });
    };

    const deleteSubtask = (id: number) => {
        sendJsonMessage({ type: 'delete_subtask', subtask_id: id });
    };

    const editSubtask = (id: number, newDescription: string) => {
        setSubtasks(
            subtasks.map((subtask) =>
                subtask.id === id
                    ? { ...subtask, description: newDescription }
                    : subtask
            )
        );
    };

    const moveSubtask = (currentIndex: number, newIndex: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const newOrderedSubtasks = arrayMoveImmutable(
            subtasks,
            currentIndex,
            newIndex
        );

        sendJsonMessage({
            type: 'reorder_subtasks',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            subtasks: newOrderedSubtasks.map((subtask, index) => ({
                ...subtask,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                order: index,
            })),
        });
    };

    return (
        <Box sx={{ padding: '15px' }}>
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
                />
                <Button onClick={addSubtask}>Add Subtask</Button>
            </Box>
            <FlipMove>
                {subtasks.map((subtask, index) => (
                    <ListItem
                        key={subtask.id}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#eee',
                            },
                            borderRadius: '5px',
                        }}
                    >
                        <ListItemText primary={subtask.description} />

                        <IconButton onClick={() => deleteSubtask(subtask.id)}>
                            <DeleteIcon />
                        </IconButton>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1px',
                            }}
                        >
                            <IconButton
                                size={'small'}
                                disabled={index === 0}
                                onClick={() => moveSubtask(index, index - 1)}
                            >
                                <ArrowDropUpIcon />
                            </IconButton>
                            <IconButton
                                size={'small'}
                                disabled={index === subtasks.length - 1}
                                onClick={() => moveSubtask(index, index + 1)}
                            >
                                <ArrowDropUpIcon
                                    sx={{ transform: 'rotate(180deg)' }}
                                />
                            </IconButton>
                        </Box>
                    </ListItem>
                ))}
            </FlipMove>
        </Box>
    );
};
