import { useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { TrayItemWidget } from '../../components/trayItemWidget';
import { ClassNodeModel } from '../../utils/classNode/classNodeModel';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import React from 'react';
import { useClassDiagram } from '../../utils/hooks/useClassDiagram';
import { DiagramSelector } from './diagramSelector';
import { ClassMerger } from './classMerger';
import { CanvasModel } from '@projectstorm/react-canvas-core/dist/@types/entities/canvas/CanvasModel';

export const DiagramMergingPage = () => {
    const { groupId = '', taskId = '', subtaskId = '' } = useParams();
    const {
        isLoaded: groupIsLoaded,
        engine: groupEngine,
        model: groupModel,
        serializedModel: groupSerializedModel,
        setSerializedModel: setGroupSerializedModel,
    } = useClassDiagram();

    const {
        isLoaded: individualIsLoaded,
        engine: individualEngine,
        model: individualModel,
        serializedModel: individualSerializedModel,
        setSerializedModel: setIndividualSerializedModel,
    } = useClassDiagram();

    groupEngine.setModel(groupModel);

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    height: '70%',
                    backgroundColor: '#333333',
                }}
            >
                <Box
                    style={{
                        margin: '15px',
                        minWidth: '8%',
                        position: 'absolute',
                        zIndex: 2,
                    }}
                >
                    <TrayItemWidget
                        model={{ type: 'class' }}
                        name='Class Node'
                        color='rgb(0,192,255)'
                    />
                </Box>
                <Box
                    style={{ height: '100%' }}
                    onDrop={(event) => {
                        const nodeData = event.dataTransfer.getData(
                            ' storm-diagram-node'
                        );
                        let node = new ClassNodeModel();
                        if (nodeData.includes('className')) {
                            node = new ClassNodeModel(
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                JSON.parse(nodeData)
                            );
                        }

                        const point = groupEngine.getRelativeMousePoint(event);

                        node.setPosition(point);
                        groupModel.addNode(node);

                        groupEngine.repaintCanvas();
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                    }}
                >
                    <CanvasWidget
                        engine={groupEngine}
                        className='diagram-container'
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    height: '30%',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        width: '50%',
                    }}
                >
                    <DiagramSelector
                        setSerializedModel={setIndividualSerializedModel}
                        serializedModel={
                            individualSerializedModel as ReturnType<
                                CanvasModel['serialize']
                            >
                        }
                        engine={individualEngine}
                        model={individualModel}
                        isLoaded={individualIsLoaded}
                    />
                </Box>
                <Box
                    sx={{
                        height: '100%',
                        width: '50%',
                    }}
                >
                    <ClassMerger individualModel={individualModel} />
                </Box>
            </Box>
        </Box>
    );
};
