import { FC } from 'react';
import { TaskAddForm } from './form';
import { Template } from '../../Template';

export const TaskAddPage: FC = () => {
    return (
        <Template title={'Add Group'}>
            <TaskAddForm />
        </Template>
    );
};
