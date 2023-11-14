import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { DiagramsOverview } from '../diagramsOverview';

export const LandingPage: FC = () => {
    return (
        <Box sx={{ padding: '15px' }}>
            <Typography variant={'h2'}>Welcome to the UML-Editor</Typography>
            <Typography>Please select a Diagram</Typography>
            <DiagramsOverview />
        </Box>
    );
};
