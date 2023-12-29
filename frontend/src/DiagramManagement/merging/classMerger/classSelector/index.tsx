import { ClassNodeModel } from '../../../../utils/classNode/classNodeModel';
import { FC } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';

type ClassSelectorProps = {
    thisSide: 'left' | 'right';
    selectedSide: 'left' | 'right' | '';
    setSelectedSide: (selectedSide: 'left' | 'right' | '') => void;
    selectedClass?: ClassNodeModel;
};
export const ClassSelector: FC<ClassSelectorProps> = ({
    thisSide,
    selectedSide,
    setSelectedSide,
    selectedClass,
}) => {
    const buttonText =
        selectedSide === thisSide
            ? `Selecting for ${thisSide}`
            : `Select for ${thisSide} side`;
    return (
        <Box
            sx={{
                width: '33%',
                boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Button onClick={() => setSelectedSide(thisSide)}>
                {buttonText}
            </Button>
            {selectedClass && (
                <Box
                    sx={{
                        margin: '5px',
                        padding: '5px',
                        boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'white',
                    }}
                >
                    <Typography>{selectedClass.className}</Typography>
                    <Divider />
                    {selectedClass.attributes.map((attribute) => (
                        <Typography>{attribute}</Typography>
                    ))}
                    <Divider />
                    {selectedClass.methods.map((method) => (
                        <Typography>{method}</Typography>
                    ))}
                </Box>
            )}
        </Box>
    );
};
