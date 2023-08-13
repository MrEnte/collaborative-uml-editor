import { FC, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import SaveIcon from '@mui/icons-material/Save';

type Props = {
    node: ClassNodeModel;
    setEditMode: (editMode: boolean) => void;
};

export const ClassNodeEditMode: FC<Props> = ({ node, setEditMode }) => {
    const [className, setClassName] = useState(node.className);
    const [attributes, setAttributes] = useState(node.attributes);
    const [methods, setMethods] = useState(node.methods);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    onClick={() => {
                        node.className = className;
                        node.attributes = attributes;
                        node.methods = methods;
                        setEditMode(false);
                    }}
                >
                    <SaveIcon />
                </Button>
            </div>
            <div style={{ backgroundColor: 'white' }}>
                <TextField
                    value={className}
                    placeholder={'Class Name'}
                    onChange={(event) => setClassName(event.target.value)}
                    fullWidth={true}
                />
                <TextField
                    fullWidth={true}
                    value={attributes[0]}
                    placeholder={'Attribute'}
                    onChange={(event) => setAttributes([event.target.value])}
                />
                <TextField
                    fullWidth={true}
                    value={methods[0]}
                    placeholder={'Method'}
                    onChange={(event) => setMethods([event.target.value])}
                />
            </div>
        </>
    );
};
