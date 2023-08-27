import { ArrowLinkModel } from '../../../utils/arrowLink/arrowLinkModel';
import { PointModel } from '@projectstorm/react-diagrams';
import React, { FC, useEffect } from 'react';
import { LinkTypeMenu } from './linkTypeMenu';

type Props = {
    link: ArrowLinkModel;
    point: PointModel;
    previousPoint: PointModel;
};

export const UmlLinkWithTypeSelector: FC<Props> = ({
    link,
    point,
    previousPoint,
}) => {
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
                        points='0,10 8,30 0,50 -8,30'
                        fillOpacity={0}
                        strokeWidth={2}
                        stroke='red'
                    />
                </g>
            </g>
        </g>
    );
};
