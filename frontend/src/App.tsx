import React, { useEffect } from 'react';
import { BaseEvent } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import './App.css';
import { TrayWidget } from './components/trayWidget';
import { TrayItemWidget } from './components/trayItemWidget';

import { ClassNodeModel } from './utils/classNode/classNodeModel';
import { Button, ThemeProvider } from '@mui/material';
import { theme } from './common/theme';
import testClassDiagram from './testClassDiagram.json';
import { CanvasModel } from '@projectstorm/react-canvas-core/dist/@types/entities/canvas/CanvasModel';
import useWebSocket from 'react-use-websocket';
import { useClassDiagram } from './utils/hooks/useClassDiagram';
import { useParams } from 'react-router-dom';

type Message = {
    type: string;
    serialized_diagram: ReturnType<CanvasModel['serialize']>;
};

type DiagramData = {
    id: number;
    name: string;
    created_by: string;
    created_at: string;
    content: ReturnType<CanvasModel['serialize']>;
};

function App() {
    const { isLoaded, engine, model, serializedModel, setSerializedModel } =
        useClassDiagram();

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
        });

        nodes.forEach((node) => {
            node.registerListener({
                selectionChanged: (event: BaseEvent) => {
                    window.console.error(
                        'selectionChanged',
                        event,
                        node.isSelected()
                    );
                    if (!node.isSelected()) {
                        const newSerializedModel = model.serialize();
                        const newModels = newSerializedModel.layers[1].models;
                        const oldModels = serializedModel?.layers[1].models;

                        if (
                            JSON.stringify(newModels) !==
                            JSON.stringify(oldModels)
                        ) {
                            setSerializedModel(newSerializedModel);
                        }
                    }
                },
            });
        });
    }, [nodes, links]);

    const { diagramId = '' } = useParams<{ diagramId: string }>();
    const socketUrl = `ws://localhost:8000/ws/diagram-socket-server/${diagramId}/`;
    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onMessage: (e) => {
            const data = JSON.parse(e.data as string) as Message;

            window.console.error('onMessage', data);

            if (data.type === 'diagram_message') {
                const currentSerializedModel = model.serialize();

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

                        window.console.error('___________________');
                        window.console.error(models);
                        window.console.error(modelsFromData);
                        window.console.error(baseModel);

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

                        window.console.error(keysToRemove);
                        window.console.error(keysToAdd);
                        window.console.error(keysToUpdate);

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
    });

    useEffect(() => {
        if (readyState !== 1) {
            window.console.error('chatSocket.readyState === 0');
            return;
        }

        if (!serializedModel) {
            return;
        }

        window.console.error('useEffect', serializedModel);
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
                <div
                    style={{
                        backgroundColor: '#141414',
                        height: '100vh',
                    }}
                >
                    <TrayWidget>
                        <TrayItemWidget
                            model={{ type: 'class' }}
                            name='Class Node'
                            color='rgb(0,192,255)'
                        />
                    </TrayWidget>
                    <Button
                        onClick={() => {
                            setSerializedModel(model.serialize());
                            window.console.error(serializedModel);
                        }}
                    >
                        Serialize
                    </Button>
                    <Button
                        onClick={() => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            model.deserializeModel(testClassDiagram, engine);
                            engine.repaintCanvas();
                        }}
                    >
                        Deserialize
                    </Button>
                    <div
                        style={{ height: '100%' }}
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
                    </div>
                </div>
            </ThemeProvider>
        </>
    );
}

export default App;
