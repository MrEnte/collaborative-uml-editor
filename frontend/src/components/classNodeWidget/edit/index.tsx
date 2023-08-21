import { FC, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import SaveIcon from '@mui/icons-material/Save';
import { TextFieldWithButton } from './textFieldWithButton';

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
            <Box
                sx={{
                    backgroundColor: 'white',
                    border: node.isSelected() ? '2px solid red' : 'none',
                }}
            >
                <TextField
                    value={className}
                    placeholder={'Class Name'}
                    onChange={(event) => setClassName(event.target.value)}
                    fullWidth={true}
                />
                <TextFieldWithButton
                    setValues={setAttributes}
                    values={attributes}
                    placeholder={'Attribute'}
                />
                <TextFieldWithButton
                    setValues={setMethods}
                    values={methods}
                    placeholder={'Method'}
                />
            </Box>
        </>
    );
};
