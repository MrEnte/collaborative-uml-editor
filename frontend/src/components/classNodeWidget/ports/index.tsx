import { FC } from 'react';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import {
    DiagramEngine,
    PortModel,
    PortWidget,
} from '@projectstorm/react-diagrams';

type Props = {
    model: ClassNodeModel;
    engine: DiagramEngine;
    amount: number;
    alignment: 'top' | 'bottom';
};

const PORT_WIDTH = 16;

export const HorizontalPorts: FC<Props> = ({
    model,
    engine,
    amount,
    alignment,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            {Array.from(Array(amount).keys()).map((item) => (
                <PortWidget
                    key={`bottom-${item}`}
                    port={model.getPort(`${alignment}-${item}`) as PortModel}
                    engine={engine}
                >
                    <div
                        style={{
                            width: `${PORT_WIDTH}px`,
                            height: `16px`,
                            backgroundColor: 'white',
                        }}
                    />
                </PortWidget>
            ))}
        </div>
    );
};
