import React from 'react';
import createEngine, {
    DeleteItemsAction,
    DiagramModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import './App.css';
import { TrayWidget } from './components/trayWidget';
import { TrayItemWidget } from './components/trayItemWidget';
import { SimplePortFactory } from './utils/simplePortFactory';
import { ClassNodeFactory } from './utils/classNode/classNodeFactory';

import { ClassNodeModel } from './utils/classNode/classNodeModel';
import { ClassPortModel } from './utils/classNode/classPortModel';
import { Button, ThemeProvider } from '@mui/material';
import { theme } from './common/theme';
import { ArrowLinkFactory } from './utils/arrowLink/arrowLinkFactory';
import { EditableLinkLabelFactory } from './utils/editableLinkLabel/editableLinkLabelFactory';
import testClassDiagram from './testClassDiagram.json';

function App() {
    const engine = createEngine({ registerDefaultDeleteItemsAction: false });

    engine
        .getPortFactories()
        .registerFactory(
            new SimplePortFactory(
                'class',
                () => new ClassPortModel('b-1', PortModelAlignment.LEFT)
            )
        );
    engine.getNodeFactories().registerFactory(new ClassNodeFactory());
    engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
    engine.getLabelFactories().registerFactory(new EditableLinkLabelFactory());

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
                    <Button
                        onClick={() => {
                            window.console.error('start');
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            model.deserializeModel(testClassDiagram, engine);
                            engine.repaintCanvas();
                            window.console.error('end');
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
