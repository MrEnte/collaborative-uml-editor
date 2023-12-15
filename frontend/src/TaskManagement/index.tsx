import { FC } from 'react';
import { Template } from '../Template';
import { useFetch } from '../utils/hooks/useFetch';
import { useParams } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import { SubtaskManagement } from '../SubtaskManagement';

export type TaskData = {
    id: number;
    group: string;
    description: string;
    created_by: number;
    status: 'ANALYSING' | 'MODELLING' | 'DONE';
};

export const TaskManagementPage: FC = () => {
    const { groupId = '', taskId = '' } = useParams();
    const { data } = useFetch<TaskData>(`group/${groupId}/task/${taskId}/`);

    if (!data) {
        return null;
    }

    return (
        <Template title={'Task from ' + data.group}>
            <Typography variant='h4'>Task Description</Typography>
            <br />
            <Typography sx={{ whiteSpace: 'pre-line' }} variant='body1'>
                {data.description}
            </Typography>
            <Divider sx={{ margin: '25px' }} />
            <Typography variant='h4'>Subtasks</Typography>
            <SubtaskManagement taskId={taskId} />
        </Template>
    );
};
