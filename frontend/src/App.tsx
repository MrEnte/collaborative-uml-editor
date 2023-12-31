import React, { useEffect } from 'react';
import { BaseEvent } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import './App.css';
import { TrayItemWidget } from './components/trayItemWidget';

import { ClassNodeModel } from './utils/classNode/classNodeModel';
import { Box, Button, ThemeProvider, Typography } from '@mui/material';
import { theme } from './common/theme';
import { CanvasModel } from '@projectstorm/react-canvas-core/dist/@types/entities/canvas/CanvasModel';
import useWebSocket from 'react-use-websocket';
import { useClassDiagram } from './utils/hooks/useClassDiagram';
import { useNavigate, useParams } from 'react-router-dom';
import {
    AUTH_TOKEN_IDENTIFIER,
    BASE_API_WEBSOCKET_URL,
    useFetch,
} from './utils/hooks/useFetch';
import { Cookies } from 'react-cookie';
import { SubtaskData } from './DiagramManagement/presenting';

export type Message = {
    type: string;
    serialized_diagram: ReturnType<CanvasModel['serialize']>;
};

function App() {
    const { isLoaded, engine, model, serializedModel, setSerializedModel } =
        useClassDiagram();

    const {
        subtaskId = '',
        groupId = '',
        taskId = '',
    } = useParams<{
        groupId: string;
        subtaskId: string;
        taskId: string;
    }>();
    const navigate = useNavigate();

    const { data: subtaskData } = useFetch<SubtaskData>(
        `group/${groupId}/task/${taskId}/subtask/${subtaskId}/`
    );

    const nodes = model.getNodes();
    const links = model.getLinks();
    useEffect(() => {
        window.console.error(nodes);
        window.console.error(links);
        window.console.error(model);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        model.registerListener({
            linksUpdated: (event) => {
                event.link.registerListener({
                    connectionTypeChanged: () => {
                        window.console.error('connectionTypeChanged');
                        const newSerializedModel = model.serialize();
                        setSerializedModel(newSerializedModel);
                    },
                    labelChanged: () => {
                        window.console.error('labelChanged');
                        const newSerializedModel = model.serialize();
                        setSerializedModel(newSerializedModel);
                    },
                    entityRemoved: () => {
                        window.console.error('entityRemoved');
                        const newSerializedModel = model.serialize();
                        setSerializedModel(newSerializedModel);
                    },
                });

                event.link.getPoints().forEach((point) => {
                    point.registerListener({
                        selectionChanged: () => {
                            window.console.error('selectionChanged');
                            const newSerializedModel = model.serialize();
                            setSerializedModel(newSerializedModel);
                        },
                    });
                });
            },
            nodesUpdated: (event: BaseEvent) => {
                window.console.error('nodesUpdated');
                window.console.error(event);
                const newSerializedModel = model.serialize();
                const newModels = newSerializedModel.layers[1].models;
                const oldModels = serializedModel?.layers[1].models;

                if (JSON.stringify(newModels) !== JSON.stringify(oldModels)) {
                    setSerializedModel(newSerializedModel);
                }
            },
        });

        links.forEach((link) => {
            link.registerListener({
                connectionTypeChanged: () => {
                    window.console.error('connectionTypeChanged');
                    const newSerializedModel = model.serialize();
                    setSerializedModel(newSerializedModel);
                },
                labelChanged: () => {
                    window.console.error('labelChanged');
                    const newSerializedModel = model.serialize();
                    setSerializedModel(newSerializedModel);
                },
                entityRemoved: () => {
                    window.console.error('entityRemoved');
                    const newSerializedModel = model.serialize();
                    setSerializedModel(newSerializedModel);
                },
            });

            link.getPoints().forEach((point) => {
                point.registerListener({
                    selectionChanged: () => {
                        window.console.error('selectionChanged');
                        const newSerializedModel = model.serialize();
                        setSerializedModel(newSerializedModel);
                    },
                });
            });
        });

        nodes.forEach((node) => {
            node.registerListener({
                selectionChanged: (event: BaseEvent) => {
                    const newSerializedModel = model.serialize();
                    const newModels = newSerializedModel.layers[1].models;
                    const oldModels = serializedModel?.layers[1].models;

                    const currentNodeId = node.getID();
                    const currentNode = newModels[currentNodeId] as unknown as {
                        x: number;
                        y: number;
                    };
                    const oldNode = oldModels
                        ? (oldModels[currentNodeId] as unknown as {
                              x: number;
                              y: number;
                          })
                        : undefined;

                    let positionChanged = true;
                    if (oldNode) {
                        positionChanged =
                            currentNode.x !== oldNode.x ||
                            currentNode.y !== oldNode.y;
                    }

                    if (positionChanged) {
                        setSerializedModel(newSerializedModel);
                    }
                },
            });
        });
    }, [nodes, links]);

    const { diagramId = '' } = useParams<{ diagramId: string }>();
    const socketUrl = `${BASE_API_WEBSOCKET_URL}diagram-socket-server/${diagramId}/`;
    const cookies = new Cookies();

    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onMessage: (e) => {
            const data = JSON.parse(e.data as string) as Message;

            if (data.type === 'diagram_message') {
                const currentSerializedModel = model.serialize();

                if (!Object.keys(data.serialized_diagram).length) {
                    return;
                }

                const layers = currentSerializedModel.layers.map(
                    (layer, index) => {
                        const models = layer.models;
                        const modelsFromData =
                            data.serialized_diagram.layers[index].models;

                        const lengthOfModels = Object.keys(models).length;
                        if (lengthOfModels === 0) {
                            return {
                                ...layer,
                                models: modelsFromData,
                            };
                        }

                        const lengthOfModelsFromData =
                            Object.keys(modelsFromData).length;
                        const baseModel =
                            lengthOfModels > lengthOfModelsFromData
                                ? models
                                : modelsFromData;

                        const keysOfModels = Object.keys(baseModel);
                        const keysOfModelsFromData =
                            Object.keys(modelsFromData);

                        // get the keys that are in models but not in modelsFromData
                        const keysToRemove = keysOfModels.filter(
                            (key) => !keysOfModelsFromData.includes(key)
                        );

                        // get the keys that are in modelsFromData but not in models
                        const keysToAdd = keysOfModelsFromData.filter(
                            (key) => !keysOfModels.includes(key)
                        );

                        // get the keys that are in both models and modelsFromData
                        const keysToUpdate = keysOfModels.filter((key) =>
                            keysOfModelsFromData.includes(key)
                        );

                        const modelsWithRemovedKeys = keysToRemove.reduce(
                            (acc, key) => {
                                const currentModel = models[key];

                                if (!currentModel.selected) {
                                    const { [key]: _, ...rest } = acc;
                                    return rest;
                                }

                                return {
                                    ...acc,
                                };
                            },
                            models
                        );

                        const modelsWithAddedKeys = keysToAdd.reduce(
                            (acc, key) => {
                                return {
                                    ...acc,
                                    [key]: modelsFromData[key],
                                };
                            },
                            modelsWithRemovedKeys
                        );

                        const modelsWithUpdatedKeys = keysToUpdate.reduce(
                            (acc, key) => {
                                return {
                                    ...acc,
                                    [key]: modelsFromData[key],
                                };
                            },
                            modelsWithAddedKeys
                        );

                        return {
                            ...layer,
                            models: modelsWithUpdatedKeys,
                        };
                    }
                );

                model.deserializeModel(
                    {
                        ...currentSerializedModel,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        layers: layers,
                    },
                    engine
                );
                engine.repaintCanvas();
            }
        },
        queryParams: {
            token: cookies.get<string>(AUTH_TOKEN_IDENTIFIER),
        },
    });

    useEffect(() => {
        if (readyState !== 1) {
            return;
        }

        if (!serializedModel) {
            return;
        }

        sendJsonMessage({
            serialized_diagram: serializedModel,
            id: diagramId,
        });
        engine.repaintCanvas();
    }, [serializedModel, readyState]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box
                    style={{
                        backgroundColor: '#333333',
                        height: '100vh',
                    }}
                >
                    <Box
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box style={{ margin: '15px' }}>
                            <TrayItemWidget
                                model={{ type: 'class' }}
                                name='Class Node'
                                color='rgb(0,192,255)'
                            />
                        </Box>
                        <Button
                            sx={{ margin: '15px' }}
                            variant='contained'
                            onClick={() => {
                                sendJsonMessage({
                                    serialized_diagram: model.serialize(),
                                    id: diagramId,
                                });

                                navigate(
                                    `/groups/${groupId}/tasks/${taskId}/subtasks/${subtaskId}/presentation`
                                );
                            }}
                        >
                            Fertig
                        </Button>
                    </Box>
                    <Box
                        style={{ height: '75%' }}
                        onDrop={(event) => {
                            const node = new ClassNodeModel();
                            const point = engine.getRelativeMousePoint(event);

                            node.setPosition(point);
                            model.addNode(node);

                            engine.repaintCanvas();
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                        }}
                    >
                        <CanvasWidget
                            engine={engine}
                            className='diagram-container'
                        />
                    </Box>
                    <Box style={{ margin: '15px', height: '12%' }}>
                        <Typography style={{ color: 'white' }} variant={'h5'}>
                            Subtask:
                        </Typography>
                        <Typography style={{ color: 'white' }}>
                            {subtaskData?.description}
                        </Typography>
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default App;
