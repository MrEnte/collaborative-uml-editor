import { FC, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import SaveIcon from '@mui/icons-material/Save';
import { TextFieldWithButton } from './textFieldWithButton';

type Props = {
    model: ClassNodeModel;
    setEditMode: (editMode: boolean) => void;
};

export const ClassNodeEditMode: FC<Props> = ({ model, setEditMode }) => {
    const [className, setClassName] = useState(model.className);
    const [attributes, setAttributes] = useState(model.attributes);
    const [methods, setMethods] = useState(model.methods);

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Button
                    onClick={() => {
                        model.className = className;
                        model.attributes = attributes.filter((item) => !!item);
                        model.methods = methods.filter((item) => !!item);

                        setEditMode(false);
                    }}
                >
                    <SaveIcon />
                </Button>
            </div>
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '5px',
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
