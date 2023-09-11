import {
    LinkModel,
    PortModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import { ArrowLinkModel } from '../arrowLink/arrowLinkModel';

export class ClassPortModel extends PortModel {
    constructor(name: string, alignment: PortModelAlignment) {
        super({
            type: 'class',
            name: name,
            alignment: alignment,
        });
    }

    createLinkModel(): LinkModel {
        return new ArrowLinkModel();
    }
}
