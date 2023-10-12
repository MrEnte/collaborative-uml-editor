import { FC, useState } from 'react';
import { EditableLinkLabelModel } from '../../utils/editableLinkLabel/editableLinkLabelModel';
import { Button, Input, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { DiagramEngine } from '@projectstorm/react-diagrams';

type Props = {
    model: EditableLinkLabelModel;
    engine: DiagramEngine;
};

export const EditableLinkLabelWidget: FC<Props> = ({ model, engine }) => {
    const [editMode, setEditMode] = useState(false);
    const [label, setLabel] = useState(model.value);

    if (editMode) {
        return (
            <div
                style={{
                    backgroundColor: 'white',
                    pointerEvents: 'auto',
                    width: '120px',
                    height: '20px',
                    display: 'flex',
                }}
            >
                <Input
                    onChange={(e) => setLabel(e.target.value)}
                    value={label}
                />
                <Button
                    onClick={() => {
                        setEditMode(false);
                        model.value = label;
                        engine.repaintCanvas();

                        const link = model.getParent();
                        if (link) {
                            link.fireEvent({ link: link }, 'labelChanged');
                        }
                    }}
                >
                    <SaveIcon />
                </Button>
            </div>
        );
    }

    return (
        <div
            onClick={() => {
                setEditMode(true);
            }}
            style={{
                backgroundColor: 'black',
                pointerEvents: 'auto',
                padding: '1px',
                borderRadius: '5px',
                minWidth: '12px',
                minHeight: '12px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Typography
                style={{
                    pointerEvents: 'none',
                    color: 'white',
                }}
            >
                {model.value}
            </Typography>
        </div>
    );
};
