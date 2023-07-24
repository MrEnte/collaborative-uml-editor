import { FC } from 'react';

export type Model = {
    type: string;
};

type Props = {
    model: Model;
    color: string;
    name: string;
};

export const TrayItemWidget: FC<Props> = ({ model, color, name }) => {
    return (
        <div
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData(
                    'storm-diagram-node',
                    JSON.stringify(model)
                );
            }}
            style={{
                color: 'white',
                padding: '5px',
                margin: '0px 10px',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderRadius: '5px',
                marginBottom: '2px',
                cursor: 'grab',
                borderColor: color,
            }}
        >
            {name}
        </div>
    );
};
