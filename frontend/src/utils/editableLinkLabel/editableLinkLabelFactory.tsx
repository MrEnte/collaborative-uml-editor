import * as React from 'react';
import {
    AbstractReactFactory,
    GenerateWidgetEvent,
} from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { EditableLinkLabelModel } from './editableLinkLabelModel';
import { EditableLinkLabelWidget } from '../../components/editableLinkLabelWidget';

export class EditableLinkLabelFactory extends AbstractReactFactory<
    EditableLinkLabelModel,
    DiagramEngine
> {
    constructor() {
        super('editable-link-label');
    }

    generateModel(): EditableLinkLabelModel {
        return new EditableLinkLabelModel();
    }

    generateReactWidget(
        event: GenerateWidgetEvent<EditableLinkLabelModel>
    ): JSX.Element {
        return (
            <EditableLinkLabelWidget model={event.model} engine={this.engine} />
        );
    }
}
