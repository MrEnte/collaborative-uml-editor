import { FC } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import {
    ClassNodeModel,
    PORT_AMOUNT_TOP,
} from '../../../utils/classNode/classNodeModel';
import EditIcon from '@mui/icons-material/Edit';
import { HorizontalPorts } from '../ports';
import { DiagramEngine } from '@projectstorm/react-diagrams';

type Props = {
    model: ClassNodeModel;
    engine: DiagramEngine;
    setEditMode: (editMode: boolean) => void;
};

export const ClassNodeViewMode: FC<Props> = ({
    model,
    setEditMode,
    engine,
}) => {
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                }}
            >
                <HorizontalPorts
                    model={model}
                    engine={engine}
                    amount={PORT_AMOUNT_TOP}
                    alignment='top'
                />
                <Button onClick={() => setEditMode(true)}>
                    <EditIcon />
                </Button>
            </div>
            <Box
                sx={{
                    backgroundColor: 'white',
                    paddingLeft: '5px',
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
