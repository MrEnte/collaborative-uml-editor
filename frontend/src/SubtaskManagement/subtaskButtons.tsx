import { FC } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Subtask } from './index';
import { arrayMoveImmutable } from 'array-move';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { TaskData } from '../TaskManagement';
import { fetchFromBackend, HTTP_METHOD } from '../utils/hooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';

type SubtaskButtonsProps = {
    subtasks: Subtask[];
    subtask: Subtask;
    sendJsonMessage: SendJsonMessage;
    index: number;
    taskStatus: TaskData['status'] | undefined;
};

type DiagramData = {
    id: number;
};

export const SubtaskButtons: FC<SubtaskButtonsProps> = ({
    subtasks,
    subtask,
    sendJsonMessage,
    index,
    taskStatus,
}) => {
    const { groupId = '', taskId = '' } = useParams();
    const navigate = useNavigate();
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
            subtasks: newOrderedSubtasks.map((item, idx) => ({
                ...item,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                order: idx,
            })),
        });
    };

    const deleteSubtask = (id: number) => {
        sendJsonMessage({ type: 'delete_subtask', subtask_id: id });
    };

    const firstSubtaskInCreation = subtasks.find(
        (item) => item.status === 'CREATED'
    );

    if (taskStatus === 'MODELLING') {
        if (
            subtask.status === 'CREATED' &&
            firstSubtaskInCreation?.id === subtask.id
        ) {
            return (
                <Button
                    onClick={() => {
                        fetchFromBackend<DiagramData>({
                            url: `group/${groupId}/task/${taskId}/subtask/${subtask.id}/diagram/`,
                            method: HTTP_METHOD.GET,
                            onSuccess: (data) => {
                                navigate(
                                    `subtasks/${subtask.id}/diagrams/${data.id}/`
                                );
                            },
                        });
                    }}
                >
                    Start Modelling
                </Button>
            );
        }

        return null;
    }

    return (
        <>
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
                    <ArrowDropUpIcon sx={{ transform: 'rotate(180deg)' }} />
                </IconButton>
            </Box>
        </>
    );
};
