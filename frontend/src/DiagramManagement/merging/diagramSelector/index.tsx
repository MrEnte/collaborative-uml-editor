import { useParams } from 'react-router-dom';
import { useFetch } from '../../../utils/hooks/useFetch';
import React, { FC, useEffect, useState } from 'react';
import { SubtaskData } from '../../presenting';
import { Box, MenuItem, Select } from '@mui/material';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';
import { CanvasModel } from '@projectstorm/react-canvas-core/dist/@types/entities/canvas/CanvasModel';

type Props = {
    isLoaded: boolean;
    engine: DiagramEngine;
    model: DiagramModel;
    serializedModel: ReturnType<CanvasModel['serialize']>;
    setSerializedModel: (
        serializedModel: ReturnType<CanvasModel['serialize']>
    ) => void;
};

export const DiagramSelector: FC<Props> = ({
    isLoaded,
    engine,
    model,
    serializedModel,
    setSerializedModel,
}) => {
    const { groupId = '', taskId = '', subtaskId = '' } = useParams();
    const { data: subtaskData } = useFetch<SubtaskData>(
        `group/${groupId}/task/${taskId}/subtask/${subtaskId}/diagram-presentation/`
    );
    const diagrams = subtaskData?.diagrams;

    const [selectedDiagram, setSelectedDiagram] = useState<number>(0);

    useEffect(() => {
        if (!diagrams) {
            return;
        }

        const currentSerializedModel = model.serialize();

        model.deserializeModel(
            {
                ...currentSerializedModel,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                layers: diagrams[selectedDiagram].data.layers,
            },
            engine
        );
        setSerializedModel(model.serialize());
    }, [selectedDiagram, diagrams]);

    useEffect(() => {
        if (!serializedModel) {
            return;
        }

        model.setLocked(true);
        engine.zoomToFit();
        engine.repaintCanvas();
    }, [serializedModel]);

    if (!isLoaded || !subtaskData) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <CanvasWidget
                engine={engine}
                className='diagram-container-merging'
            />
            <Select
                id='diagram-selector'
                value={selectedDiagram}
                onChange={(e) => setSelectedDiagram(e.target.value as number)}
            >
                {diagrams?.map((diagram, index) => (
                    <MenuItem key={diagram.id} value={index}>
                        {diagram.created_by}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};
