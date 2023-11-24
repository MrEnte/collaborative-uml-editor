import { FC } from 'react';
import { GroupAddForm } from './form';
import { Template } from '../../Template';
import { Paper } from '@mui/material';

export const AddGroupPage: FC = () => {
    return (
        <Template title={'Add Group'}>
            <GroupAddForm />
        </Template>
    );
};
