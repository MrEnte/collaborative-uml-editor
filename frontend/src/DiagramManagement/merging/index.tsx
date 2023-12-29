import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { TrayItemWidget } from '../../components/trayItemWidget';
import { ClassNodeModel } from '../../utils/classNode/classNodeModel';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import React, { useEffect } from 'react';
import { useClassDiagram } from '../../utils/hooks/useClassDiagram';
import { DiagramSelector } from './diagramSelector';
import { ClassMerger } from './classMerger';
import { CanvasModel } from '@projectstorm/react-canvas-core/dist/@types/entities/canvas/CanvasModel';
import {
    AUTH_TOKEN_IDENTIFIER,
    BASE_API_WEBSOCKET_URL,
    useFetch,
} from '../../utils/hooks/useFetch';
import { DiagramData } from '../presenting';
import { Cookies } from 'react-cookie';
import useWebSocket from 'react-use-websocket';
import { Message } from '../../App';
import { BaseEvent } from '@projectstorm/react-diagrams';

export const DiagramMergingPage = () => {
    const { groupId = '', taskId = '', subtaskId = '' } = useParams();
    const navigate = useNavigate();
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

    const { data: backendDiagramData } = useFetch<DiagramData>(
        `group/${groupId}/task/${taskId}/diagram-merging/`
    );

    const nodes = groupModel.getNodes();
    const links = groupModel.getLinks();
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        groupModel.registerListener({
            linksUpdated: (event) => {
                event.link.registerListener({
                    connectionTypeChanged: () => {
                        const newSerializedModel = groupModel.serialize();
                        setGroupSerializedModel(newSerializedModel);
                    },
                    labelChanged: () => {
                        const newSerializedModel = groupModel.serialize();
                        setGroupSerializedModel(newSerializedModel);
                    },
                    entityRemoved: () => {
                        const newSerializedModel = groupModel.serialize();
                        setGroupSerializedModel(newSerializedModel);
                    },
                });

                event.link.getPoints().forEach((point) => {
                    point.registerListener({
                        selectionChanged: () => {
                            const newSerializedModel = groupModel.serialize();
                            setGroupSerializedModel(newSerializedModel);
                        },
                    });
                });
            },
            nodesUpdated: (event: BaseEvent) => {
                const newSerializedModel = groupModel.serialize();
                const newModels = newSerializedModel.layers[1].models;
                const oldModels = groupSerializedModel?.layers[1].models;

                if (JSON.stringify(newModels) !== JSON.stringify(oldModels)) {
                    setGroupSerializedModel(newSerializedModel);
                }
            },
        });

        links.forEach((link) => {
            link.registerListener({
                connectionTypeChanged: () => {
                    const newSerializedModel = groupModel.serialize();
                    setGroupSerializedModel(newSerializedModel);
                },
                labelChanged: () => {
                    const newSerializedModel = groupModel.serialize();
                    setGroupSerializedModel(newSerializedModel);
                },
                entityRemoved: () => {
                    const newSerializedModel = groupModel.serialize();
                    setGroupSerializedModel(newSerializedModel);
                },
            });

            link.getPoints().forEach((point) => {
                point.registerListener({
                    selectionChanged: () => {
                        const newSerializedModel = groupModel.serialize();
                        setGroupSerializedModel(newSerializedModel);
                    },
                });
            });
        });

        nodes.forEach((node) => {
            node.registerListener({
                selectionChanged: (event: BaseEvent) => {
                    const newSerializedModel = groupModel.serialize();
                    const newModels = newSerializedModel.layers[1].models;
                    const oldModels = groupSerializedModel?.layers[1].models;

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
                        setGroupSerializedModel(newSerializedModel);
                    }
                },
            });
        });
    }, [nodes, links]);

    const socketUrl = `${BASE_API_WEBSOCKET_URL}diagram-socket-server/${
        backendDiagramData?.id || ''
    }/`;
    const cookies = new Cookies();
    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onMessage: (e) => {
            const data = JSON.parse(e.data as string) as Message;

            if (data.type === 'diagram_finished') {
                navigate(`/groups/${groupId}/tasks/${taskId}`);
            }

            if (data.type === 'diagram_message') {
                const currentSerializedModel = groupModel.serialize();

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

                groupModel.deserializeModel(
                    {
                        ...currentSerializedModel,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        layers: layers,
                    },
                    groupEngine
                );
                groupEngine.repaintCanvas();
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

        if (!groupSerializedModel || !backendDiagramData) {
            return;
        }

        sendJsonMessage({
            serialized_diagram: groupSerializedModel,
            id: backendDiagramData.id,
        });
        groupEngine.repaintCanvas();
    }, [groupSerializedModel, readyState]);

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
                        padding: '15px',
                        minWidth: '8%',
                        position: 'absolute',
                        zIndex: 2,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <TrayItemWidget
                        model={{ type: 'class' }}
                        name='Class Node'
                        color='rgb(0,192,255)'
                    />
                    <Button
                        variant='contained'
                        onClick={() => {
                            sendJsonMessage({
                                serialized_diagram: groupModel.serialize(),
                                type: 'diagram_finished',
                                subtask_id: subtaskId,
                            });
                        }}
                    >
                        Fertig
                    </Button>
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
