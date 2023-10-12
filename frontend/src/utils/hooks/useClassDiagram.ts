import { useEffect, useState } from 'react';
import createEngine, {
    DeleteItemsAction,
    DiagramEngine,
    DiagramModel,
    PathFindingLinkFactory,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import { SimplePortFactory } from '../simplePortFactory';
import { ClassPortModel } from '../classNode/classPortModel';
import { ClassNodeFactory } from '../classNode/classNodeFactory';
import { ArrowLinkFactory } from '../arrowLink/arrowLinkFactory';
import { EditableLinkLabelFactory } from '../editableLinkLabel/editableLinkLabelFactory';
import { CanvasModel } from '@projectstorm/react-canvas-core/dist/@types/entities/canvas/CanvasModel';

export const useClassDiagram = () => {
    const [state, setState] = useState<{
        isLoaded: boolean;
        engine: DiagramEngine;
        model: DiagramModel;
    }>({
        isLoaded: false,
        engine: createEngine({
            registerDefaultDeleteItemsAction: false,
        }),
        model: new DiagramModel(),
    });

    const [serializedModel, setSerializedModel] =
        useState<ReturnType<CanvasModel['serialize']>>();

    useEffect(() => {
        const { engine, model } = state;
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
        engine
            .getLabelFactories()
            .registerFactory(new EditableLinkLabelFactory());

        engine.setModel(model);

        engine.getActionEventBus().registerAction(
            new DeleteItemsAction({
                keyCodes: [8],
                modifiers: { shiftKey: true },
            })
        );

        model.serialize();

        setState({
            isLoaded: true,
            engine,
            model,
        });
    }, []);

    return {
        ...state,
        serializedModel,
        setSerializedModel,
    };
};
