import { DiagramEngine } from '@projectstorm/react-diagrams';
import { FC, useState } from 'react';
import {
    ClassNodeModel,
    PORT_AMOUNT_BOTTOM,
    PORT_WIDTH,
} from '../../utils/classNode/classNodeModel';
import { ClassNodeEditMode } from './edit';
import { ClassNodeViewMode } from './view';
import { HorizontalPorts } from './ports';
import { Box } from '@mui/material';

type Props = {
    model: ClassNodeModel;
    engine: DiagramEngine;
};

export const ClassNodeWidget: FC<Props> = ({ model, engine }) => {
    const [editMode, setEditMode] = useState(false);

    return (
        <Box
            sx={{
                width: `${PORT_AMOUNT_BOTTOM * PORT_WIDTH}px`,
                border: model.isSelected() ? '2px solid red' : 'none',
                borderRadius: '5px',
            }}
        >
            {editMode ? (
                <ClassNodeEditMode model={model} setEditMode={setEditMode} />
            ) : (
                <>
                    <ClassNodeViewMode
                        model={model}
                        engine={engine}
                        setEditMode={setEditMode}
                    />
                    <HorizontalPorts
                        model={model}
                        engine={engine}
                        amount={PORT_AMOUNT_BOTTOM}
                        alignment={'bottom'}
                    />
                </>
            )}
        </Box>
    );
};
