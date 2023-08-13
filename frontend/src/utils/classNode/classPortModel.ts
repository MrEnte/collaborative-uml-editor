import {
    DefaultLinkModel,
    LinkModel,
    PortModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';

export class ClassPortModel extends PortModel {
    constructor(alignment: PortModelAlignment) {
        super({
            type: 'class',
            name: alignment,
            alignment: alignment,
        });
    }

    createLinkModel(): LinkModel {
        return new DefaultLinkModel();
    }
}