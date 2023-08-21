import { FC } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    node: ClassNodeModel;
    setEditMode: (editMode: boolean) => void;
};

export const ClassNodeViewMode: FC<Props> = ({ node, setEditMode }) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setEditMode(true)}>
                    <EditIcon />
                </Button>
            </div>
            <Box
                sx={{
                    backgroundColor: 'white',
                    border: node.isSelected() ? '2px solid red' : 'none',
                }}
            >
                <Typography>{node.className}</Typography>
                <Divider />
                {node.attributes.map((attribute) => (
                    <Typography>{attribute}</Typography>
                ))}
                <Divider />
                {node.methods.map((method) => (
                    <Typography>{method}</Typography>
                ))}
            </Box>
        </>
    );
};
