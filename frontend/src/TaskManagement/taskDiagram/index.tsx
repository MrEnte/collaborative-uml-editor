import { useParams } from 'react-router-dom';
import { useFetch } from '../../utils/hooks/useFetch';
import { Box, Button } from '@mui/material';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import React, { useEffect } from 'react';
import { useClassDiagram } from '../../utils/hooks/useClassDiagram';
import { DiagramData } from '../../DiagramManagement/presenting';

export const TaskDiagram = () => {
    const { groupId = '', taskId = '' } = useParams();
    const { data } = useFetch<DiagramData>(
        `group/${groupId}/task/${taskId}/finished-diagram/`
    );

    const { isLoaded, engine, model, serializedModel, setSerializedModel } =
        useClassDiagram();

    useEffect(() => {
        if (!data) {
            return;
        }

        const currentSerializedModel = model.serialize();

        model.deserializeModel(data.data, engine);
        setSerializedModel(model.serialize());
    }, [data]);

    useEffect(() => {
        if (!serializedModel) {
            return;
        }

        model.setLocked(true);
        engine.zoomToFit();
    }, [serializedModel]);

    if (!isLoaded || !data) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ height: '500px', marginTop: '40px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button sx={{}} onClick={() => engine.zoomToFit()}>
                    Zoom to fit
                </Button>
            </Box>
            <CanvasWidget
                engine={engine}
                className='diagram-container-presentation'
            />
        </Box>
    );
};
