import { FC, useState } from 'react';
import { Box, Button, ListItem, ListItemText } from '@mui/material';
import useWebSocket from 'react-use-websocket';
import FlipMove from 'react-flip-move';
import { TaskData } from '../TaskManagement';
import { SubtaskButtons } from './subtaskButtons';
import { AddSubtaskComponent } from './addSubtaskComponent';

type Props = {
    taskId: string;
};

type Message = {
    type: string;
    subtasks: Subtask[];
    task: TaskData;
};

export type Subtask = {
    id: number;
    description: string;
    order: number;
};

export const SubtaskManagement: FC<Props> = ({ taskId }) => {
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [task, setTask] = useState<TaskData>();

    const socketUrl = `ws://localhost:8000/ws/task-socket-server/${taskId}/`;
    const { sendJsonMessage } = useWebSocket(socketUrl, {
        onMessage: (e) => {
            const data = JSON.parse(e.data as string) as Message;

            const subtasksFromServer = data.subtasks;
            subtasksFromServer.sort((a, b) => a.order - b.order);
            setSubtasks(subtasksFromServer);
            setTask(data.task);
        },
    });

    const submitSubtasks = () => {
        sendJsonMessage({
            type: 'submit_subtasks',
        });
    };

    const isAnalysing = task?.status === 'ANALYSING';

    return (
        <Box sx={{ padding: '15px' }}>
            {isAnalysing && (
                <AddSubtaskComponent sendJsonMessage={sendJsonMessage} />
            )}
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
                        {isAnalysing && (
                            <SubtaskButtons
                                subtasks={subtasks}
                                subtask={subtask}
                                index={index}
                                sendJsonMessage={sendJsonMessage}
                            />
                        )}
                    </ListItem>
                ))}
            </FlipMove>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingTop: '20px',
                }}
            >
                {isAnalysing && subtasks.length ? (
                    <Button onClick={() => submitSubtasks()}>
                        Submit subtasks
                    </Button>
                ) : null}
            </Box>
        </Box>
    );
};
