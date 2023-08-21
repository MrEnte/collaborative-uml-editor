import React from 'react';
import createEngine, {
    DefaultNodeModel,
    DeleteItemsAction,
    DiagramModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import './App.css';
import { TrayWidget } from './components/trayWidget';
import { Model, TrayItemWidget } from './components/trayItemWidget';
import { SimplePortFactory } from './utils/simplePortFactory';
import { ClassNodeFactory } from './utils/classNode/classNodeFactory';

import { ClassNodeModel } from './utils/classNode/classNodeModel';
import { ClassPortModel } from './utils/classNode/classPortModel';
import { Button, ThemeProvider } from '@mui/material';
import { theme } from './common/theme';

function App() {
    const engine = createEngine({ registerDefaultDeleteItemsAction: false });

    engine
        .getPortFactories()
        .registerFactory(
            new SimplePortFactory(
                'class',
                () => new ClassPortModel(PortModelAlignment.LEFT)
            )
        );
    engine.getNodeFactories().registerFactory(new ClassNodeFactory());

    const model = new DiagramModel();
    engine.setModel(model);

    engine.getActionEventBus().registerAction(
        new DeleteItemsAction({
            keyCodes: [8],
            modifiers: { shiftKey: true },
        })
    );

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
                            model={{ type: 'in' }}
                            name='In Node'
                            color='rgb(192,255,0)'
                        />
                        <TrayItemWidget
                            model={{ type: 'out' }}
                            name='Out Node'
                            color='rgb(0,192,255)'
                        />
                        <TrayItemWidget
                            model={{ type: 'class' }}
                            name='Class Node'
                            color='rgb(0,192,255)'
                        />
                    </TrayWidget>
                    <Button
                        onClick={() => window.console.error(model.serialize())}
                    >
                        Serialize
                    </Button>
                    {/*<Button onClick={() => window.console.error(model.deserialize())}>*/}
                    {/*    Deserialize*/}
                    {/*</Button>*/}
                    <div
                        style={{ height: '100%' }}
                        onDrop={(event) => {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            const data: Model = JSON.parse(
                                event.dataTransfer.getData('storm-diagram-node')
                            );
                            const nodesCount = Object.keys(
                                model.getNodes()
                            ).length;

                            let node;
                            if (data.type === 'in') {
                                node = new DefaultNodeModel(
                                    'Node ' + (nodesCount + 1).toString(),
                                    'rgb(192,255,0)'
                                );
                                node.addInPort('In');
                            } else if (data.type === 'out') {
                                node = new DefaultNodeModel(
                                    'Node ' + (nodesCount + 1).toString(),
                                    'rgb(0,192,255)'
                                );
                                node.addOutPort('Out');
                            } else {
                                node = new ClassNodeModel();
                            }
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
