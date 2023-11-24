import { FC } from 'react';
import { Template } from '../../Template';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../utils/hooks/useFetch';
import { GroupData } from '../index';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

type DataFromBackend = GroupData & {
    tasks: {
        description: string;
        id: number;
        created_by: string;
    }[];
};

export const GroupDetailedPage: FC = () => {
    const { groupId = '' } = useParams<{ groupId: string }>();
    const { data } = useFetch<DataFromBackend>(`group/${groupId}/`);
    const navigate = useNavigate();

    if (!data) {
        return null;
    }

    return (
        <Template title={data.name}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Created By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.tasks?.map((task) => (
                            <TableRow
                                key={task.id}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#eee',
                                    },
                                }}
                                onClick={() =>
                                    navigate(
                                        `/groups/${groupId}/tasks/${task.id}`
                                    )
                                }
                            >
                                <TableCell>{task.id}</TableCell>
                                <TableCell>
                                    {task.description
                                        .split('\n')
                                        .map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                </TableCell>
                                <TableCell>{task.created_by}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingTop: '20px',
                }}
            >
                <Button
                    variant='contained'
                    onClick={() => navigate(`/groups/${groupId}/tasks/add`)}
                    sx={{ margin: '10px' }}
                >
                    Add Task
                </Button>
            </Box>
        </Template>
    );
};
