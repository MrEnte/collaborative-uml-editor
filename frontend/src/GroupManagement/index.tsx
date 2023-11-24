import { FC } from 'react';
import { useFetch } from '../utils/hooks/useFetch';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Template } from '../Template';

export type GroupData = {
    id: number;
    name: string;
    created_by: string;
};

export const GroupManagementPage: FC = () => {
    const { data } = useFetch<GroupData[]>('group/');
    const navigate = useNavigate();

    return (
        <Template title={'Groups'}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Created By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((group) => (
                            <TableRow
                                key={group.id}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#eee',
                                    },
                                }}
                                onClick={() =>
                                    navigate(`/groups/${group.id}/tasks`)
                                }
                            >
                                <TableCell>{group.id}</TableCell>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>{group.created_by}</TableCell>
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
                    onClick={() => navigate('/groups/add')}
                    sx={{ margin: '10px' }}
                >
                    Add Group
                </Button>
            </Box>
        </Template>
    );
};
