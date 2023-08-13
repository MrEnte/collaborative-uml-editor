import {
    DeserializeEvent,
    NodeModel,
    NodeModelGenerics,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import { ClassPortModel } from './classPortModel';

type ClassNodeModelGenerics = {
    PORT: ClassPortModel;
};

type ClassNodeModelOptions = {
    className?: string;
    attributes?: string[];
    methods?: string[];
};

export class ClassNodeModel extends NodeModel<
    NodeModelGenerics & ClassNodeModelGenerics
> {
    className = '';
    attributes: string[] = [];
    methods: string[] = [];

    constructor(config: ClassNodeModelOptions = {}) {
        super({
            ...config,
            type: 'class',
        });
        this.className = config.className || '';
        this.attributes = config.attributes || [];
        this.methods = config.methods || [];

        this.addPort(new ClassPortModel(PortModelAlignment.LEFT));
        this.addPort(new ClassPortModel(PortModelAlignment.RIGHT));
        this.addPort(new ClassPortModel(PortModelAlignment.TOP));
        this.addPort(new ClassPortModel(PortModelAlignment.BOTTOM));
    }

    serialize() {
        return {
            ...super.serialize(),
            className: this.className,
            attributes: this.attributes,
            methods: this.methods,
        };
    }

    deserialize(event: DeserializeEvent<this>): void {
        super.deserialize(event);
        this.className = event.data.className;
        this.attributes = event.data.attributes;
        this.methods = event.data.methods;
    }
}
