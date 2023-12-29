import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { DiagramModel } from '@projectstorm/react-diagrams';
import { ClassNodeModel } from '../../../utils/classNode/classNodeModel';
import { ClassSelector } from './classSelector';
import { Merger } from './merger';

type Props = {
    individualModel: DiagramModel;
};

export const ClassMerger: FC<Props> = ({ individualModel }) => {
    const nodes = individualModel.getNodes();

    const [selectedSide, setSelectedSide] = useState<'' | 'left' | 'right'>('');
    const [leftClass, setLeftClass] = useState<ClassNodeModel>();
    const [rightClass, setRightClass] = useState<ClassNodeModel>();

    // TODO fix this if possible
    useEffect(() => {
        nodes.forEach((node) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            node.registerListener({
                selectionChanged: (event) => {
                    if (event.entity.isSelected()) {
                        if (selectedSide === 'left') {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            setLeftClass(event.entity);
                        } else if (selectedSide === 'right') {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            setRightClass(event.entity);
                        }
                        setSelectedSide('');
                    }
                },
            });
        });
    }, [nodes, selectedSide]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
            }}
        >
            <ClassSelector
                selectedClass={leftClass}
                selectedSide={selectedSide}
                setSelectedSide={setSelectedSide}
                thisSide={'left'}
            />
            <Merger leftClass={leftClass} rightClass={rightClass} />
            <ClassSelector
                selectedClass={rightClass}
                selectedSide={selectedSide}
                setSelectedSide={setSelectedSide}
                thisSide={'right'}
            />
        </Box>
    );
};
