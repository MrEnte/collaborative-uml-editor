import { ArrowLinkModel } from './arrowLinkModel';
import { ArrowLinkWidget } from '../../components/arrowLinkWidget';
import {
    DefaultLinkFactory,
    GenerateWidgetEvent,
} from '@projectstorm/react-diagrams';

export class ArrowLinkFactory extends DefaultLinkFactory {
    constructor() {
        super('arrow');
    }

    generateModel(): ArrowLinkModel {
        return new ArrowLinkModel();
    }

    generateReactWidget(
        event: GenerateWidgetEvent<ArrowLinkModel>
    ): JSX.Element {
        return (
            <ArrowLinkWidget link={event.model} diagramEngine={this.engine} />
        );
    }
}
