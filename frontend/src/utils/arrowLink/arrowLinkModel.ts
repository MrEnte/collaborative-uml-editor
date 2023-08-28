import {
    DeserializeEvent,
    RightAngleLinkModel,
} from '@projectstorm/react-diagrams';

export const ARROW_LINK_TYPES = [
    'association',
    'inheritance',
    'implementation',
    'dependency',
    'aggregation',
    'composition',
    'none',
] as const;

export const ARROW_LINK_TYPES_WITH_DASHED_PATH = [
    'implementation',
    'dependency',
];

type ArrowLinkModelOptions = {
    connectionType?: (typeof ARROW_LINK_TYPES)[number];
};

export class ArrowLinkModel extends RightAngleLinkModel {
    connectionType: (typeof ARROW_LINK_TYPES)[number] = 'none';
    constructor(config: ArrowLinkModelOptions = {}) {
        super({
            ...config,
            type: 'arrow',
            width: 4,
        });

        if (config.connectionType) {
            this.connectionType = config.connectionType;
        }
    }

    serialize() {
        return {
            ...super.serialize(),
            connectionType: this.connectionType,
        };
    }

    deserialize(event: DeserializeEvent<this>): void {
        super.deserialize(event);
        this.connectionType = event.data.connectionType;
    }
}
