import { FC, useState } from 'react';
import { ClassNodeModel } from '../../../../utils/classNode/classNodeModel';
import { Box, Button, Divider, Typography } from '@mui/material';

type Props = {
    leftClass?: ClassNodeModel;
    rightClass?: ClassNodeModel;
};

export const Merger: FC<Props> = ({ leftClass, rightClass }) => {
    const [className, setClassName] = useState<string>('');
    const [attributes, setAttributes] = useState<string[]>([]);
    const [methods, setMethods] = useState<string[]>([]);
    const [status, setStatus] = useState<'selecting' | 'merged'>('selecting');
    const mergeClasses = () => {
        if (
            leftClass?.className &&
            leftClass?.className === rightClass?.className
        ) {
            setClassName(leftClass?.className);
        }

        setAttributes(
            mergeArrays(leftClass?.attributes, rightClass?.attributes)
        );
        setMethods(mergeArrays(leftClass?.methods, rightClass?.methods));

        setStatus('merged');
    };

    return (
        <>
            <Box
                sx={{
                    width: '34%',
                    boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '5px',
                }}
            >
                {!leftClass && !rightClass && (
                    <Typography>Please select two classes</Typography>
                )}
                {leftClass && rightClass && (
                    <>
                        {status === 'selecting' ? (
                            <Button onClick={mergeClasses}>Merge</Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    setClassName('');
                                    setAttributes([]);
                                    setMethods([]);
                                    setStatus('selecting');
                                }}
                            >
                                Reset
                            </Button>
                        )}
                        {status === 'merged' && (
                            <Box
                                sx={{
                                    margin: '5px',
                                    padding: '5px',
                                    boxShadow:
                                        '2px 4px 8px 2px rgba(0, 0, 0, 0.2)',
                                    backgroundColor: 'white',
                                }}
                                draggable
                                onDragStart={(event) => {
                                    event.dataTransfer.setData(
                                        'storm-diagram-node',
                                        JSON.stringify({
                                            className,
                                            attributes,
                                            methods,
                                        })
                                    );
                                }}
                            >
                                <Typography>{className}</Typography>
                                <Divider />
                                {attributes.map((attribute) => (
                                    <Typography>{attribute}</Typography>
                                ))}
                                <Divider />
                                {methods.map((method) => (
                                    <Typography>{method}</Typography>
                                ))}
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    );
};

function mergeArrays(
    firstArray: string[] | undefined,
    secondArray: string[] | undefined
) {
    let unifiedItems: string[] = [];
    if (firstArray && secondArray) {
        const mergedItems = [...firstArray, ...secondArray];

        mergedItems.forEach((item) => {
            if (!unifiedItems.includes(item)) {
                unifiedItems.push(item);
            }
        });
    } else if (firstArray) {
        unifiedItems = firstArray;
    } else if (secondArray) {
        unifiedItems = secondArray;
    }

    return unifiedItems;
}
