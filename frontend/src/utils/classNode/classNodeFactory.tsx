import {
    AbstractReactFactory,
    DiagramEngine,
    GenerateWidgetEvent,
} from '@projectstorm/react-diagrams';
import { ClassNodeWidget } from '../../components/classNodeWidget';

import { ClassNodeModel } from './classNodeModel';

export class ClassNodeFactory extends AbstractReactFactory<
    ClassNodeModel,
    DiagramEngine
> {
    constructor() {
        super('class');
    }

    generateReactWidget(
        event: GenerateWidgetEvent<ClassNodeModel>
    ): JSX.Element {
        return <ClassNodeWidget engine={this.engine} model={event.model} />;
    }

    generateModel() {
        return new ClassNodeModel();
    }
}
