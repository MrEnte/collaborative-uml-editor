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
    model: ClassNodeModel;
    engine: DiagramEngine;
};

export const ClassNodeWidget: FC<Props> = ({ model, engine }) => {
    const [editMode, setEditMode] = useState(true);
    return (
        <div
            style={{
                width: '250px',
            }}
        >
            {editMode ? (
                <ClassNodeEditMode model={model} setEditMode={setEditMode} />
            ) : (
                <ClassNodeViewMode model={model} setEditMode={setEditMode} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <PortWidget
                    port={model.getPort(PortModelAlignment.LEFT) as PortModel}
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
                    port={model.getPort(PortModelAlignment.RIGHT) as PortModel}
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
