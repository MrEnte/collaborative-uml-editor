import { FC } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    model: ClassNodeModel;
    setEditMode: (editMode: boolean) => void;
};

export const ClassNodeViewMode: FC<Props> = ({ model, setEditMode }) => {
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
                    border: model.isSelected() ? '2px solid red' : 'none',
                }}
            >
                <Typography>{model.className}</Typography>
                <Divider />
                {model.attributes.map((attribute) => (
                    <Typography>{attribute}</Typography>
                ))}
                <Divider />
                {model.methods.map((method) => (
                    <Typography>{method}</Typography>
                ))}
            </Box>
        </>
    );
};
