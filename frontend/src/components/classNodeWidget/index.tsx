import {
    DiagramEngine,
    PortModel,
    PortModelAlignment,
    PortWidget,
} from '@projectstorm/react-diagrams';
import { FC } from 'react';
import { Divider, Input } from '@mui/material';
import { ClassNodeModel } from '../../utils/classNode/classNodeModel';

type Props = {
    node: ClassNodeModel;
    engine: DiagramEngine;
};

export const ClassNodeWidget: FC<Props> = ({ node, engine }) => {
    return (
        <div style={{ backgroundColor: 'white' }}>
            <Input
                onChange={(event) => (node.className = event.target.value)}
            />
            <Divider />
            <Input />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <PortWidget
                    port={node.getPort(PortModelAlignment.LEFT) as PortModel}
                    engine={engine}
                >
                    <div
                        style={{
                            width: '16px',
                            height: '100%',
                            backgroundColor: 'red',
                        }}
                    />
                </PortWidget>
                <PortWidget
                    port={node.getPort(PortModelAlignment.RIGHT) as PortModel}
                    engine={engine}
                >
                    <div
                        style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: 'green',
                        }}
                    />
                </PortWidget>
            </div>
        </div>
    );
};
