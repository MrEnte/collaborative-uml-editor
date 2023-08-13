import React from 'react';
import createEngine, {
    DefaultLinkModel,
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
import { Button } from '@mui/material';

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

    // node 1
    const node1 = new DefaultNodeModel({
        name: 'Node 1',
        color: 'rgb(0,192,255)',
    });
    node1.setPosition(100, 100);
    const port1 = node1.addOutPort('Out');

    // node 2
    const node2 = new DefaultNodeModel({
        name: 'Node 2',
        color: 'rgb(0,192,255)',
    });
    node2.setPosition(500, 100);
    const port2 = node2.addOutPort('Out');

    // node 3
    const node3 = new ClassNodeModel();
    node2.setPosition(1000, 100);

    // link them and add a label to the link
    const link1 = port1.link<DefaultLinkModel>(port2);
    link1.addLabel('Hello World!');

    const model = new DiagramModel();
    model.addAll(node1, node2, link1, node3);
    engine.setModel(model);

    engine.getActionEventBus().registerAction(
        new DeleteItemsAction({
            keyCodes: [8],
            modifiers: { shiftKey: true },
        })
    );

    return (
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
            <Button onClick={() => window.console.error(model.serialize())}>
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
                    const nodesCount = Object.keys(model.getNodes()).length;

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
                <CanvasWidget engine={engine} className='diagram-container' />
            </div>
        </div>
    );
}

export default App;
