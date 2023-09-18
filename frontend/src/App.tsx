import React, { useEffect } from 'react';
import { DiagramListener } from '@projectstorm/react-diagrams';
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

type Message = {
    type: string;
    serialized_diagram: ReturnType<CanvasModel['serialize']>;
};

const socketUrl = 'ws://localhost:8000/ws/diagram-socket-server/';

function App() {
    const { isLoaded, engine, model, serializedModel, setSerializedModel } =
        useClassDiagram();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nodeListener: DiagramListener = {
        eventDidFire: () => {
            const newSerializedModel = model.serialize();
            const newModels = newSerializedModel.layers[1].models;
            const oldModels = serializedModel?.layers[1].models;

            if (JSON.stringify(newModels) !== JSON.stringify(oldModels)) {
                window.console.error('serialized');
                window.console.error(newModels, oldModels);
                setSerializedModel(newSerializedModel);
            }
        },
    };

    // model.registerListener(nodeListener);

    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onMessage: (e) => {
            const data = JSON.parse(e.data as string) as Message;

            if (data.type === 'diagram_message') {
                model.deserializeModel(
                    {
                        ...model.serialize(),
                        layers: data.serialized_diagram.layers,
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
