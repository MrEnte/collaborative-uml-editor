import { FC, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    setValues: (values: string[]) => void;
    values: string[];
    placeholder: string;
};

export const TextFieldWithButton: FC<Props> = ({
    setValues,
    values,
    placeholder,
}) => {
    useEffect(() => setValues(values), [values]);

    if (values.length === 0) {
        values.push('');
    }
    return (
        <>
            {values.map((value, index) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <TextField
                        key={index}
                        fullWidth={true}
                        value={value}
                        placeholder={placeholder}
                        onChange={(event) => {
                            const newValues = [...values];
                            newValues[index] = event.target.value;
                            setValues(newValues);
                        }}
                    />
                    {index === values.length - 1 ? (
                        <AddButton values={values} setValues={setValues} />
                    ) : (
                        <DeleteButton
                            values={values}
                            setValues={setValues}
                            index={index}
                        />
                    )}
                </div>
            ))}
        </>
    );
};

const AddButton: FC<Pick<Props, 'values' | 'setValues'>> = ({
    values,
    setValues,
}) => {
    return (
        <Button
            onClick={() => {
                const newValues = [...values];
                newValues.push('');
                setValues(newValues);
            }}
        >
            <AddIcon />
        </Button>
    );
};

const DeleteButton: FC<
    Pick<Props, 'values' | 'setValues'> & { index: number }
> = ({ values, setValues, index }) => {
    return (
        <Button
            onClick={() => {
                const newValues = [...values];
                newValues.splice(index, 1);
                setValues(newValues);
            }}
        >
            <DeleteIcon />
        </Button>
    );
};
