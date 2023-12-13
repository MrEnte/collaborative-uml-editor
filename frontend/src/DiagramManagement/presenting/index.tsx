import { useParams } from 'react-router-dom';
import { useFetch } from '../../utils/hooks/useFetch';
import { useClassDiagram } from '../../utils/hooks/useClassDiagram';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import React, { useEffect, useState } from 'react';
import { CanvasModel } from '@projectstorm/react-canvas-core/dist/@types/entities/canvas/CanvasModel';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import '../../App.css';
import { Template } from '../../Template';

type DiagramData = {
    id: number;
    created_at: string;
    created_by: string;
    data: ReturnType<CanvasModel['serialize']>;
};

type SubtaskData = {
    id: number;
    description: string;
    created_at: string;
    created_by: string;
    order: number;
    diagrams: DiagramData[];
};

export const DiagramPresentationPage = () => {
    const { groupId = '', taskId = '', subtaskId = '' } = useParams();
    const { data: subtaskData } = useFetch<SubtaskData>(
        `group/${groupId}/task/${taskId}/subtask/${subtaskId}/diagram-presentation/`
    );
    const diagrams = subtaskData?.diagrams;

    const [selectedDiagram, setSelectedDiagram] = useState<number>(0);

    const { isLoaded, engine, model, serializedModel, setSerializedModel } =
        useClassDiagram();

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
    }, [serializedModel]);

    if (!isLoaded || !subtaskData) {
        return <div>Loading...</div>;
    }

    return (
        <Template title={`Presentation of ${subtaskData.order + 1}. Subtask`}>
            <Typography variant='h4'>Subtask Description</Typography>
            <br />
            <Typography sx={{ whiteSpace: 'pre-line' }} variant='body1'>
                {subtaskData.description}
            </Typography>
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: ' 5px',
                }}
            >
                <Typography variant='body1'>
                    Currently selected diagram of
                </Typography>
                <Select
                    id='diagram-selector'
                    value={selectedDiagram}
                    onChange={(e) =>
                        setSelectedDiagram(e.target.value as number)
                    }
                >
                    {diagrams?.map((diagram, index) => (
                        <MenuItem key={diagram.id} value={index}>
                            {diagram.created_by}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Template>
    );
};
