import {
    ARROW_LINK_TYPES_WITH_DASHED_PATH,
    ArrowLinkModel,
} from './arrowLinkModel';
import { ArrowLinkWidget } from '../../components/arrowLinkWidget';
import {
    DefaultLinkFactory,
    GenerateWidgetEvent,
} from '@projectstorm/react-diagrams';

export class ArrowLinkFactory extends DefaultLinkFactory<ArrowLinkModel> {
    constructor() {
        super('arrow');
    }

    generateModel(): ArrowLinkModel {
        return new ArrowLinkModel();
    }

    generateLinkSegment(
        model: ArrowLinkModel,
        selected: boolean,
        path: string
    ): JSX.Element {
        const connectionType = model.connectionType;

        return (
            <path
                fill='none'
                strokeDasharray={
                    ARROW_LINK_TYPES_WITH_DASHED_PATH.includes(connectionType)
                        ? '5,5'
                        : 'none'
                }
                strokeWidth={model.getOptions().width}
                stroke={
                    selected
                        ? model.getOptions().selectedColor
                        : model.getOptions().color
                }
                d={path}
                pointerEvents='auto'
            />
        );
    }

    generateReactWidget(
        event: GenerateWidgetEvent<ArrowLinkModel>
    ): JSX.Element {
        return (
            <ArrowLinkWidget link={event.model} diagramEngine={this.engine} />
        );
    }
}
