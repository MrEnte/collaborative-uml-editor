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

export const PORT_AMOUNT_BOTTOM = 15;
export const PORT_AMOUNT_TOP = 11;
export const PORT_WIDTH = 16;

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

        Array.from(Array(PORT_AMOUNT_BOTTOM).keys()).forEach((item) => {
            this.addPort(
                new ClassPortModel(`bottom-${item}`, PortModelAlignment.BOTTOM)
            );
        });

        Array.from(Array(PORT_AMOUNT_TOP).keys()).forEach((item) => {
            this.addPort(
                new ClassPortModel(`top-${item}`, PortModelAlignment.BOTTOM)
            );
        });
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
