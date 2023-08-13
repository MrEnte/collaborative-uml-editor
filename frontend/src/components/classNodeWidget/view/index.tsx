import { FC } from 'react';
import { Button } from '@mui/material';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    node: ClassNodeModel;
    setEditMode: (editMode: boolean) => void;
};

export const ClassNodeViewMode: FC<Props> = ({ node, setEditMode }) => {
    return (
        <>
            <Button onClick={() => setEditMode(true)}>
                <EditIcon />
            </Button>
            <div style={{ backgroundColor: 'white' }}>
                <p>{node.className}</p>
                <p>{node.attributes[0]}</p>
                <p>{node.methods[0]}</p>
            </div>
        </>
    );
};
