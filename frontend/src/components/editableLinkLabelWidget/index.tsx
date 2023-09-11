import { FC, useState } from 'react';
import { EditableLinkLabelModel } from '../../utils/editableLinkLabel/editableLinkLabelModel';
import { Button, Input, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

type Props = {
    model: EditableLinkLabelModel;
};

export const EditableLinkLabelWidget: FC<Props> = ({ model }) => {
    const [editMode, setEditMode] = useState(true);
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
                    }}
                >
                    <SaveIcon />
                </Button>
            </div>
        );
    }

    return (
        <div
            onClick={() => setEditMode(true)}
            style={{
                backgroundColor: 'black',
                pointerEvents: 'auto',
                padding: '1px',
                borderRadius: '5px',
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
