import { ArrowLinkModel } from '../../../utils/arrowLink/arrowLinkModel';
import { PointModel } from '@projectstorm/react-diagrams';
import React, { FC, useEffect } from 'react';
import { LinkTypeMenu } from './linkTypeMenu';
import { EditableLinkLabelModel } from '../../../utils/editableLinkLabel/editableLinkLabelModel';

type Props = {
    link: ArrowLinkModel;
    point: PointModel;
    previousPoint: PointModel;
};

const CONNECTION_TYPE_TO_POLYGON_POINTS: {
    [key in ArrowLinkModel['connectionType']]: string;
} = {
    inheritance: '0,10 8,30 -8,30',
    implementation: '0,10 8,30 -8,30',
    aggregation: '0,10 8,30 0,50 -8,30',
    composition: '0,10 8,30 0,50 -8,30',
    association: '0,10 8,30 0,10 -8,30',
    dependency: '0,10 8,30 0,10 -8,30',
    none: '',
};

export const UmlLinkWithTypeSelector: FC<Props> = ({
    link,
    point,
    previousPoint,
}) => {
    const color = link.getOptions().color;
    const selectedColor = link.getOptions().selectedColor;

    const isSelected = link.isSelected();

    const connectionType = link.connectionType;
    const [menuOpen, setMenuOpen] = React.useState(false);

    useEffect(() => {
        if (connectionType === 'none') {
            setMenuOpen(true);
        }
    }, [connectionType]);

    if (connectionType === 'none') {
        return (
            <LinkTypeMenu
                link={link}
                point={point}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />
        );
    }

    if (connectionType === 'association') {
        return null;
    }

    const angle =
        90 +
        (Math.atan2(
            point.getPosition().y - previousPoint.getPosition().y,
            point.getPosition().x - previousPoint.getPosition().x
        ) *
            180) /
            Math.PI;

    return (
        <g
            transform={`translate(${point.getPosition().x}, ${
                point.getPosition().y
            })`}
        >
            <g style={{ transform: `rotate(${angle}deg)` }}>
                <g transform={'translate(0, -3)'}>
                    <polygon
                        points={
                            CONNECTION_TYPE_TO_POLYGON_POINTS[connectionType]
                        }
                        fill={
                            connectionType === 'composition' ? color : '#333333'
                        }
                        strokeWidth={2}
                        stroke={isSelected ? selectedColor : color}
                    />
                </g>
            </g>
        </g>
    );
};
