import {
    DiagramEngine,
    PortModel,
    PortModelAlignment,
    PortWidget,
} from '@projectstorm/react-diagrams';
import { FC, useState } from 'react';
import { ClassNodeModel } from '../../utils/classNode/classNodeModel';
import { ClassNodeEditMode } from './edit';
import { ClassNodeViewMode } from './view';

type Props = {
    node: ClassNodeModel;
    engine: DiagramEngine;
};

export const ClassNodeWidget: FC<Props> = ({ node, engine }) => {
    const [editMode, setEditMode] = useState(true);
    return (
        <div
            style={{
                width: '250px',
            }}
        >
            {editMode ? (
                <ClassNodeEditMode node={node} setEditMode={setEditMode} />
            ) : (
                <ClassNodeViewMode node={node} setEditMode={setEditMode} />
            )}
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
