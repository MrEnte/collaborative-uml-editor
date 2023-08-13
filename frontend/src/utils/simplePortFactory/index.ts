import {
    AbstractModelFactory,
    DiagramEngine,
    GenerateModelEvent,
    PortModel,
} from '@projectstorm/react-diagrams';

export class SimplePortFactory extends AbstractModelFactory<
    PortModel,
    DiagramEngine
> {
    cb: (initialConfig?: any) => PortModel;

    constructor(type: string, cb: (initialConfig?: any) => PortModel) {
        super(type);
        this.cb = cb;
    }

    generateModel(event: GenerateModelEvent): PortModel {
        return this.cb(event.initialConfig);
    }
}
