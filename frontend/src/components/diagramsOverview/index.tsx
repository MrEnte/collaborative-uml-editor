import { useFetch } from '../../utils/hooks/useFetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type DiagramData = {
    id: number;
    name: string;
    created_by: string;
    created_at: string;
};

export const DiagramsOverview = () => {
    const { data } = useFetch<DiagramData[]>('diagram/');
    const navigate = useNavigate();

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Created by</TableCell>
                        <TableCell>Created at</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((diagram) => (
                        <TableRow
                            key={diagram.id}
                            onClick={() => navigate(`/diagrams/${diagram.id}`)}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { background: '#eee' },
                            }}
                        >
                            <TableCell>{diagram.name}</TableCell>
                            <TableCell>{diagram.created_by}</TableCell>
                            <TableCell>{diagram.created_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
