import { LabelModel } from '@projectstorm/react-diagrams';
import {
    BaseModelOptions,
    DeserializeEvent,
} from '@projectstorm/react-canvas-core';

export type EditableLabelOptions = BaseModelOptions & {
    value?: string;
};

export class EditableLinkLabelModel extends LabelModel {
    value: string;

    constructor(options: EditableLabelOptions = {}) {
        super({
            ...options,
            type: 'editable-link-label',
        });
        this.value = options.value || '';
    }

    serialize() {
        return {
            ...super.serialize(),
            value: this.value,
        };
    }

    deserialize(event: DeserializeEvent<this>): void {
        super.deserialize(event);
        this.value = event.data.value;
    }
}
