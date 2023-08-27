import {
    LinkModel,
    PortModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import { ArrowLinkModel } from '../arrowLink/arrowLinkModel';

export class ClassPortModel extends PortModel {
    constructor(alignment: PortModelAlignment) {
        super({
            type: 'class',
            name: alignment,
            alignment: alignment,
        });
    }

    createLinkModel(): LinkModel {
        return new ArrowLinkModel();
    }
}
